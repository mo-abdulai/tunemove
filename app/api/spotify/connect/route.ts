import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

import { createSignedSpotifyOAuthState } from "@/lib/spotify-oauth-state";
import { buildSpotifyAuthorizationUrl } from "@/lib/spotify";

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

function buildInternalErrorResponse() {
  return NextResponse.json(
    {
      success: false,
      error: {
        code: "SPOTIFY_CONNECT_INIT_FAILED",
        message: "Unable to start Spotify connection.",
      },
    },
    { status: 500 },
  );
}

export async function GET(request: NextRequest) {
  const { userId } = await auth();

  if (!userId) {
    return buildUnauthorizedResponse();
  }

  try {
    const state = createSignedSpotifyOAuthState({
      userId,
      returnToOrigin: request.nextUrl.origin,
    });
    const authorizationUrl = buildSpotifyAuthorizationUrl(state);
    return NextResponse.redirect(authorizationUrl);
  } catch {
    return buildInternalErrorResponse();
  }
}
