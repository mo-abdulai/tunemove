import type {
  SpotifyPlaylist,
  SpotifyPlaylistsResponse,
  SpotifyProfile,
  SpotifyProfileResponse,
  SpotifyTokenResponse,
} from "@/types/spotify";

const SPOTIFY_ACCOUNTS_BASE_URL = "https://accounts.spotify.com";
const SPOTIFY_API_BASE_URL = "https://api.spotify.com/v1";
const SPOTIFY_TRANSIENT_ERROR_MAX_RETRIES = 2;
const SPOTIFY_RETRY_BASE_DELAY_MS = 350;
const SPOTIFY_REQUEST_TIMEOUT_MS = 6_000;

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
    public readonly retryAfterSeconds?: number,
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

type SpotifyPlaylistTrackTotalResponse = {
  tracks?: {
    total?: number | null;
  } | null;
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

function isAbortError(error: unknown) {
  return error instanceof Error && error.name === "AbortError";
}

function getSafeErrorMessage(error: unknown) {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return "Unknown error.";
}

async function fetchSpotifyWithTimeout(
  url: string,
  init: RequestInit,
  code: string,
) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => {
    controller.abort();
  }, SPOTIFY_REQUEST_TIMEOUT_MS);

  try {
    return await fetch(url, {
      ...init,
      signal: controller.signal,
    });
  } catch (error) {
    if (isAbortError(error)) {
      throw new SpotifyApiError(
        "Spotify request timed out.",
        504,
        `${code}_TIMEOUT`,
      );
    }

    throw new SpotifyApiError(
      `Spotify network request failed: ${getSafeErrorMessage(error)}`,
      502,
      `${code}_NETWORK`,
    );
  } finally {
    clearTimeout(timeoutId);
  }
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

function parseRetryAfterSeconds(headerValue: string | null) {
  if (!headerValue) {
    return undefined;
  }

  const numericValue = Number(headerValue);
  if (Number.isFinite(numericValue) && numericValue >= 0) {
    return numericValue;
  }

  const retryAt = Date.parse(headerValue);
  if (Number.isNaN(retryAt)) {
    return undefined;
  }

  const secondsUntilRetry = Math.ceil((retryAt - Date.now()) / 1000);
  return secondsUntilRetry > 0 ? secondsUntilRetry : undefined;
}

