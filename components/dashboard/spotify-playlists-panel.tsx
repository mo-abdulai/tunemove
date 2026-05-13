"use client";

import { ChevronRight, Disc3, Link2, Lock } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";

import type { SpotifyPlaylist } from "@/types/spotify";

type PlaylistApiSuccessResponse = {
  success: true;
  data: {
    playlists: SpotifyPlaylist[];
  };
};

type PlaylistApiErrorResponse = {
  success: false;
  error?: {
    code?: string;
    message?: string;
  };
  meta?: {
    retryAfterSeconds?: number;
  };
};

type PlaylistLoadStatus =
  | "loading"
  | "not-connected"
  | "insufficient-scope"
  | "rate-limited"
  | "timeout"
  | "network-error"
  | "service-unavailable"
  | "error"
  | "success";

type PlaylistLoadState = {
  status: PlaylistLoadStatus;
  playlists: SpotifyPlaylist[];
  retryAfterSeconds?: number;
  errorCode?: string;
};

const INITIAL_STATE: PlaylistLoadState = {
  status: "loading",
  playlists: [],
};

function SpotifyNotConnectedState() {
  return (
    <section className="rounded-2xl border border-surface-border/80 bg-surface/80 p-6">
      <div className="flex min-h-44 flex-col items-center justify-center text-center">
        <div className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-spotify/30 bg-spotify/10 text-spotify">
          <Disc3 className="h-5 w-5" aria-hidden="true" />
        </div>
        <h2 className="mt-4 text-base font-semibold tracking-tight text-copy-primary">
          Connect Spotify to view playlists
        </h2>
        <p className="mt-2 max-w-md text-sm text-copy-secondary">
          Your Spotify playlists will appear here after you connect your account.
        </p>
        <a
          href="/api/spotify/connect"
          className="mt-4 inline-flex items-center rounded-xl border border-surface-border/80 bg-elevated/80 px-3 py-1.5 text-xs font-medium text-copy-primary transition-all duration-200 hover:border-spotify/35 hover:bg-elevated focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-secondary focus-visible:ring-offset-2 focus-visible:ring-offset-base"
        >
          Connect Spotify
        </a>
      </div>
    </section>
  );
}

function SpotifyFetchErrorState({
  onRetry,
  message,
}: {
  onRetry: () => void;
  message?: string;
}) {
  return (
    <section className="rounded-2xl border border-surface-border/80 bg-surface/80 p-6">
      <div className="flex min-h-44 flex-col items-center justify-center text-center">
        <div className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-surface-border/80 bg-elevated/80 text-copy-muted">
          <Disc3 className="h-5 w-5" aria-hidden="true" />
        </div>
        <h2 className="mt-4 text-base font-semibold tracking-tight text-copy-primary">
          Unable to load Spotify playlists
        </h2>
        <p className="mt-2 max-w-md text-sm text-copy-secondary">
          {message ??
            "Refresh the page or reconnect Spotify if the issue continues."}
        </p>
        <button
          type="button"
          onClick={onRetry}
          className="mt-4 inline-flex items-center rounded-xl border border-surface-border/80 bg-elevated/80 px-3 py-1.5 text-xs font-medium text-copy-primary transition-all duration-200 hover:border-copy-secondary/40 hover:bg-elevated focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-secondary focus-visible:ring-offset-2 focus-visible:ring-offset-base"
        >
          Retry
        </button>
      </div>
    </section>
  );
}

