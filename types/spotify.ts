export type SpotifyTokenResponse = {
  access_token: string;
  token_type: string;
  scope?: string;
  expires_in: number;
  refresh_token?: string;
};

export type SpotifyProfileResponse = {
  id: string;
  display_name: string | null;
  email?: string | null;
  images: Array<{
    url: string;
  }>;
};

export type SpotifyPlaylistResponse = {
  id: string;
  name: string;
  description: string | null;
  images: Array<{
    url: string;
  }>;
  tracks?: {
    total: number;
  };
  items?: {
    total: number;
  };
  owner: {
    id?: string | null;
    display_name: string | null;
  };
  collaborative?: boolean | null;
  public?: boolean | null;
  external_urls: {
    spotify?: string;
  };
};

export type SpotifyPlaylistsResponse = {
  items: SpotifyPlaylistResponse[];
  total: number;
  limit: number;
  offset: number;
  next: string | null;
  previous: string | null;
};

export type SpotifyPlaylistTrackResponse = {
  added_at?: string | null;
  item?: {
    type?: string | null;
    name?: string | null;
    duration_ms?: number | null;
    album?: {
      name?: string | null;
    } | null;
  } | null;
  track?: {
    type?: string | null;
    name?: string | null;
    duration_ms?: number | null;
    album?: {
      name?: string | null;
    } | null;
  } | null;
};

export type SpotifyPlaylistTracksResponse = {
  items: SpotifyPlaylistTrackResponse[];
  total?: number;
  limit?: number;
  offset?: number;
  next?: string | null;
};

export type SpotifyProfile = {
  id: string;
  displayName: string | null;
  email: string | null;
  imageUrl: string | null;
};

export type SpotifyPlaylist = {
  id: string;
  name: string;
  description: string | null;
  imageUrl: string | null;
  trackCount: number;
  ownerName: string | null;
  ownerId: string | null;
  isCollaborative: boolean;
  canAccessTracks: boolean | null;
  externalUrl: string | null;
};

export type SpotifyPlaylistTrack = {
  position: number;
  title: string;
  albumName: string | null;
  addedAt: string | null;
  durationMs: number | null;
};

export type SpotifyConnection = {
  accessToken: string;
  refreshToken: string | null;
  expiresAt: number;
  tokenType: string;
  scope: string;
  profile: SpotifyProfile;
  connectedAt: string;
};
