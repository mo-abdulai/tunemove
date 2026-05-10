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
    if (error instanceof SpotifyApiError && error.status === 401) {
      clearSpotifyConnection(userId);
      return buildNotConnectedResponse();
    }

    return buildFetchFailedResponse();
  }
}