function SpotifyRateLimitedState({
  retryAfterSeconds,
  onRetry,
}: {
  retryAfterSeconds?: number;
  onRetry: () => void;
}) {
  const retryMessage =
    typeof retryAfterSeconds === "number" && retryAfterSeconds > 0
      ? `Try again in about ${retryAfterSeconds} seconds.`
      : "Please wait a moment and try again.";

  return (
    <section className="rounded-2xl border border-surface-border/80 bg-surface/80 p-6">
      <div className="flex min-h-44 flex-col items-center justify-center text-center">
        <div className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-warning/30 bg-warning/10 text-warning">
          <Disc3 className="h-5 w-5" aria-hidden="true" />
        </div>
        <h2 className="mt-4 text-base font-semibold tracking-tight text-copy-primary">
          Spotify is rate-limiting requests
        </h2>
        <p className="mt-2 max-w-md text-sm text-copy-secondary">{retryMessage}</p>
        <button
          type="button"
          onClick={onRetry}
          className="mt-4 inline-flex items-center rounded-xl border border-surface-border/80 bg-elevated/80 px-3 py-1.5 text-xs font-medium text-copy-primary transition-all duration-200 hover:border-copy-secondary/40 hover:bg-elevated focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-secondary focus-visible:ring-offset-2 focus-visible:ring-offset-base"
        >
          Retry now
        </button>
      </div>
    </section>
  );
}

function SpotifyServiceUnavailableState({ onRetry }: { onRetry: () => void }) {
  return (
    <section className="rounded-2xl border border-surface-border/80 bg-surface/80 p-6">
      <div className="flex min-h-44 flex-col items-center justify-center text-center">
        <div className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-warning/30 bg-warning/10 text-warning">
          <Disc3 className="h-5 w-5" aria-hidden="true" />
        </div>
        <h2 className="mt-4 text-base font-semibold tracking-tight text-copy-primary">
          Spotify is temporarily unavailable
        </h2>
        <p className="mt-2 max-w-md text-sm text-copy-secondary">
          Spotify returned a temporary server error. Retry in a moment.
        </p>
        <button
          type="button"
          onClick={onRetry}
          className="mt-4 inline-flex items-center rounded-xl border border-surface-border/80 bg-elevated/80 px-3 py-1.5 text-xs font-medium text-copy-primary transition-all duration-200 hover:border-copy-secondary/40 hover:bg-elevated focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-secondary focus-visible:ring-offset-2 focus-visible:ring-offset-base"
        >
          Retry
        </button>
      </div>
    </section>
  );
}

function SpotifyInsufficientScopeState() {
  return (
    <section className="rounded-2xl border border-surface-border/80 bg-surface/80 p-6">
      <div className="flex min-h-44 flex-col items-center justify-center text-center">
        <div className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-warning/30 bg-warning/10 text-warning">
          <Disc3 className="h-5 w-5" aria-hidden="true" />
        </div>
        <h2 className="mt-4 text-base font-semibold tracking-tight text-copy-primary">
          Spotify permission required
        </h2>
        <p className="mt-2 max-w-md text-sm text-copy-secondary">
          Spotify denied playlist-read scope for this token. Reconnect Spotify
          and accept the requested playlist permissions.
        </p>
        <a
          href="/api/spotify/connect"
          className="mt-4 inline-flex items-center rounded-xl border border-surface-border/80 bg-elevated/80 px-3 py-1.5 text-xs font-medium text-copy-primary transition-all duration-200 hover:border-spotify/35 hover:bg-elevated focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-secondary focus-visible:ring-offset-2 focus-visible:ring-offset-base"
        >
          Reconnect Spotify
        </a>
      </div>
    </section>
  );
}

function SpotifyEmptyState() {
  return (
    <section className="rounded-2xl border border-surface-border/80 bg-surface/80 p-6">
      <div className="flex min-h-44 flex-col items-center justify-center text-center">
        <div className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-spotify/30 bg-spotify/10 text-spotify">
          <Disc3 className="h-5 w-5" aria-hidden="true" />
        </div>
        <h2 className="mt-4 text-base font-semibold tracking-tight text-copy-primary">
          No Spotify playlists found
        </h2>
        <p className="mt-2 max-w-md text-sm text-copy-secondary">
          Spotify is connected, but no playlists are available on this account yet.
        </p>
      </div>
    </section>
  );
}

