'use client'

import { useMemo, useState } from 'react'
import { IconButton } from '@/shared/ui/buttons/IconButton'
import { MoreIcon } from '@/shared/ui/icons/MoreIcon'
import { ChevronDownIcon } from '@/shared/ui/icons/ChevronDownIcon'
import { TrackPlayerTabBar } from '@/features/player/ui/TrackPlayerTabBar'
import { TrackPlayerQueueMiniPlayer } from '@/features/player/ui/TrackPlayerQueueMiniPlayer'
import { TrackPlayerQueueRow } from '@/features/player/ui/TrackPlayerQueueRow'
import type { QueueTrackItem } from '@/features/player/model/player-screen.types'

const QUEUE_PAGE_SIZE = 4

type Props = {
  currentTrack: QueueTrackItem
  playbackContextExternalId: string | null
  tracks: QueueTrackItem[]
  onBack: () => void
  onClose: () => void
  onOpenOptions: (trackId: string) => void
  onOpenLyrics: () => void
  onOpenRelated: () => void
}

export function TrackPlayerQueueView({
  currentTrack,
  playbackContextExternalId,
  tracks,
  onBack,
  onClose,
  onOpenOptions,
  onOpenLyrics,
  onOpenRelated,
}: Props) {
  const [visibleCount, setVisibleCount] = useState(QUEUE_PAGE_SIZE)

  const visibleTracks = useMemo(() => {
    return tracks.slice(0, visibleCount)
  }, [tracks, visibleCount])

  const hasMoreTracks = visibleTracks.length < tracks.length

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + QUEUE_PAGE_SIZE)
  }

  return (
    <div className="flex min-h-[100dvh] flex-col overflow-hidden bg-groov-bg text-groov-text">
      <div className="flex items-center justify-between px-[16px] pt-[6px]">
        <IconButton
          aria-label="Назад"
          onClick={onBack}
          className="flex h-[24px] w-[24px] items-center justify-center p-0 text-groov-accent"
        >
          <ChevronDownIcon className="h-[16px] w-[16px]" />
        </IconButton>

        <IconButton
          aria-label="Меню"
          onClick={() => onOpenOptions(currentTrack.id)}
          className="flex h-[24px] w-[24px] items-center justify-center p-0 text-groov-accent"
        >
          <MoreIcon />
        </IconButton>
      </div>

      <div className="flex min-h-0 flex-1 flex-col px-[16px] pt-[14px]">
        <TrackPlayerQueueMiniPlayer
          track={currentTrack}
          playbackContextExternalId={playbackContextExternalId}
        />

        <TrackPlayerTabBar
          activeTab="next"
          onNextClick={() => {}}
          onLyricsClick={onOpenLyrics}
          onRelatedClick={onOpenRelated}
        />

        <div className="min-h-0 flex-1 overflow-y-auto pb-[max(env(safe-area-inset-bottom),18px)]">
          <div className="mt-[12px] overflow-hidden rounded-[2px]">
            <TrackPlayerQueueRow
              track={currentTrack}
              isCurrent
              onOpenOptions={onOpenOptions}
            />

            {visibleTracks.map((track) => (
              <TrackPlayerQueueRow
                key={track.id}
                track={track}
                isCurrent={false}
                onOpenOptions={onOpenOptions}
              />
            ))}
          </div>

          {hasMoreTracks ? (
            <button
              type="button"
              onClick={handleLoadMore}
              className="mt-[18px] w-full py-[10px] text-center text-[20px] leading-[1.2] text-groov-accent"
            >
              Завантажити ще
            </button>
          ) : null}
        </div>
      </div>
    </div>
  )
}