
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'
import fs from 'fs'

// Load env from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase URL or Key')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function checkSongs() {
    console.log('Fetching songs from DB...')
    const { data: songs, error } = await supabase
        .from('songs')
        .select('id, title, artist, audio_path, image_path')

    if (error) {
        console.error('Error fetching songs:', error)
        return
    }

    console.log(`Found ${songs.length} songs in DB:`)
    const publicDir = path.join(process.cwd(), 'public')

    let errors = 0
    songs.forEach(s => {
        const audioFile = path.join(publicDir, s.audio_path)
        const imageFile = path.join(publicDir, s.image_path)

        const audioExists = fs.existsSync(audioFile)
        const imageExists = fs.existsSync(imageFile)

        if (!audioExists || !imageExists) {
            console.error(`[FAIL] ${s.title}`)
            if (!audioExists) console.error(`  - Missing Audio: ${s.audio_path}`)
            if (!imageExists) console.error(`  - Missing Image: ${s.image_path}`)
            errors++
        } else {
            console.log(`[OK] ${s.title}`)
        }
    })

    if (errors > 0) {
        console.error(`\nFound ${errors} missing files!`)
        process.exit(1)
    } else {
        console.log(`\nAll ${songs.length} songs have valid assets.`)
    }
}

checkSongs()
