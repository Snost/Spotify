'use client'

import { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { useDashAudio } from './useDashAudio'

const TEST_HLS =
  'https://cdn.bitmovin.com/content/assets/art-of-motion-dash-hls-progressive/m3u8s/f08e80da-bf1d-4e3d-8899-f0f6155f6efa-audio-only.m3u8'

const TEST_DASH = 'https://dash.akamaized.net/akamai/bbb_30fps/bbb_30fps.mpd'

export function TrackPlayer({
  hlsUrl = TEST_HLS,
  dashUrl = TEST_DASH,
}: {
  hlsUrl?: string
  dashUrl?: string
}) {
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(80)

  // ✅ визначаємо Apple тільки в браузері (useEffect)
  const [shouldUseHls, setShouldUseHls] = useState(false)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)

    // ✅ тут вже є navigator
    const ua = navigator.userAgent.toLowerCase()
    const isApple = /iphone|ipad|ipod|macintosh/.test(ua)
    setShouldUseHls(isApple)
  }, [])

  // DASH підключаємо тільки НЕ на Apple
  useDashAudio(audioRef.current, isClient && !shouldUseHls ? dashUrl : null)

  // HLS: Apple -> native, інші -> (опційний) fallback через hls.js (динамічний імпорт)
  useEffect(() => {
    if (!isClient) return

    const audio = audioRef.current
    if (!audio) return

    let cleanup: undefined | (() => void)

    const run = async () => {
      // чистимо попередній src
      audio.removeAttribute('src')
      audio.load()

      if (!shouldUseHls) return // не Apple => DASH (dash.js вже підключився)

      // Apple => native HLS
      if (audio.canPlayType('application/vnd.apple.mpegurl')) {
        audio.src = hlsUrl
        return
      }

      // ✅ fallback: dynamic import hls.js
      const mod = await import('hls.js')
      const Hls = mod.default

      if (Hls.isSupported()) {
        const hls = new Hls()
        hls.loadSource(hlsUrl)
        hls.attachMedia(audio)
        cleanup = () => hls.destroy()
      } else {
        // останній fallback
        audio.src = hlsUrl
      }
    }

    run()

    return () => {
      cleanup?.()
    }
  }, [hlsUrl, shouldUseHls, isClient])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    audio.volume = volume / 100
  }, [volume])

  const togglePlay = async () => {
    const audio = audioRef.current
    if (!audio) return

    if (audio.paused) {
      await audio.play()
      setIsPlaying(true)
    } else {
      audio.pause()
      setIsPlaying(false)
    }
  }

  const onSeek = (value: number) => {
    const audio = audioRef.current
    if (!audio) return
    audio.currentTime = value
    setProgress(value)
  }

  // ✅ щоб SSR/prerender не намагався щось рендерити “як плеєр”
  if (!isClient) return null

  return (
    <div className="w-full max-w-xl space-y-4 rounded-lg border bg-neutral-950 p-4 text-white">
      <audio
        ref={audioRef}
        onTimeUpdate={(e) => setProgress(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration || 0)}
      />

      <div className="flex items-center gap-4">
        <Button onClick={togglePlay}>{isPlaying ? 'Pause' : 'Play'}</Button>

        <div className="flex items-center gap-3">
          <span className="w-10 text-right text-xs opacity-70">{volume}%</span>
          <div className="w-40">
            <Slider value={[volume]} min={0} max={100} step={1} onValueChange={([v]) => setVolume(v)} />
          </div>
        </div>

        <span className="text-sm opacity-70">
          {Math.floor(progress)} / {Math.floor(duration)} sec
        </span>
      </div>

      <input
        type="range"
        min={0}
        max={duration || 0}
        step={1}
        value={progress}
        onChange={(e) => onSeek(Number(e.target.value))}
        className="w-full"
      />

      <div className="text-xs opacity-60">
        Mode: {shouldUseHls ? 'HLS (Apple)' : 'DASH (default)'}
      </div>
    </div>
  )
}