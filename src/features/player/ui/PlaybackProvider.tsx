'use client'

import type { PropsWithChildren } from 'react'
import { useAudioPlayer } from '@/features/player/lib/useAudioPlayer'

export function PlaybackProvider({ children }: PropsWithChildren) {
  const { audioRef } = useAudioPlayer()

  return (
    <>
      {children}
      <audio ref={audioRef} preload="metadata" style={{ display: 'none' }} />
    </>
  )
}