function SpotifyLoadingState() {
  return (
    <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 3 }).map((_, index) => (
        <div
          key={`spotify-playlist-inline-skeleton-${index}`}
          className="overflow-hidden rounded-2xl border border-surface-border/80 bg-surface/80 p-4"
        >
          <div className="h-36 w-full animate-pulse rounded-xl border border-surface-border/70 bg-elevated/70" />
          <div className="mt-4 space-y-2">
            <div className="h-4 w-2/3 animate-pulse rounded-full bg-elevated/80" />
            <div className="h-3 w-1/3 animate-pulse rounded-full bg-elevated/70" />
          </div>
        </div>
      ))}
    </section>
  );
}

async function fetchSpotifyPlaylists(): Promise<PlaylistLoadState> {
  try {
    const response = await fetch("/api/spotify/playlists?limit=20&offset=0", {
      method: "GET",
      cache: "no-store",
    });

    let payload:
      | PlaylistApiSuccessResponse
      | PlaylistApiErrorResponse
      | null = null;

    try {
      payload = (await response.json()) as
        | PlaylistApiSuccessResponse
        | PlaylistApiErrorResponse;
    } catch {
      payload = null;
    }

    if (response.ok && payload?.success) {
      return {
        status: "success",
        playlists: payload.data.playlists,
      };
    }

    const errorCode =
      payload && !payload.success ? payload.error?.code : undefined;

    if (
      response.status === 404 ||
      errorCode === "SPOTIFY_NOT_CONNECTED" ||
      response.status === 401
    ) {
      return { status: "not-connected", playlists: [] };
    }

    if (response.status === 403 || errorCode === "SPOTIFY_INSUFFICIENT_SCOPE") {
      return { status: "insufficient-scope", playlists: [] };
    }

    if (response.status === 429 || errorCode === "SPOTIFY_RATE_LIMITED") {
      return {
        status: "rate-limited",
        playlists: [],
        retryAfterSeconds:
          !payload || payload.success || !payload.meta
            ? undefined
            : payload.meta.retryAfterSeconds,
      };
    }

    if (response.status === 504 || errorCode === "SPOTIFY_REQUEST_TIMEOUT") {
      return { status: "timeout", playlists: [] };
    }

    if (errorCode === "SPOTIFY_NETWORK_ERROR") {
      return { status: "network-error", playlists: [] };
    }

    if (
      response.status === 503 ||
      errorCode === "SPOTIFY_UPSTREAM_UNAVAILABLE"
    ) {
      return { status: "service-unavailable", playlists: [] };
    }

    return { status: "error", playlists: [], errorCode };
  } catch {
    return { status: "network-error", playlists: [] };
  }
}

