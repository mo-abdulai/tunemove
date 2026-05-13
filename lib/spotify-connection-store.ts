import "server-only";

import { cookies } from "next/headers";
import {
  createCipheriv,
  createDecipheriv,
  createHash,
  randomBytes,
} from "node:crypto";

import { refreshSpotifyAccessToken } from "@/lib/spotify";
import type { SpotifyConnection, SpotifyTokenResponse } from "@/types/spotify";

const REFRESH_WINDOW_MS = 60_000;
const SPOTIFY_CONNECTION_COOKIE_NAME = "tunemove_spotify_connection";
const SPOTIFY_CONNECTION_COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 30;
const CIPHER_ALGORITHM = "aes-256-gcm";
const CIPHER_IV_LENGTH = 12;

type StoredSpotifyConnection = {
  userId: string;
  connection: SpotifyConnection;
};

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

function getConnectionEncryptionSecret() {
  const secret = process.env.CLERK_SECRET_KEY ?? process.env.SPOTIFY_CLIENT_SECRET;
  return secret?.trim() || null;
}

function getConnectionEncryptionKey() {
  const secret = getConnectionEncryptionSecret();

  if (!secret) {
    return null;
  }

  return createHash("sha256").update(secret).digest();
}

function encryptConnectionPayload(payload: string, key: Buffer) {
  const iv = randomBytes(CIPHER_IV_LENGTH);
  const cipher = createCipheriv(CIPHER_ALGORITHM, key, iv);
  const encrypted = Buffer.concat([cipher.update(payload, "utf8"), cipher.final()]);
  const authTag = cipher.getAuthTag();

  return [
    iv.toString("base64url"),
    authTag.toString("base64url"),
    encrypted.toString("base64url"),
  ].join(".");
}

function decryptConnectionPayload(payload: string, key: Buffer) {
  const parts = payload.split(".");

  if (parts.length !== 3) {
    return null;
  }

  const [ivSegment, authTagSegment, encryptedSegment] = parts;

  if (!ivSegment || !authTagSegment || !encryptedSegment) {
    return null;
  }

  try {
    const iv = Buffer.from(ivSegment, "base64url");
    const authTag = Buffer.from(authTagSegment, "base64url");
    const encrypted = Buffer.from(encryptedSegment, "base64url");

    const decipher = createDecipheriv(CIPHER_ALGORITHM, key, iv);
    decipher.setAuthTag(authTag);

    const decrypted = Buffer.concat([
      decipher.update(encrypted),
      decipher.final(),
    ]);

    return decrypted.toString("utf8");
  } catch {
    return null;
  }
}

async function readStoredConnection() {
  const key = getConnectionEncryptionKey();
  if (!key) {
    return null;
  }

  const cookieStore = await cookies();
  const cookieValue = cookieStore.get(SPOTIFY_CONNECTION_COOKIE_NAME)?.value;
  if (!cookieValue) {
    return null;
  }

  const decrypted = decryptConnectionPayload(cookieValue, key);
  if (!decrypted) {
    return null;
  }

  try {
    return JSON.parse(decrypted) as StoredSpotifyConnection;
  } catch {
    return null;
  }
}

async function persistStoredConnection(value: StoredSpotifyConnection) {
  const key = getConnectionEncryptionKey();
  if (!key) {
    return;
  }

  const cookieStore = await cookies();
  const encrypted = encryptConnectionPayload(JSON.stringify(value), key);

  try {
    cookieStore.set({
      name: SPOTIFY_CONNECTION_COOKIE_NAME,
      value: encrypted,
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: SPOTIFY_CONNECTION_COOKIE_MAX_AGE_SECONDS,
    });
  } catch {
    // Ignore when invoked from read-only server render contexts.
  }
}

export async function getSpotifyConnection(userId: string) {
  const stored = await readStoredConnection();

  if (!stored || stored.userId !== userId) {
    return null;
  }

  return stored.connection;
}

export async function setSpotifyConnection(
  userId: string,
  connection: SpotifyConnection,
) {
  await persistStoredConnection({
    userId,
    connection,
  });
}

export async function clearSpotifyConnection(userId: string) {
  void userId;

  const cookieStore = await cookies();

  try {
    cookieStore.delete(SPOTIFY_CONNECTION_COOKIE_NAME);
  } catch {
    // Ignore when invoked from read-only server render contexts.
  }
}

export async function getValidSpotifyAccessToken(userId: string) {
  const connection = await getSpotifyConnection(userId);
  if (!connection) {
    return null;
  }

  if (!isAccessTokenStale(connection)) {
    return connection.accessToken;
  }

  if (!connection.refreshToken) {
    await clearSpotifyConnection(userId);
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

    await setSpotifyConnection(userId, updatedConnection);
    return updatedConnection.accessToken;
  } catch {
    await clearSpotifyConnection(userId);
    return null;
  }
}
