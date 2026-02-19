# EKKO Architecture Documentation

## Overview
EKKO is a next-generation social audio streaming platform built with modern web technologies. It focuses on high-fidelity audio, real-time social interaction ("Vibes"), and a premium, immersive user interface.

## Tech Stack
- **Frontend Framework**: Next.js 16.x (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 with custom animations
- **State Management**: Zustand (Player, Vibes)
- **Data Fetching**: TanStack Query
- **Backend/Database**: Supabase (PostgreSQL, Auth, Storage, Realtime)
- **Audio Engine**: Howler.js with custom hooks

## Core Modules

### 1. Authentication
- Implemented via Supabase Auth.
- Protected routes handled in root `middleware.ts`.
- Custom Login/Signup pages in `app/(auth)`.

### 2. Player System
- **Global State**: `store/player-store.ts`.
- **Audio Service**: `services/audio-service.ts` (Singleton).
- **UI**: `components/player/` (Bar, Now Playing, Controls).

### 3. Vibe System (Real-time)
- **Concept**: Interactive emojis/reactions.
- **Components**: `components/vibes/`.

### 4. Admin API
- `app/api/admin/` (Skeleton/In-progress).

## Directory Structure
- `app/`: Next.js App Router.
- `components/`: UI components.
  - `ui/`: Shared primitives.
  - `player/`: Audio components.
  - `vibes/`: Social features.
- `lib/`: Utilities (`utils.ts`).
- `utils/`: Core infrastructure (`supabase/client.ts`, `supabase/middleware.ts`).
- `scripts/`: Maintenance and sync scripts.
- `public/`: Static assets & music.
- `store/`: Zustand stores.
- `hooks/`: Custom hooks.

## Key Design Principles
- **"Glassmorphism"**: Extensive use of backdrop blur, semi-transparent backgrounds, and glowing borders.
- **Motion**: Fluid animations using Framer Motion and CSS keyframes.
- **Performance**: Optimistic UI updates and efficient state management for audio playback.

## Contribution Guidelines
- Ensure all new components use `geist-sans` or `geist-mono` fonts.
- maintain the comprehensive color system defined in `globals.css`.
- Run linting before committing.
