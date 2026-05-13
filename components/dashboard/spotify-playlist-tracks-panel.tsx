"use client";

import { Disc3, Link2 } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

import type { SpotifyPlaylist, SpotifyPlaylistTrack } from "@/types/spotify";

type PlaylistTracksApiSuccessResponse = {
  success: true;
  data: {
    playlist: SpotifyPlaylist;
    tracks: SpotifyPlaylistTrack[];
    total: number;
  };
};

type PlaylistTracksApiErrorResponse = {
  success: false;
  error?: {
    code?: string;
    message?: string;
  };
  meta?: {
    retryAfterSeconds?: number;
  };
};

type PlaylistTracksLoadStatus =
  | "loading"
  | "not-connected"
  | "not-found"
  | "access-denied"
  | "insufficient-scope"
  | "rate-limited"
  | "timeout"
  | "network-error"
  | "service-unavailable"
  | "error"
  | "success";

type PlaylistTracksLoadState = {
  status: PlaylistTracksLoadStatus;
  playlist: SpotifyPlaylist | null;
  tracks: SpotifyPlaylistTrack[];
  total: number;
  retryAfterSeconds?: number;
  errorCode?: string;
};

const INITIAL_STATE: PlaylistTracksLoadState = {
  status: "loading",
  playlist: null,
  tracks: [],
  total: 0,
};

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

