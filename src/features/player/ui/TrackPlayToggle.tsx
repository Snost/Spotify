'use client'

import { usePlayerStore } from '@/features/player/model/usePlayerStore'
import { PlayButtonSurface } from '@/shared/ui/buttons/PlayButtonSurface'
import { PlayIcon } from '@/shared/ui/icons/PlayIcon'
import { PauseIcon } from '@/shared/ui/icons/PauseIcon'

type Variant = 'circle' | 'round'
type Size = 'xs' | 'sm' | 'md' | 'lg'

type Props = {
  trackId: string
  source?: string | null
  variant?: Variant
  size?: Size
  className?: string
}

const iconSizes: Record<Size, string> = {
  xs: 'h-[12px] w-[12px]',
  sm: 'h-[14px] w-[14px]',
  md: 'h-[18px] w-[18px]',
  lg: 'h-[34px] w-[34px]',
}

export function TrackPlayToggle({
  trackId,
  source = null,
  variant = 'circle',
  size = 'md',
  className = '',
}: Props) {
  const currentTrackId = usePlayerStore((state) => state.currentTrackId)
  const isPlaying = usePlayerStore((state) => state.isPlaying)
  const toggle = usePlayerStore((state) => state.toggle)

  const isActive = currentTrackId === trackId && isPlaying

  return (
    <PlayButtonSurface
      onClick={() => toggle({ trackId, source })}
      aria-label={isActive ? 'Пауза' : 'Відтворити'}
      variant={variant}
      size={size}
      className={className}
    >
      {isActive ? (
        <PauseIcon className={iconSizes[size]} />
      ) : (
        <PlayIcon className={iconSizes[size]} />
      )}
    </PlayButtonSurface>
  )
}