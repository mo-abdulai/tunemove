import { PageContainer } from "@/components/dashboard/page-container";

export default function PlaylistsPage() {
  return (
    <PageContainer
      title="Playlists"
      description="Browse imported source playlists and destination-ready results."
    >
      <section className="rounded-2xl border border-surface-border bg-surface p-6">
        <h2 className="text-lg font-semibold tracking-tight text-copy-primary">
          Playlists
        </h2>
        <p className="mt-2 text-sm text-copy-secondary">
          Playlist catalog and previews will appear here.
        </p>
      </section>
    </PageContainer>
  );
}