function formatTrackDuration(durationMs: number | null) {
  if (typeof durationMs !== "number" || !Number.isFinite(durationMs) || durationMs < 0) {
    return "—";
  }

  const totalSeconds = Math.floor(durationMs / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

function formatAddedDate(addedAt: string | null) {
  if (!addedAt) {
    return "—";
  }

  const parsedDate = new Date(addedAt);
  if (Number.isNaN(parsedDate.getTime())) {
    return "—";
  }

  return dateFormatter.format(parsedDate);
}

function SpotifyPanelStatusState({
  title,
  description,
  actionLabel,
  actionHref,
  onRetry,
}: {
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  onRetry?: () => void;
}) {
  return (
    <section className="rounded-2xl border border-surface-border/80 bg-surface/80 p-6">
      <div className="flex min-h-44 flex-col items-center justify-center text-center">
        <div className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-surface-border/80 bg-elevated/80 text-copy-muted">
          <Disc3 className="h-5 w-5" aria-hidden="true" />
        </div>
        <h2 className="mt-4 text-base font-semibold tracking-tight text-copy-primary">
          {title}
        </h2>
        <p className="mt-2 max-w-md text-sm text-copy-secondary">{description}</p>
        {actionHref && actionLabel ? (
          <a
            href={actionHref}
            className="mt-4 inline-flex items-center rounded-xl border border-surface-border/80 bg-elevated/80 px-3 py-1.5 text-xs font-medium text-copy-primary transition-all duration-200 hover:border-spotify/35 hover:bg-elevated focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-secondary focus-visible:ring-offset-2 focus-visible:ring-offset-base"
          >
            {actionLabel}
          </a>
        ) : null}
        {onRetry && actionLabel ? (
          <button
            type="button"
            onClick={onRetry}
            className="mt-4 inline-flex items-center rounded-xl border border-surface-border/80 bg-elevated/80 px-3 py-1.5 text-xs font-medium text-copy-primary transition-all duration-200 hover:border-copy-secondary/40 hover:bg-elevated focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-secondary focus-visible:ring-offset-2 focus-visible:ring-offset-base"
          >
            {actionLabel}
          </button>
        ) : null}
      </div>
    </section>
  );
}

function SpotifyPlaylistTracksLoadingState() {
  return (
    <section className="overflow-hidden rounded-2xl border border-surface-border/80 bg-surface/80 p-5">
      <div className="h-7 w-64 animate-pulse rounded-full bg-elevated/80" />
      <div className="mt-2 h-4 w-40 animate-pulse rounded-full bg-elevated/70" />
      <div className="mt-5 space-y-3">
        {Array.from({ length: 7 }).map((_, index) => (
          <div
            key={`spotify-playlist-track-skeleton-${index}`}
            className="h-11 animate-pulse rounded-xl bg-elevated/70"
          />
        ))}
      </div>
    </section>
  );
}

async function fetchSpotifyPlaylistTracks(
  playlistId: string,
): Promise<PlaylistTracksLoadState> {
  try {
    const response = await fetch(
      `/api/spotify/playlists/${encodeURIComponent(playlistId)}/tracks`,
      {
        method: "GET",
        cache: "no-store",
      },
    );

    let payload:
      | PlaylistTracksApiSuccessResponse
      | PlaylistTracksApiErrorResponse
      | null = null;

    try {
      payload = (await response.json()) as
        | PlaylistTracksApiSuccessResponse
        | PlaylistTracksApiErrorResponse;
    } catch {
      payload = null;
    }

    if (response.ok && payload?.success) {
      return {
        status: "success",
        playlist: payload.data.playlist,
        tracks: payload.data.tracks,
        total: payload.data.total,
      };
    }

    const errorCode =
      payload && !payload.success ? payload.error?.code : undefined;

    if (
      response.status === 404 &&
      errorCode === "SPOTIFY_PLAYLIST_NOT_FOUND"
    ) {
      return {
        status: "not-found",
        playlist: null,
        tracks: [],
        total: 0,
      };
    }

    if (
      response.status === 404 ||
      response.status === 401 ||
      errorCode === "SPOTIFY_NOT_CONNECTED"
    ) {
      return {
        status: "not-connected",
        playlist: null,
        tracks: [],
        total: 0,
      };
    }

    if (response.status === 403 && errorCode === "SPOTIFY_PLAYLIST_ACCESS_DENIED") {
      return {
        status: "access-denied",
        playlist: null,
        tracks: [],
        total: 0,
      };
    }

    if (response.status === 403 || errorCode === "SPOTIFY_INSUFFICIENT_SCOPE") {
      return {
        status: "insufficient-scope",
        playlist: null,
        tracks: [],
        total: 0,
      };
    }

    if (response.status === 429 || errorCode === "SPOTIFY_RATE_LIMITED") {
      return {
        status: "rate-limited",
        playlist: null,
        tracks: [],
        total: 0,
        retryAfterSeconds:
          !payload || payload.success || !payload.meta
            ? undefined
            : payload.meta.retryAfterSeconds,
      };
    }

    if (response.status === 504 || errorCode === "SPOTIFY_REQUEST_TIMEOUT") {
      return {
        status: "timeout",
        playlist: null,
        tracks: [],
        total: 0,
      };
    }

    if (errorCode === "SPOTIFY_NETWORK_ERROR") {
      return {
        status: "network-error",
        playlist: null,
        tracks: [],
        total: 0,
      };
    }

    if (
      response.status === 503 ||
      errorCode === "SPOTIFY_UPSTREAM_UNAVAILABLE"
    ) {
      return {
        status: "service-unavailable",
        playlist: null,
        tracks: [],
        total: 0,
      };
    }

    return {
      status: "error",
      playlist: null,
      tracks: [],
      total: 0,
      errorCode,
    };
  } catch {
    return {
      status: "network-error",
      playlist: null,
      tracks: [],
      total: 0,
    };
  }
}

function SpotifyPlaylistTracksTable({
  tracks,
}: {
  tracks: SpotifyPlaylistTrack[];
}) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-[46rem] w-full border-collapse">
        <thead>
          <tr className="border-b border-surface-border/70 text-left">
            <th className="w-12 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-copy-muted">
              #
            </th>
            <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-copy-muted">
              Title
            </th>
            <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-copy-muted">
              Album
            </th>
            <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-copy-muted">
              Date Added
            </th>
            <th className="w-20 px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-copy-muted">
              Length
            </th>
          </tr>
        </thead>
        <tbody>
          {tracks.map((track) => (
            <tr
              key={`${track.position}-${track.title}-${track.addedAt ?? "none"}`}
              className="border-b border-surface-border/50 transition-colors duration-200 hover:bg-elevated/40"
            >
              <td className="px-4 py-3 text-sm text-copy-muted">{track.position}</td>
              <td className="px-4 py-3 text-sm text-copy-primary">{track.title}</td>
              <td className="px-4 py-3 text-sm text-copy-secondary">
                {track.albumName ?? "—"}
              </td>
              <td className="px-4 py-3 text-sm text-copy-secondary">
                {formatAddedDate(track.addedAt)}
              </td>
              <td className="px-4 py-3 text-right font-mono text-sm text-copy-secondary">
                {formatTrackDuration(track.durationMs)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function SpotifyPlaylistTracksPanel({
  playlistId,
}: {
  playlistId: string;
}) {
  const [state, setState] = useState<PlaylistTracksLoadState>(INITIAL_STATE);

  const retryLoad = useCallback(async () => {
    setState((currentState) => ({
      status: "loading",
      playlist:
        currentState.status === "success" ? currentState.playlist : null,
      tracks: currentState.status === "success" ? currentState.tracks : [],
      total: currentState.status === "success" ? currentState.total : 0,
    }));

    const nextState = await fetchSpotifyPlaylistTracks(playlistId);
    setState(nextState);
  }, [playlistId]);

  useEffect(() => {
    let isMounted = true;

    const runInitialLoad = async () => {
      const nextState = await fetchSpotifyPlaylistTracks(playlistId);

      if (isMounted) {
        setState(nextState);
      }
    };

    void runInitialLoad();

    return () => {
      isMounted = false;
    };
  }, [playlistId]);

  const content = useMemo(() => {
    if (state.status === "loading") {
      return <SpotifyPlaylistTracksLoadingState />;
    }

    if (state.status === "not-connected") {
      return (
        <SpotifyPanelStatusState
          title="Connect Spotify to view tracks"
          description="Your selected playlist tracks will appear after Spotify is connected."
          actionLabel="Connect Spotify"
          actionHref="/api/spotify/connect"
        />
      );
    }

    if (state.status === "not-found") {
      return (
        <SpotifyPanelStatusState
          title="Playlist not found"
          description="This playlist is no longer available from your Spotify account."
        />
      );
    }

    if (state.status === "access-denied") {
      return (
        <SpotifyPanelStatusState
          title="Playlist tracks unavailable"
          description="Spotify only returns track lists for playlists you own or collaborate on."
        />
      );
    }

    if (state.status === "insufficient-scope") {
      return (
        <SpotifyPanelStatusState
          title="Spotify permission required"
          description="Spotify denied playlist-read scope for this token. Reconnect and accept requested playlist permissions."
          actionLabel="Reconnect Spotify"
          actionHref="/api/spotify/connect"
        />
      );
    }

    if (state.status === "rate-limited") {
      const retryMessage =
        typeof state.retryAfterSeconds === "number" && state.retryAfterSeconds > 0
          ? `Spotify is rate limiting requests. Try again in about ${state.retryAfterSeconds} seconds.`
          : "Spotify is rate limiting requests. Please wait a moment and retry.";

      return (
        <SpotifyPanelStatusState
          title="Spotify is rate-limiting requests"
          description={retryMessage}
          actionLabel="Retry now"
          onRetry={() => void retryLoad()}
        />
      );
    }

    if (state.status === "timeout") {
      return (
        <SpotifyPanelStatusState
          title="Spotify took too long to respond"
          description="Retry in a moment. If this keeps happening, reconnect Spotify."
          actionLabel="Retry"
          onRetry={() => void retryLoad()}
        />
      );
    }

    if (state.status === "network-error") {
      return (
        <SpotifyPanelStatusState
          title="Network error while reaching Spotify"
          description="Check your connectivity and retry."
          actionLabel="Retry"
          onRetry={() => void retryLoad()}
        />
      );
    }

    if (state.status === "service-unavailable") {
      return (
        <SpotifyPanelStatusState
          title="Spotify is temporarily unavailable"
          description="Spotify returned a temporary server error. Retry in a moment."
          actionLabel="Retry"
          onRetry={() => void retryLoad()}
        />
      );
    }

    if (state.status === "error" || !state.playlist) {
      return (
        <SpotifyPanelStatusState
          title="Unable to load playlist tracks"
          description={
            state.errorCode
              ? `Spotify returned an unexpected error (${state.errorCode}). Retry or reconnect if it continues.`
              : "Retry in a moment. Reconnect Spotify if the issue continues."
          }
          actionLabel="Retry"
          onRetry={() => void retryLoad()}
        />
      );
    }

    return (
      <div className="space-y-5">
        <section className="overflow-hidden rounded-2xl border border-surface-border/80 bg-surface/80 p-5 shadow-sm shadow-base/25">
          <div className="flex flex-col gap-5 sm:flex-row">
            {state.playlist.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={state.playlist.imageUrl}
                alt={`${state.playlist.name} cover`}
                className="h-28 w-28 rounded-xl border border-surface-border/80 object-cover"
                loading="lazy"
              />
            ) : (
              <div className="flex h-28 w-28 items-center justify-center rounded-xl border border-surface-border/80 bg-elevated/70 text-copy-muted">
                <Disc3 className="h-6 w-6" aria-hidden="true" />
              </div>
            )}
            <div className="min-w-0">
              <p className="text-xs font-medium uppercase tracking-wide text-copy-muted">
                Spotify Playlist
              </p>
              <h2 className="mt-1 text-2xl font-semibold tracking-tight text-copy-primary">
                {state.playlist.name}
              </h2>
              <p className="mt-2 text-sm text-copy-secondary">
                {state.total} tracks
              </p>
              {state.playlist.ownerName ? (
                <p className="mt-1 text-xs text-copy-muted">
                  by {state.playlist.ownerName}
                </p>
              ) : null}
              {state.playlist.externalUrl ? (
                <a
                  href={state.playlist.externalUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3 inline-flex items-center gap-1.5 text-xs text-spotify transition-colors duration-200 hover:text-copy-primary"
                >
                  <Link2 className="h-3.5 w-3.5" aria-hidden="true" />
                  Open in Spotify
                </a>
              ) : null}
            </div>
          </div>
        </section>
        {state.tracks.length > 0 ? (
          <section className="overflow-hidden rounded-2xl border border-surface-border/80 bg-surface/80 shadow-sm shadow-base/25">
            <SpotifyPlaylistTracksTable tracks={state.tracks} />
          </section>
        ) : (
          <SpotifyPanelStatusState
            title="No tracks available"
            description="Spotify returned this playlist without track items."
          />
        )}
      </div>
    );
  }, [retryLoad, state]);

  return content;
}
