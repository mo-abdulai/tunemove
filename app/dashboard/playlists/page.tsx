import { PageContainer } from "@/components/dashboard/page-container";
import { SpotifyPlaylistsPanel } from "@/components/dashboard/spotify-playlists-panel";

export default function PlaylistsPage() {
  return (
    <PageContainer
      title="Playlists"
      description="Browse Spotify playlists from your connected account."
    >
      <SpotifyPlaylistsPanel />
    </PageContainer>
  );
}
