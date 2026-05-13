import { ChevronLeft } from "lucide-react";
import Link from "next/link";

import { PageContainer } from "@/components/dashboard/page-container";
import { SpotifyPlaylistTracksPanel } from "@/components/dashboard/spotify-playlist-tracks-panel";

type PlaylistDetailsPageProps = {
  params: Promise<{
    playlistId: string;
  }>;
};

export default async function PlaylistDetailsPage({
  params,
}: PlaylistDetailsPageProps) {
  const { playlistId } = await params;

  return (
    <PageContainer
      title="Playlist Tracks"
      description="Browse track details for your selected Spotify playlist."
      maxWidthClassName="max-w-7xl"
    >
      <Link
        href="/dashboard/playlists"
        className="inline-flex items-center gap-1.5 rounded-xl border border-surface-border/80 bg-elevated/80 px-3 py-1.5 text-xs font-medium text-copy-primary transition-all duration-200 hover:border-copy-secondary/40 hover:bg-elevated focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-secondary focus-visible:ring-offset-2 focus-visible:ring-offset-base"
      >
        <ChevronLeft className="h-3.5 w-3.5" aria-hidden="true" />
        Back to playlists
      </Link>
      <SpotifyPlaylistTracksPanel playlistId={playlistId} />
    </PageContainer>
  );
}
