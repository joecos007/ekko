
/* eslint-disable @typescript-eslint/no-require-imports */
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Manually parse .env.local
try {
    const envPath = path.resolve(process.cwd(), '.env.local');
    console.log('Looking for .env.local at:', envPath);

    if (fs.existsSync(envPath)) {
        console.log('.env.local found. Parsing...');
        const envConfig = fs.readFileSync(envPath, 'utf8');
        const lines = envConfig.split(/\r?\n/); // Handle CRLF

        lines.forEach(line => {
            const trimmed = line.trim();
            if (!trimmed || trimmed.startsWith('#')) return; // Skip comments and empty lines

            const match = trimmed.match(/^([^=]+)=(.*)$/);
            if (match) {
                const key = match[1].trim();
                let value = match[2].trim();

                // Remove surrounding quotes if present
                if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
                    value = value.slice(1, -1);
                }

                process.env[key] = value;
            }
        });
        console.log('Env loaded. URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Found' : 'Missing');
    } else {
        console.error('.env.local NOT found at:', envPath);
    }
} catch (e) {
    console.error("Error loading .env.local", e);
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase URL or Key');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSongs() {
    console.log('Fetching songs from DB...');
    const { data: songs, error } = await supabase
        .from('songs')
        .select('id, title, artist, audio_path');

    if (error) {
        console.error('Error fetching songs:', error);
        return;
    }

    console.log(`Found ${songs.length} songs in DB:`);
    songs.forEach(s => console.log(`- [${s.id}] "${s.title}" (${s.artist})`));
}

checkSongs();
