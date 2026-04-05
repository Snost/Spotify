import { create } from 'zustand'
import type {
  PlaybackQueueResponse,
  PlaybackSession,
} from '@/entities/playback/model/types'

type PlayerStore = {
  playback: PlaybackSession | null
  queue: PlaybackQueueResponse | null
  currentStreamUrl: string | null
  currentTrackId: string | null
  startPositionMs: number | null
  isLoading: boolean
  isPlayerReady: boolean
  isBlockedByAnotherDevice: boolean

  setPlayback: (playback: PlaybackSession | null) => void
  setQueue: (queue: PlaybackQueueResponse | null) => void
  setCurrentStreamUrl: (url: string | null) => void
  setCurrentTrackId: (trackId: string | null) => void
  setStartPositionMs: (value: number | null) => void
  setIsLoading: (value: boolean) => void
  setIsPlayerReady: (value: boolean) => void
  setIsBlockedByAnotherDevice: (value: boolean) => void

  resetPlayerState: () => void
}

export const usePlayerStore = create<PlayerStore>((set) => ({
  playback: null,
  queue: null,
  currentStreamUrl: null,
  currentTrackId: null,
  startPositionMs: null,
  isLoading: false,
  isPlayerReady: false,
  isBlockedByAnotherDevice: false,

  setPlayback: (playback) => set({ playback }),
  setQueue: (queue) => set({ queue }),
  setCurrentStreamUrl: (currentStreamUrl) => set({ currentStreamUrl }),
  setCurrentTrackId: (currentTrackId) => set({ currentTrackId }),
  setStartPositionMs: (startPositionMs) => set({ startPositionMs }),
  setIsLoading: (isLoading) => set({ isLoading }),
  setIsPlayerReady: (isPlayerReady) => set({ isPlayerReady }),
  setIsBlockedByAnotherDevice: (isBlockedByAnotherDevice) =>
    set({ isBlockedByAnotherDevice }),

  resetPlayerState: () =>
    set({
      playback: null,
      queue: null,
      currentStreamUrl: null,
      currentTrackId: null,
      startPositionMs: null,
      isLoading: false,
      isPlayerReady: false,
      isBlockedByAnotherDevice: false,
    }),
}))