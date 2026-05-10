import { auth } from "@clerk/nextjs/server";
import { Disc3, Link2 } from "lucide-react";

import {
  clearSpotifyConnection,
  getValidSpotifyAccessToken,
} from "@/lib/spotify-connection-store";
import {
  fetchSpotifyCurrentUserPlaylists,
  SpotifyApiError,
} from "@/lib/spotify";
import type { SpotifyPlaylist } from "@/types/spotify";

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
          Your Spotify playlists will appear here after you connect your
          account.
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

function SpotifyFetchErrorState() {
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
          Refresh the page or reconnect Spotify if the issue continues.
        </p>
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
          Spotify is connected, but no playlists are available on this account
          yet.
        </p>
      </div>
    </section>
  );
}

type PlaylistLoadResult =
  | {
      status: "not-connected";
      playlists: SpotifyPlaylist[];
    }
  | {
      status: "error";
      playlists: SpotifyPlaylist[];
    }
  | {
      status: "success";
      playlists: SpotifyPlaylist[];
    };

async function loadSpotifyPlaylists(
  userId: string,
): Promise<PlaylistLoadResult> {
  const accessToken = await getValidSpotifyAccessToken(userId);
  if (!accessToken) {
    return { status: "not-connected", playlists: [] };
  }

  try {
    const { playlists } = await fetchSpotifyCurrentUserPlaylists({
      accessToken,
      limit: 20,
      offset: 0,
    });

    return {
      status: "success",
      playlists,
    };
  } catch (error) {
    if (error instanceof SpotifyApiError && error.status === 401) {
      clearSpotifyConnection(userId);
      return { status: "not-connected", playlists: [] };
    }

    return { status: "error", playlists: [] };
  }
}

export async function SpotifyPlaylistsPanel() {
  const { userId } = await auth();

  if (!userId) {
    return <SpotifyNotConnectedState />;
  }

  const result = await loadSpotifyPlaylists(userId);

  if (result.status === "not-connected") {
    return <SpotifyNotConnectedState />;
  }

  if (result.status === "error") {
    return <SpotifyFetchErrorState />;
  }

  if (result.playlists.length === 0) {
    return <SpotifyEmptyState />;
  }

  return (
    <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {result.playlists.map((playlist) => (
        <article
          key={playlist.id}
          className="overflow-hidden rounded-2xl border border-surface-border/80 bg-surface/80 p-4 shadow-sm shadow-base/25 transition-all duration-200 hover:-translate-y-0.5 hover:border-copy-secondary/40 hover:shadow-md hover:shadow-base/35"
        >
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
            {playlist.externalUrl ? (
              <a
                href={playlist.externalUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-3 inline-flex items-center gap-1.5 text-xs text-spotify transition-colors duration-200 hover:text-copy-primary"
              >
                <Link2 className="h-3.5 w-3.5" aria-hidden="true" />
                Open in Spotify
              </a>
            ) : null}
          </div>
        </article>
      ))}
    </section>
  );
}
