import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

import {
  clearSpotifyConnection,
  getValidSpotifyAccessToken,
} from "@/lib/spotify-connection-store";
import {
  fetchSpotifyCurrentUserPlaylists,
  SpotifyApiError,
} from "@/lib/spotify";

const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 50;

function buildUnauthorizedResponse() {
  return NextResponse.json(
    {
      success: false,
      error: {
        code: "UNAUTHORIZED",
        message: "Authentication required.",
      },
    },
    { status: 401 },
  );
}

function buildInvalidQueryResponse() {
  return NextResponse.json(
    {
      success: false,
      error: {
        code: "INVALID_QUERY_PARAMS",
        message: "Query parameters are invalid.",
      },
    },
    { status: 400 },
  );
}

function buildNotConnectedResponse() {
  return NextResponse.json(
    {
      success: false,
      error: {
        code: "SPOTIFY_NOT_CONNECTED",
        message: "Spotify account is not connected.",
      },
    },
    { status: 404 },
  );
}

function buildFetchFailedResponse() {
  return NextResponse.json(
    {
      success: false,
      error: {
        code: "SPOTIFY_PLAYLISTS_FETCH_FAILED",
        message: "Unable to fetch Spotify playlists.",
      },
    },
    { status: 502 },
  );
}

function buildRateLimitedResponse(retryAfterSeconds?: number) {
  return NextResponse.json(
    {
      success: false,
      error: {
        code: "SPOTIFY_RATE_LIMITED",
        message: "Spotify rate limit reached. Please try again shortly.",
      },
      meta:
        typeof retryAfterSeconds === "number"
          ? { retryAfterSeconds }
          : undefined,
    },
    { status: 429 },
  );
}

function buildInsufficientScopeResponse() {
  return NextResponse.json(
    {
      success: false,
      error: {
        code: "SPOTIFY_INSUFFICIENT_SCOPE",
        message: "Spotify token is missing required playlist-read permissions.",
      },
    },
    { status: 403 },
  );
}

function buildUpstreamUnavailableResponse() {
  return NextResponse.json(
    {
      success: false,
      error: {
        code: "SPOTIFY_UPSTREAM_UNAVAILABLE",
        message: "Spotify is temporarily unavailable. Please try again.",
      },
    },
    { status: 503 },
  );
}

function buildTimeoutResponse() {
  return NextResponse.json(
    {
      success: false,
      error: {
        code: "SPOTIFY_REQUEST_TIMEOUT",
        message: "Spotify did not respond in time. Please retry.",
      },
    },
    { status: 504 },
  );
}

function buildNetworkErrorResponse() {
  return NextResponse.json(
    {
      success: false,
      error: {
        code: "SPOTIFY_NETWORK_ERROR",
        message:
          "Network error while reaching Spotify. Check your connection and retry.",
      },
    },
    { status: 502 },
  );
}

function buildInvalidSpotifyPayloadResponse() {
  return NextResponse.json(
    {
      success: false,
      error: {
        code: "SPOTIFY_RESPONSE_INVALID",
        message: "Spotify returned an invalid playlists payload.",
      },
    },
    { status: 502 },
  );
}

function logSpotifyPlaylistFailure(
  message: string,
  details: Record<string, unknown>,
) {
  console.error("[spotify-playlists] " + message, details);
}

function parseNumberParam(
  value: string | null,
  fallback: number,
  min: number,
  max: number,
) {
  if (value === null) {
    return fallback;
  }

  const parsedValue = Number(value);

  if (!Number.isInteger(parsedValue) || parsedValue < min || parsedValue > max) {
    return null;
  }

  return parsedValue;
}

export async function GET(request: NextRequest) {
  const { userId } = await auth();

  if (!userId) {
    return buildUnauthorizedResponse();
  }
  const limit = parseNumberParam(
    request.nextUrl.searchParams.get("limit"),
    DEFAULT_LIMIT,
    1,
    MAX_LIMIT,
  );
  const offset = parseNumberParam(
    request.nextUrl.searchParams.get("offset"),
    0,
    0,
    Number.MAX_SAFE_INTEGER,
  );

  if (limit === null || offset === null) {
    return buildInvalidQueryResponse();
  }

  const accessToken = await getValidSpotifyAccessToken(userId);
  if (!accessToken) {
    return buildNotConnectedResponse();
  }

  try {
    const { playlists } = await fetchSpotifyCurrentUserPlaylists({
      accessToken,
      limit,
      offset,
    });

    return NextResponse.json({
      success: true,
      data: {
        playlists,
      },
    });
  } catch (error) {
    if (error instanceof SpotifyApiError) {
      if (error.code.endsWith("_TIMEOUT")) {
        logSpotifyPlaylistFailure("request timeout", {
          spotifyCode: error.code,
          spotifyStatus: error.status,
          spotifyMessage: error.message,
        });
        return buildTimeoutResponse();
      }

      if (error.code.endsWith("_NETWORK")) {
        logSpotifyPlaylistFailure("network failure", {
          spotifyCode: error.code,
          spotifyStatus: error.status,
          spotifyMessage: error.message,
        });
        return buildNetworkErrorResponse();
      }

      if (error.status === 401) {
        await clearSpotifyConnection(userId);
        return buildNotConnectedResponse();
      }

      if (error.status === 403) {
        return buildInsufficientScopeResponse();
      }

      if (error.status === 429) {
        return buildRateLimitedResponse(error.retryAfterSeconds);
      }

      if (error.code === "SPOTIFY_PLAYLISTS_RESPONSE_INVALID") {
        logSpotifyPlaylistFailure("invalid upstream payload", {
          spotifyCode: error.code,
          spotifyStatus: error.status,
          spotifyMessage: error.message,
        });
        return buildInvalidSpotifyPayloadResponse();
      }

      if (error.status >= 500 && error.status <= 599) {
        logSpotifyPlaylistFailure("upstream unavailable", {
          spotifyCode: error.code,
          spotifyStatus: error.status,
          spotifyMessage: error.message,
        });
        return buildUpstreamUnavailableResponse();
      }

      logSpotifyPlaylistFailure("unexpected spotify api error", {
        spotifyCode: error.code,
        spotifyStatus: error.status,
        spotifyMessage: error.message,
      });
      return buildFetchFailedResponse();
    }

    logSpotifyPlaylistFailure("unexpected non-spotify error", {
      error:
        error instanceof Error
          ? { name: error.name, message: error.message }
          : String(error),
    });
    return buildFetchFailedResponse();
  }
}
