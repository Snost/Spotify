'use client'

import { useEffect, useRef } from 'react'
import { usePlayerStore } from '@/shared/lib/store/playerStore'

export function TrackPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const currentTrack = usePlayerStore((state) => state.currentTrack)
  const isPlaying = usePlayerStore((state) => state.isPlaying)
  const currentTime = usePlayerStore((state) => state.currentTime)
  const setCurrentTime = usePlayerStore((state) => state.setCurrentTime)
  const setDuration = usePlayerStore((state) => state.setDuration)
  const setPlaying = usePlayerStore((state) => state.setPlaying)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const audioUrl = currentTrack?.audioUrl

    if (!audioUrl) {
      audio.pause()
      audio.removeAttribute('src')
      audio.load()
      return
    }

    if (audio.src !== audioUrl) {
      audio.src = audioUrl
      audio.load()
    }

    if (isPlaying) {
      void audio.play().catch(() => {
        setPlaying(false)
      })
    } else {
      audio.pause()
    }
  }, [currentTrack?.audioUrl, isPlaying, setPlaying])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    if (Math.abs(audio.currentTime - currentTime) > 1) {
      audio.currentTime = currentTime
    }
  }, [currentTime])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const handleLoadedMetadata = () => {
      setDuration(Number.isFinite(audio.duration) ? audio.duration : 0)
    }

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime)
    }

    const handleEnded = () => {
      setPlaying(false)
    }

    audio.addEventListener('loadedmetadata', handleLoadedMetadata)
    audio.addEventListener('timeupdate', handleTimeUpdate)
    audio.addEventListener('ended', handleEnded)

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata)
      audio.removeEventListener('timeupdate', handleTimeUpdate)
      audio.removeEventListener('ended', handleEnded)
    }
  }, [setCurrentTime, setDuration, setPlaying])

  return <audio ref={audioRef} preload="metadata" />
}