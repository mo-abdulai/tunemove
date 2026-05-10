import "server-only";

import { refreshSpotifyAccessToken } from "@/lib/spotify";
import type { SpotifyConnection, SpotifyTokenResponse } from "@/types/spotify";

const REFRESH_WINDOW_MS = 60_000;

declare global {
  var __tunemoveSpotifyConnections:
    | Map<string, SpotifyConnection>
    | undefined;
}

const spotifyConnections =
  globalThis.__tunemoveSpotifyConnections ?? new Map<string, SpotifyConnection>();

globalThis.__tunemoveSpotifyConnections = spotifyConnections;

function buildUpdatedConnectionFromTokenResponse(
  currentConnection: SpotifyConnection,
  tokenResponse: SpotifyTokenResponse,
): SpotifyConnection {
  return {
    ...currentConnection,
    accessToken: tokenResponse.access_token,
    refreshToken: tokenResponse.refresh_token ?? currentConnection.refreshToken,
    tokenType: tokenResponse.token_type,
    scope: tokenResponse.scope,
    expiresAt: Date.now() + tokenResponse.expires_in * 1000,
  };
}

function isAccessTokenStale(connection: SpotifyConnection) {
  return connection.expiresAt <= Date.now() + REFRESH_WINDOW_MS;
}

export function getSpotifyConnection(userId: string) {
  return spotifyConnections.get(userId) ?? null;
}

export function setSpotifyConnection(
  userId: string,
  connection: SpotifyConnection,
) {
  spotifyConnections.set(userId, connection);
}

export function clearSpotifyConnection(userId: string) {
  spotifyConnections.delete(userId);
}

export async function getValidSpotifyAccessToken(userId: string) {
  const connection = spotifyConnections.get(userId);
  if (!connection) {
    return null;
  }

  if (!isAccessTokenStale(connection)) {
    return connection.accessToken;
  }

  if (!connection.refreshToken) {
    spotifyConnections.delete(userId);
    return null;
  }

  try {
    const refreshedTokens = await refreshSpotifyAccessToken({
      refreshToken: connection.refreshToken,
    });

    const updatedConnection = buildUpdatedConnectionFromTokenResponse(
      connection,
      refreshedTokens,
    );

    spotifyConnections.set(userId, updatedConnection);
    return updatedConnection.accessToken;
  } catch {
    spotifyConnections.delete(userId);
    return null;
  }
}
