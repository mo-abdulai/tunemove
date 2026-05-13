import { auth } from "@clerk/nextjs/server";
import { Disc3, Music2 } from "lucide-react";

import { EmptyActivityCard } from "@/components/dashboard/empty-activity-card";
import { PageContainer } from "@/components/dashboard/page-container";
import { PlatformStatusCard } from "@/components/dashboard/platform-status-card";
import { QuickTransferCard } from "@/components/dashboard/quick-transfer-card";
import { getSpotifyConnection } from "@/lib/spotify-connection-store";

export default async function DashboardPage() {
  const { userId } = await auth();
  const spotifyConnection = userId ? await getSpotifyConnection(userId) : null;
  const isSpotifyConnected = Boolean(spotifyConnection);

  return (
    <PageContainer
      title="Welcome back"
      description="Move your playlists between platforms without rebuilding them manually."
      maxWidthClassName="max-w-7xl"
      contentClassName="space-y-8"
    >
      <section
        aria-labelledby="connected-platforms-heading"
        className="space-y-4 animate-in fade-in-0 duration-300"
      >
        <div className="space-y-1">
          <h2
            id="connected-platforms-heading"
            className="text-sm font-semibold tracking-tight text-copy-primary"
          >
            Connected Platforms
          </h2>
          <p className="text-sm text-copy-muted">
            Link your streaming services before running transfers.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <PlatformStatusCard
            platformName="Spotify"
            status={isSpotifyConnected ? "Connected" : "Not connected"}
            actionLabel={
              isSpotifyConnected ? "Reconnect Spotify" : "Connect Spotify"
            }
            actionHref="/api/spotify/connect"
            icon={Disc3}
            accentTextClassName="text-spotify"
            accentSurfaceClassName="bg-spotify/10"
            accentBorderClassName="border-spotify/30"
          />
          <PlatformStatusCard
            platformName="Apple Music"
            status="Ready to connect"
            actionLabel="Connect Apple Music"
            icon={Music2}
            accentTextClassName="text-apple-music"
            accentSurfaceClassName="bg-apple-music/10"
            accentBorderClassName="border-apple-music/30"
          />
        </div>
      </section>
      <section
        aria-labelledby="quick-transfer-heading"
        className="space-y-4 animate-in fade-in-0 duration-500"
      >
        <h2
          id="quick-transfer-heading"
          className="text-sm font-semibold tracking-tight text-copy-primary"
        >
          Quick Transfer
        </h2>
        <QuickTransferCard />
      </section>
      <section
        aria-labelledby="recent-activity-heading"
        className="space-y-4 animate-in fade-in-0 duration-700"
      >
        <h2
          id="recent-activity-heading"
          className="text-sm font-semibold tracking-tight text-copy-primary"
        >
          Recent Activity
        </h2>
        <EmptyActivityCard />
      </section>
    </PageContainer>
  );
}
