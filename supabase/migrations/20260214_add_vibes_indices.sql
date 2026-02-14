-- Add indices for performance optimization
CREATE INDEX IF NOT EXISTS vibes_created_at_idx ON public.vibes (created_at DESC);
CREATE INDEX IF NOT EXISTS vibes_song_id_idx ON public.vibes (song_id);
