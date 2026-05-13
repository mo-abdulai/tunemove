import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import {
  clearSpotifyConnection,
  getSpotifyConnection,
  getValidSpotifyAccessToken,
} from "@/lib/spotify-connection-store";
import {
  fetchSpotifyPlaylistWithTracks,
  SpotifyApiError,
} from "@/lib/spotify";

type PlaylistTracksRouteContext = {
  params: Promise<{
    playlistId: string;
  }>;
};

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

function buildInvalidPlaylistIdResponse() {
  return NextResponse.json(
    {
      success: false,
      error: {
        code: "INVALID_PLAYLIST_ID",
        message: "Playlist id is invalid.",
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

function buildPlaylistNotFoundResponse() {
  return NextResponse.json(
    {
      success: false,
      error: {
        code: "SPOTIFY_PLAYLIST_NOT_FOUND",
        message: "Spotify playlist could not be found.",
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
        code: "SPOTIFY_PLAYLIST_TRACKS_FETCH_FAILED",
        message: "Unable to fetch Spotify playlist tracks.",
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

function buildPlaylistAccessDeniedResponse() {
  return NextResponse.json(
    {
      success: false,
      error: {
        code: "SPOTIFY_PLAYLIST_ACCESS_DENIED",
        message:
          "Spotify only allows playlist items for playlists you own or collaborate on.",
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
        message: "Spotify returned an invalid playlist tracks payload.",
      },
    },
    { status: 502 },
  );
}

function logSpotifyPlaylistTracksFailure(
  message: string,
  details: Record<string, unknown>,
) {
  console.error("[spotify-playlist-tracks] " + message, details);
}

function normalizePlaylistId(rawPlaylistId: string) {
  const trimmedPlaylistId = rawPlaylistId.trim();
  return trimmedPlaylistId.length > 0 ? trimmedPlaylistId : null;
}

function hasPlaylistReadScope(scopeValue: string | null | undefined) {
  if (!scopeValue) {
    return false;
  }

  const scopes = new Set(
    scopeValue
      .split(/\s+/)
      .map((scope) => scope.trim())
      .filter((scope) => scope.length > 0),
  );

  return scopes.has("playlist-read-private");
}

export async function GET(
  _request: Request,
  context: PlaylistTracksRouteContext,
) {
  const { userId } = await auth();

  if (!userId) {
    return buildUnauthorizedResponse();
  }

  const { playlistId: rawPlaylistId } = await context.params;
  const playlistId = normalizePlaylistId(rawPlaylistId);

  if (!playlistId) {
    return buildInvalidPlaylistIdResponse();
  }

  const accessToken = await getValidSpotifyAccessToken(userId);
  if (!accessToken) {
    return buildNotConnectedResponse();
  }

  const spotifyConnection = await getSpotifyConnection(userId);
  const tokenHasPlaylistReadScope = hasPlaylistReadScope(
    spotifyConnection?.scope ?? null,
  );

  try {
    const { playlist, tracks, total } = await fetchSpotifyPlaylistWithTracks({
      accessToken,
      playlistId,
    });

    return NextResponse.json({
      success: true,
      data: {
        playlist,
        tracks,
        total,
      },
    });
  } catch (error) {
    if (error instanceof SpotifyApiError) {
      if (error.code.endsWith("_TIMEOUT")) {
        logSpotifyPlaylistTracksFailure("request timeout", {
          spotifyCode: error.code,
          spotifyStatus: error.status,
          spotifyMessage: error.message,
          playlistId,
        });
        return buildTimeoutResponse();
      }

      if (error.code.endsWith("_NETWORK")) {
        logSpotifyPlaylistTracksFailure("network failure", {
          spotifyCode: error.code,
          spotifyStatus: error.status,
          spotifyMessage: error.message,
          playlistId,
        });
        return buildNetworkErrorResponse();
      }

      if (error.status === 401) {
        await clearSpotifyConnection(userId);
        return buildNotConnectedResponse();
      }

      if (error.status === 403) {
        const errorMessage = error.message.toLowerCase();

        if (errorMessage.includes("scope") && !tokenHasPlaylistReadScope) {
          return buildInsufficientScopeResponse();
        }

        return buildPlaylistAccessDeniedResponse();
      }

      if (error.status === 404) {
        return buildPlaylistNotFoundResponse();
      }

      if (error.status === 429) {
        return buildRateLimitedResponse(error.retryAfterSeconds);
      }

      if (
        error.code === "SPOTIFY_PLAYLIST_RESPONSE_INVALID" ||
        error.code === "SPOTIFY_PLAYLIST_TRACKS_RESPONSE_INVALID"
      ) {
        logSpotifyPlaylistTracksFailure("invalid upstream payload", {
          spotifyCode: error.code,
          spotifyStatus: error.status,
          spotifyMessage: error.message,
          playlistId,
        });
        return buildInvalidSpotifyPayloadResponse();
      }

      if (error.status >= 500 && error.status <= 599) {
        logSpotifyPlaylistTracksFailure("upstream unavailable", {
          spotifyCode: error.code,
          spotifyStatus: error.status,
          spotifyMessage: error.message,
          playlistId,
        });
        return buildUpstreamUnavailableResponse();
      }

      logSpotifyPlaylistTracksFailure("unexpected spotify api error", {
        spotifyCode: error.code,
        spotifyStatus: error.status,
        spotifyMessage: error.message,
        playlistId,
      });
      return buildFetchFailedResponse();
    }

    logSpotifyPlaylistTracksFailure("unexpected non-spotify error", {
      error:
        error instanceof Error
          ? { name: error.name, message: error.message }
          : String(error),
      playlistId,
    });

    return buildFetchFailedResponse();
  }
}
