# EKKO — Product Requirements Document

> **Stylized "echo"** | Internet-native spelling | Short, brandable | Social & audio-first

---

## 1. Overview

EKKO is a modern, Spotify-inspired music streaming web application built for learning modern web development while creating a portfolio-worthy project. The app focuses on **clean, minimalistic design** with trending UI/UX patterns.

### Vision
A sleek, Gen Z-focused music platform that feels premium from the first interaction—featuring glassmorphism, micro-animations, and a dark-first aesthetic.

---

## 2. Tech Stack

### Frontend
| Layer | Technology |
|-------|------------|
| Framework | **Next.js 15** (App Router) |
| Language | **TypeScript** |
| Styling | **Tailwind CSS** |
| Components | **shadcn/ui** (Lyra style, gray theme, Remix Icons, Geist Mono font, no border radius) |
| State | **Zustand** (player state, queue, volume) |
| Data Fetching | **TanStack Query** (React Query) |

### Backend (Supabase)
| Service | Purpose |
|---------|---------|
| **Postgres** | Music metadata, users, playlists, relations |
| **Auth** | Email, OAuth (Google, GitHub), magic links |
| **Storage** | Audio files (private), album art (public) |
| **RLS** | Row-level security for user data protection |
| **Edge Functions** | Signed URLs, secure operations |

### Deployment
| Service | Purpose |
|---------|---------|
| **Vercel** | Frontend hosting |
| **Supabase** | Backend services |

---

## 3. Design System

### shadcn/ui Preset Configuration
```bash
npx shadcn@latest create --preset "https://ui.shadcn.com/init?base=base&style=lyra&baseColor=gray&theme=gray&iconLibrary=remixicon&font=geist-mono&menuAccent=subtle&menuColor=default&radius=none&template=next&rtl=false" --template next
```

### Design Principles
1. **Minimalistic** — No visual clutter, generous whitespace
2. **Dark-first** — Premium feel with gray palette
3. **Sharp edges** — Zero border radius (modern, editorial)
4. **Micro-animations** — Subtle hover states, transitions
5. **Typography-driven** — Geist Mono for that tech-forward feel

### Color Palette (Gray Theme)
| Token | Usage |
|-------|-------|
| `background` | Main app background |
| `foreground` | Primary text |
| `muted` | Secondary text, borders |
| `accent` | Interactive elements, highlights |
| `primary` | CTAs, active states |

### UI Patterns
- **Glassmorphism** — Subtle backdrop blur on overlays
- **Gradient accents** — Vibrant color pops on album art
- **Skeleton loaders** — Smooth loading states
- **Toast notifications** — Non-intrusive feedback

---

## 4. Core Features

### Phase 1: Foundation
| Feature | Description |
|---------|-------------|
| **Audio Player** | Global, persistent player with queue system |
| **Playback Controls** | Play, pause, next, prev, shuffle, repeat |
| **Progress Bar** | Seekable with time display |
| **Volume Control** | Slider with mute toggle |
| **Keyboard Shortcuts** | Space (play/pause), arrows (skip) |

### Phase 2: Library
| Feature | Description |
|---------|-------------|
| **Playlists** | Create, edit, delete, reorder tracks |
| **Liked Songs** | Heart toggle, saved tracks page |
| **Albums** | Album pages with track listings |
| **Artists** | Artist pages with discography |

### Phase 3: Discovery
| Feature | Description |
|---------|-------------|
| **Search** | Songs, albums, artists (Postgres full-text) |
| **Browse** | Curated sections, genres |
| **Recently Played** | Listening history |

### Phase 4: Polish
| Feature | Description |
|---------|-------------|
| **Auth** | Email, Google, GitHub login |
| **Responsive** | Mobile-first, tablet, desktop |
| **Accessibility** | Keyboard nav, screen readers |
| **PWA Ready** | Installable, offline-capable (stretch) |

---

## 5. Database Schema

### Entity Relationship
```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   artists   │────<│   albums    │────<│    songs    │
└─────────────┘     └─────────────┘     └─────────────┘
                                              │
                                              │
┌─────────────┐     ┌──────────────────┐      │
│  playlists  │────<│  playlist_songs  │──────┘
└─────────────┘     └──────────────────┘
      │
      └── user_id → auth.users
      
┌──────────────┐
│  liked_songs │── user_id → auth.users
└──────────────┘   song_id → songs
```

### Tables

#### `artists`
| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| name | text | Artist name |
| image_url | text | Profile image |
| created_at | timestamptz | Creation date |

#### `albums`
| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| artist_id | uuid | FK → artists |
| title | text | Album title |
| cover_url | text | Album artwork |
| release_date | date | Release date |
| created_at | timestamptz | Creation date |

#### `songs`
| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| album_id | uuid | FK → albums |
| title | text | Track title |
| duration | int | Length in seconds |
| audio_path | text | Storage path |
| is_public | bool | Visibility flag |
| created_at | timestamptz | Creation date |

#### `playlists`
| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| user_id | uuid | FK → auth.users |
| title | text | Playlist name |
| is_public | bool | Public/private |
| created_at | timestamptz | Creation date |

#### `playlist_songs`
| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| playlist_id | uuid | FK → playlists |
| song_id | uuid | FK → songs |
| position | int | Track order |
| added_at | timestamptz | Add date |

