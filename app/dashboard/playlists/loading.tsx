import { PageContainer } from "@/components/dashboard/page-container";

export default function PlaylistsLoading() {
  return (
    <PageContainer
      title="Playlists"
      description="Browse Spotify playlists from your connected account."
    >
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={`spotify-playlist-skeleton-${index}`}
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
    </PageContainer>
  );
}

