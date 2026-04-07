'use client'

import { usePathname } from 'next/navigation'
import { usePlayerStore } from '@/features/player/model/usePlayerStore'
import { PlayerBar } from '@/features/player/ui/PlayerBar'

export function GlobalPlayerBar() {
  const pathname = usePathname()
  const currentTrack = usePlayerStore((state) => state.queue?.currentTrack ?? null)

  if (!currentTrack) {
    return null
  }

  if (pathname === '/player') {
    return null
  }

  return <PlayerBar />
}