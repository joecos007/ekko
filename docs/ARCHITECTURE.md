# EKKO Architecture Documentation

## Overview
EKKO is a next-generation social audio streaming platform built with modern web technologies. It focuses on high-fidelity audio, real-time social interaction ("Vibes"), and a premium, immersive user interface.

## Tech Stack
- **Frontend Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom animations and utility classes
- **State Management**: Zustand (Player, Vibes)
- **Data Fetching**: TanStack Query
- **Backend/Database**: Supabase (PostgreSQL, Auth, Storage, Realtime)
- **Audio Engine**: Howler.js with custom hooks

## Core Modules

### 1. Authentication
- Implemented via Supabase Auth.
- Protected routes handling (Planned: `middleware.ts`).
- Custom Login/Signup pages in `app/(auth)`.

### 2. Player System
- **Global State**: `store/player-store.ts` manages queue, playback status, and volume.
- **Audio Provider**: `components/player/audio-provider.tsx` handles the actual `Howler` instance and audio lifecycle.
- **UI**: `components/player/player-bar.tsx` provides the persistent playback controls.

### 3. Vibe System (Real-time)
- **Concept**: Users can share "vibes" (emojis/reactions) attached to specific timestamps or songs.
- **Implementation**: Supabase Realtime channels.
- **Components**: `components/vibes/*` handles the heatmap and interactive elements.

### 4. Admin Dashboard (In Development)
- Dedicated section for platform management.
- Features: User management, song upload/management, system stats.
- Located in `app/admin`.

## Directory Structure
- `app/`: Next.js App Router pages and layouts.
  - `(auth)/`: Authentication routes.
  - `(dashboard)/`: Main user interface (Sidebar + Content).
  - `(public)/`: Landing page and public-facing content.
- `components/`: Reusable UI components.
  - `ui/`: Primitives (Buttons, Inputs, etc.) mostly compatible with shadcn/ui.
  - `player/`: Audio player specific components.
  - `visualizations/`: Canvas/WebGL based audio visualizers (Planned).
- `lib/`: Utilities and configuration.
  - `supabase.ts`: Supabase client initialization.
  - `utils.ts`: Helper functions.
- `public/`: Static assets (images, fonts, music files).
- `store/`: Zustand state definitions.
- `hooks/`: Custom React hooks.

## Key Design Principles
- **"Glassmorphism"**: Extensive use of backdrop blur, semi-transparent backgrounds, and glowing borders.
- **Motion**: Fluid animations using Framer Motion and CSS keyframes.
- **Performance**: Optimistic UI updates and efficient state management for audio playback.

## Contribution Guidelines
- Ensure all new components use `geist-sans` or `geist-mono` fonts.
- Maintain the comprehensive color system defined in `app/globals.css`.
- Run linting before committing.