async function assertSpotifyResponseOk(response: Response, code: string) {
  if (!response.ok) {
    const message = await parseSpotifyErrorResponse(response);
    const retryAfterSeconds = parseRetryAfterSeconds(
      response.headers.get("retry-after"),
    );

    throw new SpotifyApiError(
      message,
      response.status,
      code,
      Number.isFinite(retryAfterSeconds) ? retryAfterSeconds : undefined,
    );
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

function shouldRetrySpotifyRequest(error: SpotifyApiError) {
  if (error.status === 429) {
    return true;
  }

  return error.status >= 500 && error.status <= 599;
}

function getSpotifyRetryDelayMs(error: SpotifyApiError, attempt: number) {
  const cappedAttempt = Math.max(1, attempt);

  if (
    typeof error.retryAfterSeconds === "number" &&
    Number.isFinite(error.retryAfterSeconds) &&
    error.retryAfterSeconds > 0
  ) {
    return Math.ceil(error.retryAfterSeconds * 1000);
  }

  return SPOTIFY_RETRY_BASE_DELAY_MS * 2 ** (cappedAttempt - 1);
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function buildSpotifyAuthorizationUrl(state: string) {
  const { clientId, redirectUri } = getSpotifyConfig();
  const params = new URLSearchParams({
    response_type: "code",
    client_id: clientId,
    redirect_uri: redirectUri,
    scope: SPOTIFY_SCOPES.join(" "),
    state,
    show_dialog: "true",
  });

  return `${SPOTIFY_ACCOUNTS_BASE_URL}/authorize?${params.toString()}`;
}

export async function exchangeSpotifyCodeForTokens({
  code,
}: ExchangeCodeForTokensInput): Promise<SpotifyTokenResponse> {
  const { redirectUri } = getSpotifyConfig();

  const response = await fetchSpotifyWithTimeout(
    `${SPOTIFY_ACCOUNTS_BASE_URL}/api/token`,
    {
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
    },
    "SPOTIFY_TOKEN_EXCHANGE_FAILED",
  );

  await assertSpotifyResponseOk(response, "SPOTIFY_TOKEN_EXCHANGE_FAILED");

  return (await response.json()) as SpotifyTokenResponse;
}

export async function refreshSpotifyAccessToken({
  refreshToken,
}: RefreshAccessTokenInput): Promise<SpotifyTokenResponse> {
  const response = await fetchSpotifyWithTimeout(
    `${SPOTIFY_ACCOUNTS_BASE_URL}/api/token`,
    {
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
    },
    "SPOTIFY_TOKEN_REFRESH_FAILED",
  );

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
  const response = await fetchSpotifyWithTimeout(
    `${SPOTIFY_API_BASE_URL}/me`,
    {
      method: "GET",
      headers: getSpotifyRequestHeaders(accessToken),
      cache: "no-store",
    },
    "SPOTIFY_PROFILE_FETCH_FAILED",
  );

  await assertSpotifyResponseOk(response, "SPOTIFY_PROFILE_FETCH_FAILED");

  const profile = (await response.json()) as SpotifyProfileResponse;
  return normalizeSpotifyProfile(profile);
}

export function normalizeSpotifyPlaylist(
  playlist: SpotifyPlaylistsResponse["items"][number] | null | undefined,
): SpotifyPlaylist | null {
  if (!playlist || typeof playlist.id !== "string") {
    return null;
  }

  if (typeof playlist.name !== "string" || playlist.name.trim().length === 0) {
    return null;
  }

  const rawTrackTotal = playlist.tracks?.total;
  const rawItemsTotal = playlist.items?.total;
  const trackCount =
    typeof rawTrackTotal === "number" && Number.isFinite(rawTrackTotal)
      ? rawTrackTotal
      : typeof rawItemsTotal === "number" && Number.isFinite(rawItemsTotal)
        ? rawItemsTotal
        : 0;

  return {
    id: playlist.id,
    name: playlist.name,
    description: normalizeOptionalText(playlist.description),
    imageUrl: getFirstImageUrl(playlist.images),
    trackCount,
    ownerName: normalizeOptionalText(playlist.owner?.display_name),
    externalUrl: normalizeOptionalText(playlist.external_urls?.spotify),
  };
}

async function fetchSpotifyPlaylistTrackTotal({
  accessToken,
  playlistId,
}: {
  accessToken: string;
  playlistId: string;
}): Promise<number | null> {
  const params = new URLSearchParams({
    fields: "tracks.total",
  });
  const requestUrl = `${SPOTIFY_API_BASE_URL}/playlists/${encodeURIComponent(playlistId)}?${params.toString()}`;

  const response = await fetchSpotifyWithTimeout(
    requestUrl,
    {
      method: "GET",
      headers: getSpotifyRequestHeaders(accessToken),
      cache: "no-store",
    },
    "SPOTIFY_PLAYLIST_TRACK_TOTAL_FETCH_FAILED",
  );

  await assertSpotifyResponseOk(response, "SPOTIFY_PLAYLIST_TRACK_TOTAL_FETCH_FAILED");

  let data: SpotifyPlaylistTrackTotalResponse;

  try {
    data = (await response.json()) as SpotifyPlaylistTrackTotalResponse;
  } catch {
    return null;
  }

  return typeof data.tracks?.total === "number" && Number.isFinite(data.tracks.total)
    ? data.tracks.total
    : null;
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

  const requestUrl = `${SPOTIFY_API_BASE_URL}/me/playlists?${params.toString()}`;

  for (let attempt = 1; attempt <= SPOTIFY_TRANSIENT_ERROR_MAX_RETRIES + 1; attempt += 1) {
    try {
      const response = await fetchSpotifyWithTimeout(
        requestUrl,
        {
          method: "GET",
          headers: getSpotifyRequestHeaders(accessToken),
          cache: "no-store",
        },
        "SPOTIFY_PLAYLISTS_FETCH_FAILED",
      );

      await assertSpotifyResponseOk(response, "SPOTIFY_PLAYLISTS_FETCH_FAILED");
      let data: SpotifyPlaylistsResponse;

      try {
        data = (await response.json()) as SpotifyPlaylistsResponse;
      } catch {
        throw new SpotifyApiError(
          "Spotify playlists payload could not be parsed.",
          502,
          "SPOTIFY_PLAYLISTS_RESPONSE_INVALID",
        );
      }

      if (!Array.isArray(data.items)) {
        throw new SpotifyApiError(
          "Spotify playlists payload is invalid.",
          502,
          "SPOTIFY_PLAYLISTS_RESPONSE_INVALID",
        );
      }

      const playlists = data.items
        .map(normalizeSpotifyPlaylist)
        .filter((playlist): playlist is SpotifyPlaylist => playlist !== null);

      const zeroTrackPlaylists = playlists.filter(
        (playlist) => playlist.trackCount === 0,
      );

      if (zeroTrackPlaylists.length > 0) {
        const resolvedTotals = await Promise.all(
          zeroTrackPlaylists.map(async (playlist) => ({
            id: playlist.id,
            total: await fetchSpotifyPlaylistTrackTotal({
              accessToken,
              playlistId: playlist.id,
            }).catch(() => null),
          })),
        );

        const totalsByPlaylistId = new Map(
          resolvedTotals
            .filter(
              (entry): entry is { id: string; total: number } =>
                typeof entry.total === "number",
            )
            .map((entry) => [entry.id, entry.total]),
        );

        if (totalsByPlaylistId.size > 0) {
          for (const playlist of playlists) {
            const total = totalsByPlaylistId.get(playlist.id);
            if (typeof total === "number") {
              playlist.trackCount = total;
            }
          }
        }
      }

      return {
        playlists,
        total: data.total,
        limit: data.limit,
        offset: data.offset,
        next: data.next,
        previous: data.previous,
      };
    } catch (error) {
      if (!(error instanceof SpotifyApiError)) {
        throw error;
      }

      if (
        attempt > SPOTIFY_TRANSIENT_ERROR_MAX_RETRIES ||
        !shouldRetrySpotifyRequest(error)
      ) {
        throw error;
      }

      const delayMs = getSpotifyRetryDelayMs(error, attempt);
      await sleep(delayMs);
    }
  }

  throw new SpotifyApiError(
    "Unable to fetch Spotify playlists.",
    502,
    "SPOTIFY_PLAYLISTS_FETCH_FAILED",
  );
}