export function SpotifyPlaylistsPanel() {
  const [state, setState] = useState<PlaylistLoadState>(INITIAL_STATE);

  const retryLoad = useCallback(async () => {
    setState((currentState) => ({
      status: "loading",
      playlists:
        currentState.status === "success" ? currentState.playlists : [],
    }));

    const nextState = await fetchSpotifyPlaylists();
    setState(nextState);
  }, []);

  useEffect(() => {
    let isMounted = true;

    const runInitialLoad = async () => {
      const nextState = await fetchSpotifyPlaylists();

      if (isMounted) {
        setState(nextState);
      }
    };

    void runInitialLoad();

    return () => {
      isMounted = false;
    };
  }, []);

  const content = useMemo(() => {
    if (state.status === "loading") {
      return <SpotifyLoadingState />;
    }

    if (state.status === "not-connected") {
      return <SpotifyNotConnectedState />;
    }

    if (state.status === "insufficient-scope") {
      return <SpotifyInsufficientScopeState />;
    }

    if (state.status === "rate-limited") {
      return (
        <SpotifyRateLimitedState
          retryAfterSeconds={state.retryAfterSeconds}
          onRetry={() => void retryLoad()}
        />
      );
    }

    if (state.status === "service-unavailable") {
      return <SpotifyServiceUnavailableState onRetry={() => void retryLoad()} />;
    }

    if (state.status === "timeout") {
      return (
        <SpotifyFetchErrorState
          onRetry={() => void retryLoad()}
          message="Spotify took too long to respond. Retry in a moment."
        />
      );
    }

    if (state.status === "network-error") {
      return (
        <SpotifyFetchErrorState
          onRetry={() => void retryLoad()}
          message="Network error while reaching Spotify. Check connectivity and retry."
        />
      );
    }

    if (state.status === "error") {
      return (
        <SpotifyFetchErrorState
          onRetry={() => void retryLoad()}
          message={
            state.errorCode
              ? `Spotify returned an unexpected error (${state.errorCode}). Retry or reconnect if it continues.`
              : undefined
          }
        />
      );
    }

    if (state.playlists.length === 0) {
      return <SpotifyEmptyState />;
    }

    return (
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {state.playlists.map((playlist) => (
          <article
            key={playlist.id}
            className="relative overflow-hidden rounded-2xl border border-surface-border/80 bg-surface/80 p-4 shadow-sm shadow-base/25 transition-all duration-200 hover:-translate-y-0.5 hover:border-copy-secondary/40 hover:shadow-md hover:shadow-base/35"
          >
            <Link
              href={`/dashboard/playlists/${encodeURIComponent(playlist.id)}`}
              className="absolute inset-0 z-10 rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-secondary focus-visible:ring-offset-2 focus-visible:ring-offset-base"
              aria-label={`View tracks for ${playlist.name}`}
            />
            <div className="relative z-20 pointer-events-none">
              {playlist.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={playlist.imageUrl}
                  alt={`${playlist.name} cover`}
                  className="h-36 w-full rounded-xl border border-surface-border/80 object-cover"
                  loading="lazy"
                />
              ) : (
                <div className="flex h-36 w-full items-center justify-center rounded-xl border border-surface-border/80 bg-elevated/70 text-copy-muted">
                  <Disc3 className="h-6 w-6" aria-hidden="true" />
                </div>
              )}
              <div className="mt-4">
                <h2 className="line-clamp-1 text-base font-semibold tracking-tight text-copy-primary">
                  {playlist.name}
                </h2>
                <p className="mt-1 text-xs text-copy-secondary">
                  {playlist.trackCount} tracks
                </p>
                {playlist.ownerName ? (
                  <p className="mt-2 line-clamp-1 text-xs text-copy-muted">
                    by {playlist.ownerName}
                  </p>
                ) : null}
                {playlist.canAccessTracks === false ? (
                  <p className="mt-2 inline-flex items-center gap-1.5 text-xs text-warning">
                    <Lock className="h-3.5 w-3.5" aria-hidden="true" />
                    Track access may be restricted by Spotify
                  </p>
                ) : null}
                <div className="mt-3 flex items-center justify-between gap-3">
                  <p
                    className={
                      playlist.canAccessTracks === false
                        ? "inline-flex items-center gap-1.5 text-xs font-medium text-warning"
                        : "inline-flex items-center gap-1.5 text-xs font-medium text-brand-secondary"
                    }
                  >
                    {playlist.canAccessTracks === false
                      ? "Try opening tracks"
                      : "View tracks"}
                    <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </p>
                  {playlist.externalUrl ? (
                    <a
                      href={playlist.externalUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="pointer-events-auto inline-flex items-center gap-1.5 text-xs text-spotify transition-colors duration-200 hover:text-copy-primary"
                    >
                      <Link2 className="h-3.5 w-3.5" aria-hidden="true" />
                      Open in Spotify
                    </a>
                  ) : null}
                </div>
              </div>
            </div>
          </article>
        ))}
      </section>
    );
  }, [retryLoad, state]);

  return content;
}
