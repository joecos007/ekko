import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'

export const dynamic = 'force-dynamic'

export async function GET() {
    try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
        const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

        if (!supabaseUrl || !supabaseKey) {
            return NextResponse.json({ error: 'Missing Supabase env vars' }, { status: 500 })
        }

        const supabase = createClient(supabaseUrl, supabaseKey)

        const musicDir = path.join(process.cwd(), 'public', 'music')

        if (!fs.existsSync(musicDir)) {
            return NextResponse.json({ error: 'Music directory not found' }, { status: 404 })
        }

        const files = fs.readdirSync(musicDir).filter(file => file.endsWith('.mp3'))

        const results = []

        for (const file of files) {
            const title = file.replace('.mp3', '')
            const audioPath = `/music/${file}`

            // Check if exists
            const { data: existing } = await supabase
                .from('songs')
                .select('id')
                .eq('audio_path', audioPath)

            // Using array check instead of .single() to be safe
            if (!existing || existing.length === 0) {
                // Insert
                // Note: Removed 'artist' field as it doesn't exist in schema
                const { data, error } = await supabase
                    .from('songs')
                    .insert({
                        title: title,
                        duration: 180, // Default duration
                        audio_path: audioPath,
                        is_public: true
                    })
                    .select()

                if (error) {
                    console.error(`Failed to insert ${file}:`, error)
                    results.push({ file, status: 'error', error })
                } else {
                    results.push({ file, status: 'inserted', data })
                }
            } else {
                results.push({ file, status: 'skipped', id: existing[0].id })
            }
        }

        return NextResponse.json({
            message: 'Seeding complete',
            results
        })

    } catch (error) {
        console.error('Seeding error:', error)
        return NextResponse.json({ error: 'Internal Server Error', details: error }, { status: 500 })
    }
}
