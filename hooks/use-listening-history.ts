'use client'

import { useState, useEffect, useCallback } from 'react'

export interface HistoryEntry {
    songId: string
    title: string
    artist: string
    coverUrl: string
    playedAt: number
}

const STORAGE_KEY = 'ekko_listening_history'
const MAX_ENTRIES = 50

function getHistory(): HistoryEntry[] {
    try {
        const raw = localStorage.getItem(STORAGE_KEY)
        return raw ? JSON.parse(raw) : []
    } catch {
        return []
    }
}

function saveHistory(entries: HistoryEntry[]) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(entries.slice(0, MAX_ENTRIES)))
    } catch {
        // storage full or unavailable
    }
}

export function useListeningHistory() {
    const [history, setHistory] = useState<HistoryEntry[]>([])

    useEffect(() => {
        setHistory(getHistory())
    }, [])

    const addToHistory = useCallback((entry: Omit<HistoryEntry, 'playedAt'>) => {
        const newEntry: HistoryEntry = { ...entry, playedAt: Date.now() }
        const current = getHistory()
        // Remove duplicate if exists
        const filtered = current.filter(h => h.songId !== entry.songId)
        const updated = [newEntry, ...filtered].slice(0, MAX_ENTRIES)
        saveHistory(updated)
        setHistory(updated)
    }, [])

    const clearHistory = useCallback(() => {
        localStorage.removeItem(STORAGE_KEY)
        setHistory([])
    }, [])

    return { history, addToHistory, clearHistory }
}
