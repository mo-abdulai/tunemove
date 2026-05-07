# TuneMove

## Overview

TuneMove is a modern cross-platform playlist transfer application that allows users to migrate playlists between music streaming services such as Spotify and Apple Music. The platform is designed for users who want to preserve and synchronize their music libraries without manually rebuilding playlists on another service.

The application provides a sleek, high-end dashboard experience where users authenticate securely, connect their music accounts, fetch playlists, review track matching results, and transfer playlists between supported platforms.

The product focuses on:

- Fast playlist migration
- Clean and premium user experience
- Reliable track matching
- Secure OAuth-based authentication
- Scalable architecture for future music platform integrations

The initial release supports:

- Spotify → Apple Music transfers

Future versions may support:

- YouTube Music
- Deezer
- Tidal
- Amazon Music
- Playlist synchronization and recurring sync jobs

## Goals

1. Allow users to securely authenticate and connect Spotify and Apple Music accounts.
2. Allow users to fetch and transfer playlists across supported platforms.
3. Provide a premium dashboard experience with smooth animations and polished UI.
4. Build a scalable system architecture that supports future music providers.
5. Provide transparent transfer reporting with matched and unmatched tracks.
6. Maintain a highly responsive frontend with strong loading and error states.

## Core User Flow

1. User lands on the marketing page.
2. User signs up or logs in using Clerk authentication.
3. User enters the dashboard.
4. User connects Spotify account.
5. User connects Apple Music account.
6. User selects:
   - Source platform
   - Destination platform
7. Application fetches playlists from the source platform.
8. User selects a playlist.
9. System fetches playlist tracks.
10. System searches destination platform for matching tracks.
11. User reviews:
    - Successfully matched tracks
    - Low-confidence matches
    - Missing tracks
12. User confirms transfer.
13. Application creates a playlist on the destination platform.
14. Tracks are inserted into the new playlist.
15. Transfer results are saved to history.
16. User can revisit transfer history later.

## Features

### Authentication and Projects

- Clerk authentication
- Email/password sign in
- OAuth providers supported by Clerk
- Protected dashboard routes
- Session persistence
- Middleware-based auth protection

### Platform Connections

- Spotify OAuth integration
- Apple Music authentication
- Token refresh handling
- Connected account status UI
- Account reconnection flow
  
### Playlist Management

- Fetch user playlists
- Display playlist metadata
- Playlist artwork previews
- Playlist track counts
- Paginated playlist loading

### Playlist Transfer Engine

- Track matching engine
- Similarity scoring system
- Duplicate handling
- Missing track detection
- Transfer status updates
- Retry failed track insertion

### Transfer Review System

Matched track previews
Confidence scoring
Manual review mode
Missing track summaries
Transfer progress indicators

### Dashboard Experience

- Animated dashboard UI
- Responsive layout
- Smooth transitions
- Dark premium interface
- Activity history
- Transfer analytics

### Future Features

- Multi-platform support
- Playlist synchronization
- Background jobs
- AI-powered track matching improvements
- Collaborative playlists
- Playlist recommendations
- Export/import functionality

## Scope

### In Scope

- Spotify integration
- Apple Music integration
- Playlist fetching
- Playlist transfer
- authentication and route protection
- Transfer history
- Responsive dashboard
- PostgreSQL persistence
- Secure token storage
- Playlist matching logic
- Error handling and retry flows

### Out of Scope

- Real-time playlist syncing
- Social/music feed features
- Public playlist discovery
- AI-generated playlists
- Music playback
- Desktop/mobile native apps
- Team collaboration features
- Offline support

## Success Criteria

1. A signed-in user can connect Spotify and Apple Music successfully.
2. A user can fetch Spotify playlists.
3. A user can transfer a playlist to Apple Music.
4. The application successfully matches most tracks automatically.
5. Transfer history persists across sessions.
6. All authenticated routes are protected.
7. The dashboard works across desktop and mobile screen sizes.
8. The application passes production builds and type checking.
