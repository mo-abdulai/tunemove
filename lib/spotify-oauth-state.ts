import "server-only";

import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";

const SPOTIFY_OAUTH_STATE_TTL_MS = 10 * 60 * 1000;

type SpotifyOAuthStatePayload = {
  userId: string;
  returnToOrigin: string;
  nonce: string;
  issuedAt: number;
};

type VerifySpotifyOAuthStateResult =
  | {
      success: true;
      payload: SpotifyOAuthStatePayload;
    }
  | {
      success: false;
      reason: "malformed" | "signature_mismatch" | "expired" | "secret_missing";
    };

function getStateSecret() {
  const secret = process.env.CLERK_SECRET_KEY ?? process.env.SPOTIFY_CLIENT_SECRET;
  return secret?.trim() || null;
}

function encodeBase64Url(input: string) {
  return Buffer.from(input, "utf-8").toString("base64url");
}

function decodeBase64Url(input: string) {
  return Buffer.from(input, "base64url").toString("utf-8");
}

function signValue(value: string, secret: string) {
  return createHmac("sha256", secret).update(value).digest("base64url");
}

function safeCompare(a: string, b: string) {
  const left = Buffer.from(a);
  const right = Buffer.from(b);

  if (left.length !== right.length) {
    return false;
  }

  return timingSafeEqual(left, right);
}

export function createSignedSpotifyOAuthState(input: {
  userId: string;
  returnToOrigin: string;
}) {
  const secret = getStateSecret();

  if (!secret) {
    throw new Error("Missing signing secret for Spotify OAuth state.");
  }

  const payload: SpotifyOAuthStatePayload = {
    userId: input.userId,
    returnToOrigin: input.returnToOrigin,
    nonce: randomUUID(),
    issuedAt: Date.now(),
  };

  const payloadSegment = encodeBase64Url(JSON.stringify(payload));
  const signatureSegment = signValue(payloadSegment, secret);

  return `${payloadSegment}.${signatureSegment}`;
}

export function verifySignedSpotifyOAuthState(
  state: string,
): VerifySpotifyOAuthStateResult {
  const secret = getStateSecret();

  if (!secret) {
    return {
      success: false,
      reason: "secret_missing",
    };
  }

  const parts = state.split(".");
  if (parts.length !== 2) {
    return {
      success: false,
      reason: "malformed",
    };
  }

  const [payloadSegment, signatureSegment] = parts;

  if (!payloadSegment || !signatureSegment) {
    return {
      success: false,
      reason: "malformed",
    };
  }

  const expectedSignature = signValue(payloadSegment, secret);
  if (!safeCompare(expectedSignature, signatureSegment)) {
    return {
      success: false,
      reason: "signature_mismatch",
    };
  }

  let payload: SpotifyOAuthStatePayload;

  try {
    payload = JSON.parse(
      decodeBase64Url(payloadSegment),
    ) as SpotifyOAuthStatePayload;
  } catch {
    return {
      success: false,
      reason: "malformed",
    };
  }

  if (
    typeof payload.userId !== "string" ||
    typeof payload.returnToOrigin !== "string" ||
    typeof payload.nonce !== "string" ||
    typeof payload.issuedAt !== "number"
  ) {
    return {
      success: false,
      reason: "malformed",
    };
  }

  if (Date.now() - payload.issuedAt > SPOTIFY_OAUTH_STATE_TTL_MS) {
    return {
      success: false,
      reason: "expired",
    };
  }

  return {
    success: true,
    payload,
  };
}

