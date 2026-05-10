import type {
  SpotifyPlaylist,
  SpotifyPlaylistsResponse,
  SpotifyProfile,
  SpotifyProfileResponse,
  SpotifyTokenResponse,
} from "@/types/spotify";

const SPOTIFY_ACCOUNTS_BASE_URL = "https://accounts.spotify.com";
const SPOTIFY_API_BASE_URL = "https://api.spotify.com/v1";

export const SPOTIFY_SCOPES = [
  "user-read-private",
  "user-read-email",
  "playlist-read-private",
  "playlist-read-collaborative",
] as const;

export class SpotifyApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly code: string,
  ) {
    super(message);
    this.name = "SpotifyApiError";
  }
}

type SpotifyConfig = {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
};

type ExchangeCodeForTokensInput = {
  code: string;
};

type RefreshAccessTokenInput = {
  refreshToken: string;
};

type FetchPlaylistsInput = {
  accessToken: string;
  limit?: number;
  offset?: number;
};

type SpotifyPlaylistsResult = {
  playlists: SpotifyPlaylist[];
  total: number;
  limit: number;
  offset: number;
  next: string | null;
  previous: string | null;
};

function getSpotifyConfig(): SpotifyConfig {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  const redirectUri = process.env.SPOTIFY_REDIRECT_URI;

  if (!clientId || !clientSecret || !redirectUri) {
    throw new SpotifyApiError(
      "Spotify environment variables are not fully configured.",
      500,
      "SPOTIFY_CONFIG_MISSING",
    );
  }

  return {
    clientId,
    clientSecret,
    redirectUri,
  };
}

function buildSpotifyBasicAuthHeaderValue() {
  const { clientId, clientSecret } = getSpotifyConfig();
  const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString(
    "base64",
  );
  return `Basic ${credentials}`;
}

function getSpotifyRequestHeaders(accessToken: string) {
  return {
    Authorization: `Bearer ${accessToken}`,
  };
}

async function parseSpotifyErrorResponse(response: Response): Promise<string> {
  try {
    const data = (await response.json()) as
      | {
          error?: string | { message?: string };
          error_description?: string;
        }
      | undefined;

    if (data?.error_description) {
      return data.error_description;
    }

    if (typeof data?.error === "string") {
      return data.error;
    }

    if (typeof data?.error === "object" && data.error?.message) {
      return data.error.message;
    }
  } catch {
    // Ignore parse issues and fall back to a generic message below.
  }

  return "Spotify request failed.";
}

async function assertSpotifyResponseOk(response: Response, code: string) {
  if (!response.ok) {
    const message = await parseSpotifyErrorResponse(response);
    throw new SpotifyApiError(message, response.status, code);
  }
}

function getFirstImageUrl(images: Array<{ url: string }> | undefined) {
  const imageUrl = images?.[0]?.url;
  return imageUrl ?? null;
}

function normalizeOptionalText(value: string | null | undefined) {
  if (!value) {
    return null;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

export function buildSpotifyAuthorizationUrl(state: string) {
  const { clientId, redirectUri } = getSpotifyConfig();
  const params = new URLSearchParams({
    response_type: "code",
    client_id: clientId,
    redirect_uri: redirectUri,
    scope: SPOTIFY_SCOPES.join(" "),
    state,
  });

  return `${SPOTIFY_ACCOUNTS_BASE_URL}/authorize?${params.toString()}`;
}

export async function exchangeSpotifyCodeForTokens({
  code,
}: ExchangeCodeForTokensInput): Promise<SpotifyTokenResponse> {
  const { redirectUri } = getSpotifyConfig();

  const response = await fetch(`${SPOTIFY_ACCOUNTS_BASE_URL}/api/token`, {
    method: "POST",
    headers: {
      Authorization: buildSpotifyBasicAuthHeaderValue(),
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: redirectUri,
    }),
    cache: "no-store",
  });

  await assertSpotifyResponseOk(response, "SPOTIFY_TOKEN_EXCHANGE_FAILED");

  return (await response.json()) as SpotifyTokenResponse;
}

export async function refreshSpotifyAccessToken({
  refreshToken,
}: RefreshAccessTokenInput): Promise<SpotifyTokenResponse> {
  const response = await fetch(`${SPOTIFY_ACCOUNTS_BASE_URL}/api/token`, {
    method: "POST",
    headers: {
      Authorization: buildSpotifyBasicAuthHeaderValue(),
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    }),
    cache: "no-store",
  });

  await assertSpotifyResponseOk(response, "SPOTIFY_TOKEN_REFRESH_FAILED");

  return (await response.json()) as SpotifyTokenResponse;
}

export function normalizeSpotifyProfile(
  profile: SpotifyProfileResponse,
): SpotifyProfile {
  return {
    id: profile.id,
    displayName: normalizeOptionalText(profile.display_name),
    email: normalizeOptionalText(profile.email),
    imageUrl: getFirstImageUrl(profile.images),
  };
}

export async function fetchSpotifyCurrentUserProfile(
  accessToken: string,
): Promise<SpotifyProfile> {
  const response = await fetch(`${SPOTIFY_API_BASE_URL}/me`, {
    method: "GET",
    headers: getSpotifyRequestHeaders(accessToken),
    cache: "no-store",
  });

  await assertSpotifyResponseOk(response, "SPOTIFY_PROFILE_FETCH_FAILED");

  const profile = (await response.json()) as SpotifyProfileResponse;
  return normalizeSpotifyProfile(profile);
}

export function normalizeSpotifyPlaylist(
  playlist: SpotifyPlaylistsResponse["items"][number],
): SpotifyPlaylist {
  return {
    id: playlist.id,
    name: playlist.name,
    description: normalizeOptionalText(playlist.description),
    imageUrl: getFirstImageUrl(playlist.images),
    trackCount: playlist.tracks.total,
    ownerName: normalizeOptionalText(playlist.owner.display_name),
    externalUrl: normalizeOptionalText(playlist.external_urls.spotify),
  };
}

export async function fetchSpotifyCurrentUserPlaylists({
  accessToken,
  limit = 20,
  offset = 0,
}: FetchPlaylistsInput): Promise<SpotifyPlaylistsResult> {
  const params = new URLSearchParams({
    limit: String(limit),
    offset: String(offset),
  });

  const response = await fetch(
    `${SPOTIFY_API_BASE_URL}/me/playlists?${params.toString()}`,
    {
      method: "GET",
      headers: getSpotifyRequestHeaders(accessToken),
      cache: "no-store",
    },
  );

  await assertSpotifyResponseOk(response, "SPOTIFY_PLAYLISTS_FETCH_FAILED");

  const data = (await response.json()) as SpotifyPlaylistsResponse;

  return {
    playlists: data.items.map(normalizeSpotifyPlaylist),
    total: data.total,
    limit: data.limit,
    offset: data.offset,
    next: data.next,
    previous: data.previous,
  };
}

