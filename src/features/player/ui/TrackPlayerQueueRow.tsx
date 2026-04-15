'use client'

import { useRouter } from 'next/navigation'
import { MoreIcon } from '@/shared/ui/icons/MoreIcon'
import type { QueueTrackItem } from '@/features/player/model/player-screen.types'
import { getArtistLabel } from '@/features/player/lib/getArtistLabel'

type Props = {
  track: QueueTrackItem
  isCurrent: boolean
  onOpenOptions: (trackId: string) => void
}

export function TrackPlayerQueueRow({
  track,
  isCurrent,
  onOpenOptions,
}: Props) {
  const router = useRouter()
  const artistLabel = getArtistLabel(track.mainArtists)

  const handleOpenTrack = () => {
    router.push(`/play/${track.id}`)
  }

  return (
    <div
      className={[
        'flex items-center gap-[12px] px-[14px] py-[10px]',
        isCurrent ? 'bg-groov-primary/80' : 'bg-transparent',
      ].join(' ')}
    >
      <button
        type="button"
        onClick={handleOpenTrack}
        className="flex min-w-0 flex-1 items-center gap-[12px] text-left"
        aria-label={`Відкрити трек ${track.title}`}
      >
        <div className="flex h-[50px] w-[50px] shrink-0 items-center justify-center overflow-hidden rounded-[4px] bg-groov-surface text-groov-muted">
          ♪
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate text-[16px] leading-[1.2] text-groov-accent">
            {track.title}
          </p>
          <p className="mt-[6px] truncate text-[14px] leading-[1.2] text-groov-accent/85">
            {artistLabel}
          </p>
        </div>
      </button>

      <button
        type="button"
        onClick={() => onOpenOptions(track.id)}
        className="flex h-[24px] w-[24px] shrink-0 items-center justify-center text-groov-accent"
        aria-label="Опції треку"
      >
        <MoreIcon className="h-[20px] w-[20px]" />
      </button>
    </div>
  )
}