'use client'

import { usePlayerStore } from '@/features/player/model/usePlayerStore'
import { MediaCircleButton } from '@/shared/ui/buttons/MediaCircleButton'
import { PlayIcon } from '@/shared/ui/icons/PlayIcon'
import { PauseIcon } from '@/shared/ui/icons/PauseIcon'

type Props = {
  trackId: string
  source?: string | null
  className?: string
}

export function TrackPlayToggle({
  trackId,
  source = null,
  className,
}: Props) {
  const currentTrackId = usePlayerStore((state) => state.currentTrackId)
  const isPlaying = usePlayerStore((state) => state.isPlaying)
  const toggle = usePlayerStore((state) => state.toggle)

  const isActive = currentTrackId === trackId && isPlaying

  return (
    <MediaCircleButton
      type="button"
      onClick={() => toggle({ trackId, source })}
      className={className}
    >
      {isActive ? (
        <PauseIcon className="h-[22px] w-[22px]" />
      ) : (
        <PlayIcon className="h-[22px] w-[22px]" />
      )}
    </MediaCircleButton>
  )
}