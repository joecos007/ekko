
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
// import { fileURLToPath } from 'url';

// Load environment variables from .env.local manually
const envPath = path.resolve(process.cwd(), '.env.local');
const envContent = fs.readFileSync(envPath, 'utf-8');
const env: Record<string, string> = {};
envContent.split('\n').forEach(line => {
    const [key, value] = line.split('=');
    if (key && value) {
        env[key.trim()] = value.trim();
    }
});

const SUPABASE_URL = env['NEXT_PUBLIC_SUPABASE_URL'];
const SUPABASE_KEY = env['NEXT_PUBLIC_SUPABASE_ANON_KEY'];

if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error('Missing Supabase credentials in .env.local');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const MUSIC_DIR = path.resolve(process.cwd(), 'public/music');

async function syncSongs() {
    console.log('Starting song sync...');

    if (!fs.existsSync(MUSIC_DIR)) {
        console.error('Music directory not found:', MUSIC_DIR);
        return;
    }

    const files = fs.readdirSync(MUSIC_DIR).filter(file => file.endsWith('.mp3'));
    console.log(`Found ${files.length} MP3 files.`);

    for (const file of files) {
        console.log(`Processing ${file}...`);
        const audioPathInDb = `/music/${file}`;

        // 2. Check if exists in DB
        const { data: existing } = await supabase
            .from('songs')
            .select('id')
            .eq('title', file.replace('.mp3', '')) // Simple check by title
            .single();

        if (existing) {
            console.log(`  Song already in DB (ID: ${existing.id}). Skipping insert.`);
            // Optional: Update audio_path if needed?
            continue;
        }

        // 3. Insert into DB
        const title = file.replace('.mp3', '').replace(/_/g, ' ').replace(/-/g, ' ');
        // Try to guess artist?
        // For now, default.

        console.log(`  Inserting into DB...`);
        const { error: insertError } = await supabase
            .from('songs')
            .insert({
                title: title,
                artist: 'Team Ekko', // Default
                audio_path: audioPathInDb,
                duration: 0, // Placeholder
                image_path: null, // Placeholder
            });

        if (insertError) {
            console.error(`  Insert failed: ${insertError.message}`);
        } else {
            console.log(`  Inserted successfully.`);
        }
    }

    console.log('Sync complete.');
}

syncSongs().catch(console.error);
