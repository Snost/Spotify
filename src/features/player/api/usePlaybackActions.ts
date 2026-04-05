'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  addTrackToPlaybackQueue,
  getPlayback,
  getPlaybackQueue,
  pausePlayback,
  removeTrackFromPlaybackQueue,
  resumePlayback,
  seekPlaybackPosition,
  skipToNextTrack,
  skipToPreviousTrack,
  startPlayback,
  syncPlaybackPosition,
  togglePlaybackRepeat,
  togglePlaybackShuffle,
} from '@/shared/api/playback'
import { getOrCreateDeviceId } from '@/shared/lib/device/getOrCreateDeviceId'
import { usePlayerStore } from '@/features/player/model/player.store'
import type { PlaybackContextType } from '@/entities/playback/model/types'

export function usePlaybackActions() {
  const queryClient = useQueryClient()

  const {
    setPlayback,
    setQueue,
    setCurrentStreamUrl,
    setCurrentTrackId,
    setStartPositionMs,
    setIsLoading,
  } = usePlayerStore()

  const refreshPlaybackState = async () => {
    const [playback, queue] = await Promise.all([
      queryClient.fetchQuery({
        queryKey: ['playback'],
        queryFn: getPlayback,
      }),
      queryClient.fetchQuery({
        queryKey: ['playback-queue'],
        queryFn: getPlaybackQueue,
      }),
    ])

    setPlayback(playback ?? null)
    setQueue(queue ?? null)
  }

  const startPlaybackMutation = useMutation({
    mutationFn: async (params: {
      contextType: PlaybackContextType
      contextExternalId: string | null
      startTrackId: string | null
    }) => {
      const deviceId = getOrCreateDeviceId()

      return startPlayback({
        deviceId,
        contextType: params.contextType,
        contextExternalId: params.contextExternalId,
        startTrackId: params.startTrackId,
      })
    },
    onMutate: () => {
      setIsLoading(true)
    },
    onSuccess: async (data) => {
      const streamUrl = data.hlsUrl ?? data.dashUrl ?? null

      setCurrentStreamUrl(streamUrl)
      setCurrentTrackId(data.trackId ?? null)
      setStartPositionMs(data.startPositionMs ?? 0)

      await queryClient.invalidateQueries({ queryKey: ['playback'] })
      await queryClient.invalidateQueries({ queryKey: ['playback-queue'] })
    },
    onSettled: () => {
      setIsLoading(false)
    },
  })

  const pausePlaybackMutation = useMutation({
    mutationFn: async () => {
      const deviceId = getOrCreateDeviceId()
      return pausePlayback({ deviceId })
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['playback'] })
    },
  })

  const resumePlaybackMutation = useMutation({
    mutationFn: async () => {
      const deviceId = getOrCreateDeviceId()
      return resumePlayback({ deviceId })
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['playback'] })
    },
  })

  const nextTrackMutation = useMutation({
    mutationFn: async () => {
      const deviceId = getOrCreateDeviceId()
      return skipToNextTrack({ deviceId })
    },
    onSuccess: async (data) => {
      const streamUrl = data.hlsUrl ?? data.dashUrl ?? null

      setCurrentStreamUrl(streamUrl)
      setCurrentTrackId(data.trackId ?? null)
      setStartPositionMs(data.startPositionMs ?? 0)

      await queryClient.invalidateQueries({ queryKey: ['playback'] })
      await queryClient.invalidateQueries({ queryKey: ['playback-queue'] })
    },
  })

  const previousTrackMutation = useMutation({
    mutationFn: async () => {
      const deviceId = getOrCreateDeviceId()
      return skipToPreviousTrack({ deviceId })
    },
    onSuccess: async (data) => {
      const streamUrl = data.hlsUrl ?? data.dashUrl ?? null

      setCurrentStreamUrl(streamUrl)
      setCurrentTrackId(data.trackId ?? null)
      setStartPositionMs(data.startPositionMs ?? 0)

      await queryClient.invalidateQueries({ queryKey: ['playback'] })
      await queryClient.invalidateQueries({ queryKey: ['playback-queue'] })
    },
  })

  const toggleShuffleMutation = useMutation({
    mutationFn: async () => {
      const deviceId = getOrCreateDeviceId()
      return togglePlaybackShuffle({ deviceId })
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['playback'] })
      await queryClient.invalidateQueries({ queryKey: ['playback-queue'] })
    },
  })

  const toggleRepeatMutation = useMutation({
    mutationFn: async () => {
      const deviceId = getOrCreateDeviceId()
      return togglePlaybackRepeat({ deviceId })
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['playback'] })
    },
  })

  const addToQueueMutation = useMutation({
    mutationFn: async (trackId: string) => {
      return addTrackToPlaybackQueue({ trackId })
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['playback-queue'] })
    },
  })

  const removeFromQueueMutation = useMutation({
    mutationFn: async (trackId: string) => {
      return removeTrackFromPlaybackQueue(trackId)
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['playback-queue'] })
    },
  })

  const syncPositionMutation = useMutation({
    mutationFn: async (positionMs: number) => {
      const deviceId = getOrCreateDeviceId()
      return syncPlaybackPosition({ deviceId, positionMs })
    },
  })

  const seekPositionMutation = useMutation({
    mutationFn: async (positionMs: number) => {
      const deviceId = getOrCreateDeviceId()
      return seekPlaybackPosition({ deviceId, positionMs })
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['playback'] })
    },
  })

  return {
    startPlaybackMutation,
    pausePlaybackMutation,
    resumePlaybackMutation,
    nextTrackMutation,
    previousTrackMutation,
    toggleShuffleMutation,
    toggleRepeatMutation,
    addToQueueMutation,
    removeFromQueueMutation,
    syncPositionMutation,
    seekPositionMutation,
    refreshPlaybackState,
  }
}