-- Drop the Foreign Key to auth.users if it exists (it might have a generated name, so we try to be specific or just add a new one)
-- Ideally we reference profiles for the join.

-- First, let's try to drop the existing constraint if we know its name. 
-- Default naming is usually table_column_fkey.
alter table public.vibes drop constraint if exists vibes_user_id_fkey;

-- Add foreign key to public.profiles
alter table public.vibes
  add constraint vibes_user_id_fkey
  foreign key (user_id)
  references public.profiles(id)
  on delete cascade;

-- Note: This assumes profiles.id is the same as auth.users.id, which is standard in Supabase starters.
