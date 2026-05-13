import { NextRequest, NextResponse } from "next/server";

import { verifySignedSpotifyOAuthState } from "@/lib/spotify-oauth-state";
import { setSpotifyConnection } from "@/lib/spotify-connection-store";
import {
  exchangeSpotifyCodeForTokens,
  fetchSpotifyCurrentUserProfile,
  SpotifyApiError,
} from "@/lib/spotify";
import type { SpotifyProfile } from "@/types/spotify";

function getConfiguredSpotifyOrigin() {
  const redirectUri = process.env.SPOTIFY_REDIRECT_URI?.trim();

  if (!redirectUri) {
    return null;
  }

  try {
    return new URL(redirectUri).origin;
  } catch {
    return null;
  }
}

function buildConnectionsRedirect(
  origin: string,
  status: "connected" | "failed" | "cancelled",
  reason?: string,
) {
  const redirectUrl = new URL(`/dashboard/connections?spotify=${status}`, origin);

  if (reason) {
    redirectUrl.searchParams.set("reason", reason);
  }

  return NextResponse.redirect(redirectUrl);
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const spotifyError = searchParams.get("error");
  const callbackOrigin = request.nextUrl.origin;

  if (!state) {
    return buildConnectionsRedirect(callbackOrigin, "failed", "state_missing");
  }

  const verifiedState = verifySignedSpotifyOAuthState(state);
  if (!verifiedState.success) {
    return buildConnectionsRedirect(
      callbackOrigin,
      "failed",
      `state_${verifiedState.reason}`,
    );
  }

  const configuredSpotifyOrigin = getConfiguredSpotifyOrigin();
  const returnToOrigin =
    configuredSpotifyOrigin ||
    verifiedState.payload.returnToOrigin ||
    callbackOrigin;

  if (spotifyError) {
    return buildConnectionsRedirect(returnToOrigin, "cancelled", spotifyError);
  }

  if (!code) {
    return buildConnectionsRedirect(returnToOrigin, "failed", "code_missing");
  }

  try {
    const tokenResponse = await exchangeSpotifyCodeForTokens({ code });
    let profile: SpotifyProfile = {
      id: "spotify-user",
      displayName: null,
      email: null,
      imageUrl: null,
    };

    try {
      profile = await fetchSpotifyCurrentUserProfile(tokenResponse.access_token);
    } catch (error) {
      if (error instanceof SpotifyApiError) {
        if (error.status !== 401 && error.status !== 403) {
          throw error;
        }
      } else {
        throw error;
      }
    }

    await setSpotifyConnection(verifiedState.payload.userId, {
      accessToken: tokenResponse.access_token,
      refreshToken: tokenResponse.refresh_token ?? null,
      expiresAt: Date.now() + tokenResponse.expires_in * 1000,
      tokenType: tokenResponse.token_type,
      scope: tokenResponse.scope,
      profile,
      connectedAt: new Date().toISOString(),
    });

    return buildConnectionsRedirect(returnToOrigin, "connected", "ok");
  } catch (error) {
    if (error instanceof SpotifyApiError) {
      return buildConnectionsRedirect(
        returnToOrigin,
        "failed",
        `${error.code.toLowerCase()}_${error.status}`,
      );
    }

    return buildConnectionsRedirect(returnToOrigin, "failed", "unknown_error");
  }
}
