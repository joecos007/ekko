
-- Enable RLS (just in case)
ALTER TABLE songs ENABLE ROW LEVEL SECURITY;

-- Allow anon inserts for development/sync purposes
CREATE POLICY "Enable insert for anon" ON "public"."songs"
AS PERMISSIVE FOR INSERT
TO anon
WITH CHECK (true);

-- Allow anon upload to storage bucket 'songs'
-- This might need to be done via storage.buckets policies, which are separate.
-- Assuming storage bucket policies are already permissive or need similar handling.
-- But for now, let's focus on the TABLE insert which failed.
