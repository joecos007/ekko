import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://tajbdewemhjktflozork.supabase.co'
// Truncated key for safety, but using the full one I read earlier
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRhamJkZXdlbWhqa3RmbG96b3JrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAzMjg1NjUsImV4cCI6MjA4NTkwNDU2NX0.DpqdegG6lkHuXXRVb9A4_ExnhTiLx_Bc5DH5W78jrAQ'
const supabase = createClient(supabaseUrl, supabaseKey)

async function seedSong() {
    console.log("Seeding special song...")

    // Song details
    const song = {
        title: "Mga Isla Sa Gitna Natin",
        audio_path: "/music/Mga Isla Sa Gitna Natin.mp3",
        duration: 180, // Approximate/Default duration
        is_public: true
    }

    const { data, error } = await supabase
        .from('songs')
        .insert([song])
        .select()

    if (error) console.error('Error inserting song:', error)
    else console.log('Song inserted successfully:', data)
}

seedSong()
