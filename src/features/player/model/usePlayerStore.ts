'use client'

import { create } from 'zustand'

type PlayerState = {
  currentTrackId: string | null
  currentSource: string | null
  isPlaying: boolean
  progress: number
  duration: number
  volume: number

  shuffle: boolean

  play: (payload: { trackId: string; source?: string | null }) => void
  pause: () => void
  toggle: (payload: { trackId: string; source?: string | null }) => void
  setProgress: (value: number) => void
  setDuration: (value: number) => void
  setVolume: (value: number) => void
  seekTo: (value: number) => void

  toggleShuffle: () => void
}

export const usePlayerStore = create<PlayerState>((set, get) => ({
  currentTrackId: null,
  currentSource: null,
  isPlaying: false,
  progress: 0,
  duration: 0,
  volume: 80,

  shuffle: false,

  play: ({ trackId, source = null }) =>
    set({
      currentTrackId: trackId,
      currentSource: source,
      isPlaying: true,
    }),

  pause: () =>
    set({
      isPlaying: false,
    }),

  toggle: ({ trackId, source = null }) => {
    const { currentTrackId, isPlaying } = get()

    if (currentTrackId === trackId) {
      set({ isPlaying: !isPlaying })
      return
    }

    set({
      currentTrackId: trackId,
      currentSource: source,
      isPlaying: true,
      progress: 0,
      duration: 0,
    })
  },

  setProgress: (value) => set({ progress: value }),
  setDuration: (value) => set({ duration: value }),
  setVolume: (value) => set({ volume: value }),
  seekTo: (value) => set({ progress: value }),

  toggleShuffle: () =>
    set((state) => ({
      shuffle: !state.shuffle,
    })),
}))