
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

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

async function inspectSongs() {
    console.log('--- Inspecting Songs ---');

    // 1. Get Local Files
    if (!fs.existsSync(MUSIC_DIR)) {
        console.error('Music directory not found:', MUSIC_DIR);
        return;
    }
    const localFiles = fs.readdirSync(MUSIC_DIR).filter(file => file.endsWith('.mp3'));
    console.log(`Local Files (${localFiles.length}):`);
    localFiles.forEach(f => console.log(` - ${f}`));

    // 2. Get DB Songs
    const { data: dbSongs, error } = await supabase
        .from('songs')
        .select('id, title, audio_path');

    if (error) {
        console.error('Failed to fetch DB songs:', error.message);
        return;
    }

    console.log(`\nDatabase Songs (${dbSongs?.length || 0}):`);
    dbSongs?.forEach(s => console.log(` - ${s.title} (Path: ${s.audio_path})`));

    // 4. Compare & Insert Missing
    console.log('--- Analysis ---');

    for (const file of localFiles) {
        const titleFromFilename = file.replace('.mp3', '');

        const match = dbSongs?.find(s => {
            if (!s.audio_path) return false;
            // Simple check
            return s.title === titleFromFilename || s.audio_path.includes(file);
        });

        if (!match) {
            console.log(`MISSING: ${file}`);

            // AUTO INSERT
            const sanitizedFile = file.replace(/[^a-zA-Z0-9.\-_]/g, '_');
            const audioPathInDb = sanitizedFile;

            // Upload first (idempotent-ish)
            const filePath = path.join(MUSIC_DIR, file);
            const fileBuffer = fs.readFileSync(filePath);
            const { error: uploadError } = await supabase.storage
                .from('songs')
                .upload(audioPathInDb, fileBuffer, { upsert: true, contentType: 'audio/mpeg' });
            if (uploadError) console.log(`  Upload warning: ${uploadError.message}`);

            const title = file.replace('.mp3', '').replace(/_/g, ' ').replace(/"/g, '').replace(/“|”/g, '');

            // Append to SQL file
            const sql = `INSERT INTO public.songs (title, artist, audio_path, duration) VALUES ('${title.replace(/'/g, "''")}', 'Team Ekko', '${audioPathInDb}', 0);\n`;
            fs.appendFileSync('missing_songs.sql', sql);
            console.log(`  Generated SQL for: ${title}`);

        } else {
            // console.log(`OK: ${file}`);
        }
    }

    console.log('Inspection complete. SQL generated in missing_songs.sql');
}

inspectSongs().catch(console.error);
