'use client'

import Image from 'next/image'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { IconButton } from '@/shared/ui/buttons/IconButton'
import { MoreIcon } from '@/shared/ui/icons/MoreIcon'
import { ShuffleIcon } from '@/shared/ui/icons/ShuffleIcon'
import { NextIcon } from '@/shared/ui/icons/NextIcon'
import { PrevIcon } from '@/shared/ui/icons/PrevIcon'
import { RepeatIcon } from '@/shared/ui/icons/RepeatIcon'
import { HeartIcon } from '@/shared/ui/icons/HeartIcon'
import { ChevronDownIcon } from '@/shared/ui/icons/ChevronDownIcon'
import { TrackPlayToggle } from '@/features/player/ui/TrackPlayToggle'
import { usePlayerStore } from '@/features/player/model/usePlayerStore'
import { usePlayerControls } from '@/features/player/lib/usePlayerControls'
import { usePlayerProgress } from '@/features/player/lib/usePlayerProgress'

export function TrackPlayerScreen() {
  const router = useRouter()

  const queue = usePlayerStore((state) => state.queue)
  const playback = usePlayerStore((state) => state.playback)

  const currentTrack = queue?.currentTrack ?? null

  const {
    isShuffled,
    repeatMode,
    isDisabled,
    handleNext,
    handlePrevious,
    handleToggleShuffle,
    handleToggleRepeat,
  } = usePlayerControls()

  const {
    currentTimeSec,
    durationSec,
    formattedCurrentTime,
    formattedDuration,
    handleProgressChange,
    handleProgressCommit,
  } = usePlayerProgress()

  const [isHeartAnimating, setIsHeartAnimating] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const [isClosing, setIsClosing] = useState(false)

  const progressPercent =
    durationSec > 0
      ? Math.max(0, Math.min(100, (currentTimeSec / durationSec) * 100))
      : 0

  const handleToggleLike = () => {
    setIsLiked((prev) => !prev)
    setIsHeartAnimating(true)

    window.setTimeout(() => {
      setIsHeartAnimating(false)
    }, 220)
  }

  const handleClose = () => {
    if (isClosing) return

    setIsClosing(true)

    window.setTimeout(() => {
      if (window.history.length > 1) {
        router.back()
      } else {
        router.push('/')
      }
    }, 220)
  }

  const handleSeek = async (clientX: number) => {
    if (!durationSec || durationSec <= 0) return

    const element = document.getElementById('track-player-progress')
    if (!element) return

    const rect = element.getBoundingClientRect()
    const ratio = (clientX - rect.left) / rect.width
    const nextTime = Math.max(0, Math.min(durationSec, ratio * durationSec))

    handleProgressChange([nextTime])
    await handleProgressCommit([nextTime])
  }

  if (!currentTrack) {
    return (
      <div className="flex min-h-[100dvh] items-center justify-center bg-groov-bg px-6 text-center text-groov-accent">
        Нічого не відтворюється
      </div>
    )
  }

  return (
    <div
      className={[
        'flex min-h-[100dvh] flex-col overflow-hidden bg-groov-bg text-groov-text',
        isClosing ? 'animate-player-close-fade' : '',
      ].join(' ')}
    >
      <div className="flex items-center justify-between px-[16px] pt-[6px]">
        <IconButton
          aria-label="Закрити плеєр"
          onClick={handleClose}
          className="flex h-[24px] w-[24px] items-center justify-center p-0 text-groov-accent"
        >
          <ChevronDownIcon className="h-[16px] w-[16px]" />
        </IconButton>

        <IconButton
          aria-label="Меню"
          className="flex h-[24px] w-[24px] items-center justify-center p-0 text-groov-accent"
        >
          <MoreIcon />
        </IconButton>
      </div>

      <div className="px-[16px] pt-[24px]">
        <div className="overflow-hidden rounded-[24px]">
          {currentTrack.albumId ? (
            <div className="flex h-[340px] w-full items-center justify-center bg-groov-surface text-groov-muted">
              Album cover
            </div>
          ) : (
            <div className="flex h-[340px] w-full items-center justify-center bg-groov-surface text-groov-muted">
              No cover
            </div>
          )}
        </div>

        <div className="mt-[20px] flex items-start justify-between">
          <div className="min-w-0">
            <h1 className="max-w-[280px] truncate text-[23px] font-normal leading-[1.15] text-groov-accent">
              {currentTrack.title}
            </h1>

            <p className="mt-[10px] max-w-[280px] truncate text-[16px] font-normal leading-[1.2] text-groov-muted">
              {currentTrack.mainArtists?.join(', ') || 'Unknown artist'}
            </p>
          </div>

          <button
            type="button"
            aria-label={isLiked ? 'Прибрати з улюблених' : 'Додати в улюблені'}
            onClick={handleToggleLike}
            className="mt-[3px] flex h-[24px] w-[24px] items-center justify-center"
          >
            <HeartIcon
              filled={isLiked}
              className={[
                'h-[24px] w-[24px] origin-center text-groov-accent transition-all duration-200 ease-out',
                isHeartAnimating ? 'animate-heart-pop' : '',
              ].join(' ')}
            />
          </button>
        </div>

        <div className="mt-[30px]">
          <div
            id="track-player-progress"
            role="slider"
            aria-label="Track progress"
            aria-valuemin={0}
            aria-valuemax={durationSec}
            aria-valuenow={currentTimeSec}
            tabIndex={0}
            className="relative h-[10px] w-full cursor-pointer"
            onClick={(e) => {
              void handleSeek(e.clientX)
            }}
          >
            <div className="absolute top-1/2 h-[4px] w-full -translate-y-1/2 rounded-full bg-groov-primary/70" />
            <div
              className="absolute top-1/2 h-[4px] -translate-y-1/2 rounded-full bg-groov-secondary"
              style={{ width: `${progressPercent}%` }}
            />
            <div
              className="absolute top-1/2 h-[7px] w-[7px] -translate-y-1/2 rounded-full bg-groov-secondary"
              style={{ left: `calc(${progressPercent}% - 3.5px)` }}
            />
          </div>

          <div className="mt-[20px] flex items-center justify-between text-[16px] font-normal leading-none text-groov-accent">
            <span className="min-w-[52px] text-left">{formattedCurrentTime}</span>
            <span className="min-w-[52px] text-right">{formattedDuration}</span>
          </div>
        </div>

        <div className="mt-[40px] flex items-center justify-between px-[1px]">
          <button
            type="button"
            aria-label="Shuffle"
            onClick={() => {
              void handleToggleShuffle()
            }}
            disabled={isDisabled}
            className={[
              'flex h-[24px] w-[24px] items-center justify-center text-groov-accent',
              isShuffled ? 'opacity-100' : 'opacity-60',
              isDisabled ? 'pointer-events-none opacity-40' : '',
            ].join(' ')}
          >
            <ShuffleIcon />
          </button>

          <button
            type="button"
            aria-label="Previous"
            onClick={() => {
              void handlePrevious()
            }}
            disabled={isDisabled}
            className={[
              'flex h-[24px] w-[24px] items-center justify-center text-groov-accent',
              isDisabled ? 'pointer-events-none opacity-40' : '',
            ].join(' ')}
          >
            <PrevIcon className="h-[24px] w-[24px]" />
          </button>

          <TrackPlayToggle
            trackId={currentTrack.id}
            source="player"
            contextExternalId={playback?.contextExternalId ?? null}
            variant="circle"
            size="lg"
          />

          <button
            type="button"
            aria-label="Next"
            onClick={() => {
              void handleNext()
            }}
            disabled={isDisabled}
            className={[
              'flex h-[24px] w-[24px] items-center justify-center text-groov-accent',
              isDisabled ? 'pointer-events-none opacity-40' : '',
            ].join(' ')}
          >
            <NextIcon className="h-[24px] w-[24px]" />
          </button>

          <button
            type="button"
            aria-label="Repeat"
            onClick={() => {
              void handleToggleRepeat()
            }}
            disabled={isDisabled}
            className={[
              'flex h-[24px] w-[24px] items-center justify-center text-groov-accent',
              repeatMode !== 'Off' ? 'opacity-100' : 'opacity-60',
              isDisabled ? 'pointer-events-none opacity-40' : '',
            ].join(' ')}
          >
            <RepeatIcon className="h-[24px] w-[24px]" />
          </button>
        </div>

        <div className="mt-auto pb-[max(env(safe-area-inset-bottom),16px)] pt-[80px]">
          <div className="grid grid-cols-3 text-center text-[18px] font-normal leading-[1.2] text-groov-accent">
            <button type="button" className="pb-[8px] pt-[8px]">
              Далі
            </button>
            <button type="button" className="pb-[8px] pt-[8px]">
              Текст
            </button>
            <button type="button" className="pb-[8px] pt-[8px]">
              Схожі
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}