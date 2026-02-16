'use client'

import { useEffect, useRef } from 'react'
import * as dashjs from 'dashjs'

export function useDashAudio(audio: HTMLAudioElement | null, url: string | null) {
  const playerRef = useRef<any>(null)

  useEffect(() => {
    if (!audio || !url) return

    const player = dashjs.MediaPlayer().create()
    playerRef.current = player

    player.initialize(audio, url, false)

    return () => {
      try {
        player.reset()
      } catch {}
      playerRef.current = null
    }
  }, [audio, url])
}
