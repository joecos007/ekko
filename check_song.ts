import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://tajbdewemhjktflozork.supabase.co'
// Truncated key for safety in logs, but using the full one I read earlier
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRhamJkZXdlbWhqa3RmbG96b3JrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAzMjg1NjUsImV4cCI6MjA4NTkwNDU2NX0.DpqdegG6lkHuXXRVb9A4_ExnhTiLx_Bc5DH5W78jrAQ'
const supabase = createClient(supabaseUrl, supabaseKey)

async function checkSong() {
    console.log("Checking for song...")
    const { data, error } = await supabase
        .from('songs')
        .select('*')
        .ilike('title', '%Mga Isla%')

    if (error) console.error('Error:', error)
    else console.log('Songs found:', JSON.stringify(data, null, 2))
}

checkSong()
