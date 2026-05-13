import { PageContainer } from "@/components/dashboard/page-container";

export default function PlaylistTracksLoading() {
  return (
    <PageContainer
      title="Playlist Tracks"
      description="Browse track details for your selected Spotify playlist."
      maxWidthClassName="max-w-7xl"
    >
      <section className="overflow-hidden rounded-2xl border border-surface-border/80 bg-surface/80 p-5">
        <div className="h-7 w-64 animate-pulse rounded-full bg-elevated/80" />
        <div className="mt-2 h-4 w-40 animate-pulse rounded-full bg-elevated/70" />
        <div className="mt-5 space-y-3">
          {Array.from({ length: 7 }).map((_, index) => (
            <div
              key={`spotify-playlist-track-loading-row-${index}`}
              className="h-11 animate-pulse rounded-xl bg-elevated/70"
            />
          ))}
        </div>
      </section>
    </PageContainer>
  );
}
