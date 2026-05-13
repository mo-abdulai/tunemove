import { auth } from "@clerk/nextjs/server";
import { Disc3 } from "lucide-react";

import { PageContainer } from "@/components/dashboard/page-container";
import { getSpotifyConnection } from "@/lib/spotify-connection-store";

type ConnectionsPageProps = {
  searchParams?: Promise<{
    spotify?: string;
    reason?: string;
  }>;
};

function getConnectionStatusMessage(
  params: { spotify?: string; reason?: string },
  isConnected: boolean,
) {
  if (params.spotify === "connected" && isConnected) {
    return {
      kind: "success" as const,
      message: "Spotify connected successfully.",
    };
  }

  if (params.spotify === "connected" && !isConnected) {
    return {
      kind: "error" as const,
      message:
        "Spotify callback completed, but connection data was not persisted. This is usually a local-host mismatch issue (localhost vs 127.0.0.1). Reconnect using one host consistently.",
    };
  }

  if (params.spotify === "disconnected") {
    return {
      kind: "success" as const,
      message: "Spotify connection removed.",
    };
  }

  if (params.spotify === "cancelled") {
    return {
      kind: "warning" as const,
      message: "Spotify connection was cancelled.",
    };
  }

  if (params.spotify === "failed") {
    if (
      params.reason === "state_invalid" ||
      params.reason === "state_missing" ||
      params.reason === "state_expired" ||
      params.reason === "state_signature_mismatch" ||
      params.reason === "state_malformed" ||
      params.reason === "state_secret_missing"
    ) {
      return {
        kind: "error" as const,
        message:
          "Connection session expired or was invalid. Start the Spotify connect flow again.",
      };
    }

    if (params.reason === "spotify_token_exchange_failed") {
      return {
        kind: "error" as const,
        message:
          "Token exchange failed. Check Spotify app credentials and redirect URI settings.",
      };
    }

    if (params.reason === "spotify_profile_fetch_failed_401") {
      return {
        kind: "error" as const,
        message:
          "Spotify token was rejected while fetching profile. Reconnect and ensure redirect URI/client settings are correct.",
      };
    }

    if (params.reason === "spotify_profile_fetch_failed_403") {
      return {
        kind: "error" as const,
        message:
          "Spotify denied profile access (403). If your app is in Development Mode, add this Spotify account in Spotify Dashboard -> Users and Access, and ensure app-owner account meets current dev-mode requirements.",
      };
    }

    if (params.reason === "spotify_profile_fetch_failed") {
      return {
        kind: "error" as const,
        message:
          "Connected to Spotify, but profile fetch failed. Verify Spotify scopes and app permissions.",
      };
    }

    return {
      kind: "error" as const,
      message: params.reason
        ? `Spotify connection failed (${params.reason}). Please try again.`
        : "Spotify connection failed. Please try again.",
    };
  }

  return null;
}

export default async function ConnectionsPage({ searchParams }: ConnectionsPageProps) {
  const { userId } = await auth();
  const spotifyConnection = userId ? await getSpotifyConnection(userId) : null;
  const isConnected = Boolean(spotifyConnection);
  const resolvedSearchParams = (await searchParams) ?? {};
  const statusMessage = getConnectionStatusMessage(
    resolvedSearchParams,
    isConnected,
  );
  
  return (
    <PageContainer
      title="Connections"
      description="Manage your linked music platform account and Spotify session state."
    >
      {statusMessage ? (
        <section
          className={
            statusMessage.kind === "success"
              ? "rounded-xl border border-success/30 bg-success/10 px-4 py-3 text-sm text-copy-primary"
              : statusMessage.kind === "warning"
                ? "rounded-xl border border-warning/30 bg-warning/10 px-4 py-3 text-sm text-copy-primary"
                : "rounded-xl border border-error/30 bg-error/10 px-4 py-3 text-sm text-copy-primary"
          }
        >
          {statusMessage.message}
        </section>
      ) : null}
      <section className="rounded-2xl border border-surface-border/80 bg-surface/80 p-6 shadow-sm shadow-base/25">
        <div className="flex flex-col gap-6 rounded-2xl border border-spotify/20 bg-elevated/60 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-spotify/30 bg-spotify/10 text-spotify">
              <Disc3 className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <h2 className="text-base font-semibold tracking-tight text-copy-primary">
                Spotify
              </h2>
              <p className="mt-1 text-sm text-copy-secondary">
                {isConnected
                  ? "Connected and ready to fetch your playlists."
                  : "Not connected yet. Connect your Spotify account to continue."}
              </p>
              {spotifyConnection ? (
                <p className="mt-2 text-xs text-copy-muted">
                  {spotifyConnection.profile.displayName ??
                    spotifyConnection.profile.email ??
                    spotifyConnection.profile.id}
                </p>
              ) : null}
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-end gap-3">
            <span
              className={
                isConnected
                  ? "inline-flex items-center rounded-full border border-spotify/35 bg-spotify/10 px-3 py-1 text-xs font-medium text-spotify"
                  : "inline-flex items-center rounded-full border border-surface-border/80 bg-surface px-3 py-1 text-xs font-medium text-copy-secondary"
              }
            >
              {isConnected ? "Connected" : "Not connected"}
            </span>
            <a
              href="/api/spotify/connect"
              className="inline-flex items-center rounded-xl border border-surface-border/80 bg-base/70 px-3 py-1.5 text-xs font-medium text-copy-primary transition-all duration-200 hover:border-spotify/35 hover:bg-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-secondary focus-visible:ring-offset-2 focus-visible:ring-offset-base"
            >
              {isConnected ? "Reconnect Spotify" : "Connect Spotify"}
            </a>
            {isConnected ? (
              <form action="/api/spotify/disconnect" method="post">
                <button
                  type="submit"
                  className="inline-flex items-center rounded-xl border border-error/35 bg-error/10 px-3 py-1.5 text-xs font-medium text-copy-primary transition-all duration-200 hover:border-error/50 hover:bg-error/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-secondary focus-visible:ring-offset-2 focus-visible:ring-offset-base"
                >
                  Disconnect Spotify
                </button>
              </form>
            ) : null}
          </div>
        </div>
      </section>
    </PageContainer>
  );
}
