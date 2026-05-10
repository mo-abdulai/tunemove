import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import {
  clearSpotifyConnection,
  getSpotifyConnection,
  getValidSpotifyAccessToken,
  setSpotifyConnection,
} from "@/lib/spotify-connection-store";
import {
  fetchSpotifyCurrentUserProfile,
  SpotifyApiError,
} from "@/lib/spotify";

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
        code: "SPOTIFY_PROFILE_FETCH_FAILED",
        message: "Unable to fetch Spotify profile.",
      },
    },
    { status: 502 },
  );
}

export async function GET() {
  const { userId } = await auth();

  if (!userId) {
    return buildUnauthorizedResponse();
  }

  const accessToken = await getValidSpotifyAccessToken(userId);
  if (!accessToken) {
    return buildNotConnectedResponse();
  }

  try {
    const profile = await fetchSpotifyCurrentUserProfile(accessToken);
    const currentConnection = getSpotifyConnection(userId);

    if (currentConnection) {
      setSpotifyConnection(userId, {
        ...currentConnection,
        profile,
      });
    }

    return NextResponse.json({
      success: true,
      data: profile,
    });
  } catch (error) {
    if (error instanceof SpotifyApiError && error.status === 401) {
      clearSpotifyConnection(userId);
      return buildNotConnectedResponse();
    }

    return buildFetchFailedResponse();
  }
}