#### `liked_songs`
| Column | Type | Description |
|--------|------|-------------|
| user_id | uuid | PK, FK → auth.users |
| song_id | uuid | PK, FK → songs |
| created_at | timestamptz | Like date |

---

## 6. Application Architecture

### Folder Structure
```
/app
  /(auth)
    /login
    /signup
  /(main)
    /page.tsx          # Home / Browse
    /search/page.tsx
    /playlist/[id]/page.tsx
    /album/[id]/page.tsx
    /artist/[id]/page.tsx
    /liked/page.tsx
    /layout.tsx        # Sidebar + Player layout
  /layout.tsx          # Root layout (providers)
  /globals.css

/components
  /ui                  # shadcn/ui components
  /player
    /audio-provider.tsx
    /player-bar.tsx
    /controls.tsx
    /progress-bar.tsx
    /volume-control.tsx
    /track-info.tsx
  /songs
    /song-list.tsx
    /song-row.tsx
  /playlists
    /playlist-card.tsx
    /create-playlist-dialog.tsx
  /albums
    /album-card.tsx
    /album-header.tsx
  /artists
    /artist-card.tsx
  /layout
    /sidebar.tsx
    /header.tsx

/lib
  /supabase.ts         # Client initialization
  /utils.ts            # Helper functions

/hooks
  /use-songs.ts
  /use-playlists.ts
  /use-liked-songs.ts
  /use-player.ts

/store
  /player-store.ts     # Zustand player state

/types
  /database.ts         # Supabase generated types
```

### State Architecture
```
┌─────────────────────────────────────────────────┐
│                   React Query                    │
│  (songs, playlists, albums, artists, search)    │
└─────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────┐
│                    Zustand                       │
│  (queue, currentIndex, isPlaying, volume,       │
│   shuffle, repeat, currentTime, duration)       │
└─────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────┐
│              AudioProvider (hidden)              │
│  <audio ref={} onTimeUpdate onEnded />          │
└─────────────────────────────────────────────────┘
```

---

## 7. Security Model

### Row Level Security (RLS)
```sql
-- Playlists: users can only access their own
CREATE POLICY "read own playlists" ON playlists
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "create playlist" ON playlists
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Playlist songs: access through playlist ownership
CREATE POLICY "manage playlist songs" ON playlist_songs
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM playlists
      WHERE playlists.id = playlist_songs.playlist_id
      AND playlists.user_id = auth.uid()
    )
  );

-- Liked songs: users manage their own
CREATE POLICY "manage liked songs" ON liked_songs
  FOR ALL USING (auth.uid() = user_id);

-- Public content: anyone can read
CREATE POLICY "read public songs" ON songs
  FOR SELECT USING (is_public = true);
```

### Storage Buckets
| Bucket | Access | Purpose |
|--------|--------|---------|
| `songs` | Private | Audio files, signed URLs only |
| `covers` | Public | Album artwork, artist images |

---

## 8. Key UI Flows

### Audio Playback Flow
1. User clicks song in list
2. `setQueue(songs, clickedIndex)` called
3. Zustand updates `queue` and `currentIndex`
4. `AudioProvider` reacts, updates `<audio>` src
5. Signed URL fetched from Supabase Storage
6. Playback begins, progress updates via `onTimeUpdate`

### Playlist Creation Flow
1. User clicks "Create Playlist"
2. Dialog opens with title input
3. Submit → Supabase insert with `user_id = auth.uid()`
4. React Query invalidates playlists cache
5. New playlist appears in sidebar

---

## 9. Verification Plan

### Automated Testing
| Type | Tool | Coverage |
|------|------|----------|
| Unit | Vitest | Store logic, utils |
| Component | React Testing Library | UI components |
| E2E | Playwright | Critical flows |

### Manual Testing Checklist
- [ ] Audio plays on song click
- [ ] Queue updates correctly
- [ ] Next/prev skip tracks
- [ ] Volume slider works
- [ ] Playlists save for logged-in users
- [ ] RLS blocks unauthorized access
- [ ] Mobile layout responsive
- [ ] Keyboard shortcuts functional

---

## 10. Development Phases

### Week 1: Foundation
- Project setup with shadcn/ui preset
- Supabase project creation
- Database schema migration
- Basic audio player (play/pause)

### Week 2: Core Player
- Full player controls
- Queue system
- Progress bar + seek
- Volume + keyboard shortcuts

### Week 3: Library
- Auth integration
- Playlist CRUD
- Liked songs
- Album/Artist pages

### Week 4: Polish
- Search implementation
- Responsive design
- Animations + micro-interactions
- Deployment

---

## 11. Success Metrics

| Metric | Target |
|--------|--------|
| First Contentful Paint | < 1.5s |
| Time to Interactive | < 3s |
| Lighthouse Score | > 90 |
| Mobile Usability | 100% |

---

## 12. Legal Considerations

> ⚠️ **Important**: Only royalty-free or user-owned audio content can be streamed. This app is for learning/portfolio purposes.

Sources for legal audio:
- [Free Music Archive](https://freemusicarchive.org/)
- [Incompetech](https://incompetech.com/)
- [Pixabay Music](https://pixabay.com/music/)

---

## Next Steps

Upon approval of this PRD:
1. Initialize project with shadcn/ui preset
2. Create Supabase project and apply migrations
3. Begin Phase 1 implementation

---

*Document created for EKKO music streaming app development.*
