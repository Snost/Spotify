'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Hls from 'hls.js'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { useDashAudio } from './useDashAudio'

const TEST_HLS =
  'https://cdn.bitmovin.com/content/assets/art-of-motion-dash-hls-progressive/m3u8s/f08e80da-bf1d-4e3d-8899-f0f6155f6efa-audio-only.m3u8'

// якщо маєш тестовий MPD — встав сюди (або з бекенду буде DASH mpd)
const TEST_DASH =
  'https://dash.akamaized.net/akamai/bbb_30fps/bbb_30fps.mpd'

function isAppleDevice() {
  if (typeof navigator === 'undefined') return false
  const ua = navigator.userAgent.toLowerCase()
  return /iphone|ipad|ipod|macintosh/.test(ua)
}

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

  const shouldUseHls = useMemo(() => {
    // Apple/Safari: немає MediaSource на iOS Safari, тому HLS тільки нативно (без hls.js) :contentReference[oaicite:1]{index=1}
    return isAppleDevice()
  }, [])

  // DASH підключаємо тільки НЕ на Apple
  useDashAudio(audioRef.current, !shouldUseHls ? dashUrl : null)

  // HLS (Apple -> native, інші -> hls.js, але за умовою вчителя: “інші = DASH”)
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    // чистимо попередній src
    audio.removeAttribute('src')
    audio.load()

    if (!shouldUseHls) return // не Apple => DASH (dash.js вже підключився)

    // Apple => native HLS через src (canPlayType)
    // (сам підхід: canPlayType('application/vnd.apple.mpegurl') → src = .m3u8) :contentReference[oaicite:2]{index=2}
    if (audio.canPlayType('application/vnd.apple.mpegurl')) {
      audio.src = hlsUrl
    } else if (Hls.isSupported()) {
      // на випадок macOS Chrome і т.д. (але за умовою у вас “не Apple = DASH”, тому це скоріше fallback)
      const hls = new Hls()
      hls.loadSource(hlsUrl)
      hls.attachMedia(audio)
      return () => hls.destroy()
    }
  }, [hlsUrl, shouldUseHls])

  // гучність — окремо, без перезапуску стріму
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
            <Slider
              value={[volume]}
              min={0}
              max={100}
              step={1}
              onValueChange={([v]) => setVolume(v)}
            />
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
