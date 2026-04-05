'use client'

import { useEffect, useMemo, useState } from 'react'
import { usePlaybackActions } from '@/features/player/api/usePlaybackActions'
import { usePlayerStore } from '@/features/player/model/usePlayerStore'

export function usePlayerProgress() {
  const { queue } = usePlayerStore()
  const { seekPositionMutation } = usePlaybackActions()

  const currentTrack = queue?.currentTrack ?? null
  const durationMs = currentTrack?.duration ?? 0
  const durationSec = durationMs > 0 ? durationMs / 1000 : 0

  const [currentTimeSec, setCurrentTimeSec] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [dragValueSec, setDragValueSec] = useState(0)

  useEffect(() => {
    const audio = document.querySelector('audio')

    if (!audio) {
      return
    }

    const updateTime = () => {
      if (!isDragging) {
        setCurrentTimeSec(audio.currentTime)
      }
    }

    const handleLoadedMetadata = () => {
      if (!isDragging) {
        setCurrentTimeSec(audio.currentTime)
      }
    }

    updateTime()

    audio.addEventListener('timeupdate', updateTime)
    audio.addEventListener('loadedmetadata', handleLoadedMetadata)
    audio.addEventListener('seeked', updateTime)

    return () => {
      audio.removeEventListener('timeupdate', updateTime)
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata)
      audio.removeEventListener('seeked', updateTime)
    }
  }, [isDragging])

  useEffect(() => {
    setCurrentTimeSec(0)
    setDragValueSec(0)
    setIsDragging(false)
  }, [currentTrack?.id])

  const displayedTimeSec = isDragging ? dragValueSec : currentTimeSec

  const progressPercent = useMemo(() => {
    if (!durationSec || durationSec <= 0) {
      return 0
    }

    return Math.min((displayedTimeSec / durationSec) * 100, 100)
  }, [displayedTimeSec, durationSec])

  const handleProgressChange = (value: number[]) => {
    const nextValue = value[0] ?? 0
    setIsDragging(true)
    setDragValueSec(nextValue)
  }

  const handleProgressCommit = async (value: number[]) => {
    const nextValueSec = value[0] ?? 0
    const nextValueMs = Math.floor(nextValueSec * 1000)

    const audio = document.querySelector('audio')

    if (audio) {
      audio.currentTime = nextValueSec
    }

    setCurrentTimeSec(nextValueSec)
    setDragValueSec(nextValueSec)
    setIsDragging(false)

    await seekPositionMutation.mutateAsync(nextValueMs)
  }

  const formatTime = (totalSeconds: number) => {
    if (!Number.isFinite(totalSeconds) || totalSeconds < 0) {
      return '0 : 00'
    }

    const minutes = Math.floor(totalSeconds / 60)
    const seconds = Math.floor(totalSeconds % 60)

    return `${minutes} : ${seconds.toString().padStart(2, '0')}`
  }

  return {
    currentTimeSec: displayedTimeSec,
    durationSec,
    progressPercent,
    formattedCurrentTime: formatTime(displayedTimeSec),
    formattedDuration: formatTime(durationSec),

    handleProgressChange,
    handleProgressCommit,
  }
}