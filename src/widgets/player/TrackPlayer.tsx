'use client'

import { useEffect, useRef, useState } from 'react'
import { useDashAudio } from './useDashAudio'
import { usePlayerStore } from '@/features/player/model/usePlayerStore'

export function TrackPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const currentSource = usePlayerStore((state) => state.currentSource)
  const isPlaying = usePlayerStore((state) => state.isPlaying)
  const volume = usePlayerStore((state) => state.volume)
  const progress = usePlayerStore((state) => state.progress)

  const setProgress = usePlayerStore((state) => state.setProgress)
  const setDuration = usePlayerStore((state) => state.setDuration)
  const pause = usePlayerStore((state) => state.pause)

  const [shouldUseHls, setShouldUseHls] = useState(false)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)

    const ua = navigator.userAgent.toLowerCase()
    const isApple = /iphone|ipad|ipod|macintosh/.test(ua)
    setShouldUseHls(isApple)
  }, [])

  const isDashSource = currentSource?.endsWith('.mpd') ?? false
  const isHlsSource = currentSource?.endsWith('.m3u8') ?? false

  useDashAudio(
    audioRef.current,
    isClient && !shouldUseHls && isDashSource ? currentSource : null
  )

  useEffect(() => {
    if (!isClient) return

    const audio = audioRef.current
    if (!audio) return
    if (!currentSource) return

    let cleanup: undefined | (() => void)

    const run = async () => {
      if (isDashSource && !shouldUseHls) return

      audio.pause()
      audio.removeAttribute('src')
      audio.load()

      if (isHlsSource) {
        if (shouldUseHls && audio.canPlayType('application/vnd.apple.mpegurl')) {
          audio.src = currentSource
          return
        }

        const mod = await import('hls.js')
        const Hls = mod.default

        if (Hls.isSupported()) {
          const hls = new Hls()
          hls.loadSource(currentSource)
          hls.attachMedia(audio)
          cleanup = () => hls.destroy()
          return
        }

        audio.src = currentSource
        return
      }

      if (!isDashSource) {
        audio.src = currentSource
      }
    }

    void run()

    return () => {
      cleanup?.()
    }
  }, [currentSource, isHlsSource, isDashSource, shouldUseHls, isClient])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    audio.volume = volume / 100
  }, [volume])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    if (!currentSource) return

    if (isPlaying) {
      void audio.play().catch(() => {})
    } else {
      audio.pause()
    }
  }, [isPlaying, currentSource])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const handleTimeUpdate = () => {
      setProgress(audio.currentTime)
    }

    const handleLoadedMetadata = () => {
      setDuration(audio.duration || 0)
    }

    const handleEnded = () => {
      pause()
      setProgress(0)
    }

    audio.addEventListener('timeupdate', handleTimeUpdate)
    audio.addEventListener('loadedmetadata', handleLoadedMetadata)
    audio.addEventListener('ended', handleEnded)

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate)
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata)
      audio.removeEventListener('ended', handleEnded)
    }
  }, [pause, setDuration, setProgress])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const diff = Math.abs(audio.currentTime - progress)
    if (diff > 1) {
      audio.currentTime = progress
    }
  }, [progress])

  if (!isClient) return null

  return <audio ref={audioRef} preload="metadata" />
}