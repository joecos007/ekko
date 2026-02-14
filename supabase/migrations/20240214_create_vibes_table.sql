-- Create vibes table
create table public.vibes (
    id uuid not null default gen_random_uuid(),
    song_id uuid not null references public.songs(id) on delete cascade,
    user_id uuid not null references auth.users(id) on delete cascade,
    timestamp float4 not null,  -- Seconds into the song
    text text null,             -- Optional comment
    emoji text null,            -- Optional emoji reaction
    color text null,            -- Optional hex color
    created_at timestamptz not null default now(),
    
    constraint vibes_pkey primary key (id)
);

-- Enable RLS
alter table public.vibes enable row level security;

-- Policies
create policy "Vibes are viewable by everyone" 
on public.vibes for select 
using ( true );

create policy "Users can insert their own vibes" 
on public.vibes for insert 
with check ( auth.uid() = user_id );

create policy "Users can delete their own vibes"
on public.vibes for delete
using ( auth.uid() = user_id );

-- Realtime
alter publication supabase_realtime add table public.vibes;
