'use client'

import { TrackPlayToggle } from '@/features/player/ui/TrackPlayToggle'
import type { QueueTrackItem } from '@/features/player/model/player-screen.types'
import { getArtistLabel } from '@/features/player/lib/getArtistLabel'

type Props = {
  track: QueueTrackItem
  playbackContextExternalId: string | null
}

export function TrackPlayerQueueMiniPlayer({
  track,
  playbackContextExternalId,
}: Props) {
  const artistLabel = getArtistLabel(track.mainArtists)

  return (
    <div className="flex items-center justify-between">
      <div className="flex min-w-0 items-center gap-[12px]">
        <div className="flex h-[52px] w-[52px] shrink-0 items-center justify-center overflow-hidden rounded-[4px] bg-groov-surface text-groov-muted">
          ♪
        </div>

        <div className="min-w-0">
          <p className="truncate text-[17px] font-normal leading-[1.2] text-groov-accent">
            {track.title}
          </p>
          <p className="mt-[4px] truncate text-[14px] leading-[1.2] text-groov-muted">
            {artistLabel}
          </p>
        </div>
      </div>

      <div className="ml-[12px] flex items-center gap-[18px]">
        <TrackPlayToggle
          trackId={track.id}
          source="player"
          contextExternalId={playbackContextExternalId}
          variant="circle"
          size="sm"
        />
      </div>
    </div>
  )
}