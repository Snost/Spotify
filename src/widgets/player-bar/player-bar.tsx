'use client'

import { usePlayerStore } from '@/features/player/model/usePlayerStore'
import { MediaCircleButton } from '@/shared/ui/buttons/MediaCircleButton'
import { PlayIcon } from '@/shared/ui/icons/PlayIcon'
import { PauseIcon } from '@/shared/ui/icons/PauseIcon'

export function PlayerBar() {
  const currentTrackId = usePlayerStore((state) => state.currentTrackId)
  const currentSource = usePlayerStore((state) => state.currentSource)
  const isPlaying = usePlayerStore((state) => state.isPlaying)
  const play = usePlayerStore((state) => state.play)
  const pause = usePlayerStore((state) => state.pause)

  const hasTrack = Boolean(currentTrackId)

  const handleToggle = () => {
    if (!currentTrackId) return

    if (isPlaying) {
      pause()
      return
    }

    play({
      trackId: currentTrackId,
      source: currentSource,
    })
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-[rgb(var(--border))] bg-[rgb(var(--surface))]">
      <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-4">
        <div className="text-sm">
          <div className="font-medium">
            {hasTrack ? `Track: ${currentTrackId}` : 'Not playing'}
          </div>
          <div className="text-xs text-[rgb(var(--muted))]">
            {hasTrack ? (isPlaying ? 'Playing now' : 'Paused') : 'Select a track'}
          </div>
        </div>

        <MediaCircleButton
          onClick={handleToggle}
          disabled={!hasTrack}
          className={!hasTrack ? 'opacity-50 pointer-events-none' : ''}
        >
          {isPlaying ? (
            <PauseIcon className="h-6 w-6" />
          ) : (
            <PlayIcon className="h-6 w-6" />
          )}
        </MediaCircleButton>
      </div>
    </div>
  )
}