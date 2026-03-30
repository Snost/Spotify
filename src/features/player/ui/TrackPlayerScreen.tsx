'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { PlayerTrack } from '@/features/player/model/types'
import { usePlayerStore } from '@/shared/lib/store/playerStore'
import { IconButton } from '@/shared/ui/buttons/IconButton'
import { MoreIcon } from '@/shared/ui/icons/MoreIcon'
import { ShuffleIcon } from '@/shared/ui/icons/ShuffleIcon'
import { NextIcon } from '@/shared/ui/icons/NextIcon'
import { PrevIcon } from '@/shared/ui/icons/PrevIcon'
import { RepeatIcon } from '@/shared/ui/icons/RepeatIcon'
import { HeartIcon } from '@/shared/ui/icons/HeartIcon'
import { ChevronDownIcon } from '@/shared/ui/icons/ChevronDownIcon'
import { TrackPlayToggle } from '@/features/player/ui/TrackPlayToggle'

type Props = {
  track: PlayerTrack
}

function formatTime(totalSeconds: number): string {
  if (!Number.isFinite(totalSeconds) || totalSeconds <= 0) {
    return '0 : 00'
  }

  const minutes = Math.floor(totalSeconds / 60)
  const seconds = Math.floor(totalSeconds % 60)

return `${minutes} : ${seconds.toString().padStart(2, '0')}`}

export function TrackPlayerScreen({ track }: Props) {
  const router = useRouter()
  const progressRef = useRef<HTMLDivElement | null>(null)

  const currentTrack = usePlayerStore((state) => state.currentTrack)
  const isPlaying = usePlayerStore((state) => state.isPlaying)
  const currentTime = usePlayerStore((state) => state.currentTime)
  const storedDuration = usePlayerStore((state) => state.duration)
  const likedTrackIds = usePlayerStore((state) => state.likedTrackIds)

  const setTrack = usePlayerStore((state) => state.setTrack)
  const setCurrentTime = usePlayerStore((state) => state.setCurrentTime)
  const toggleLikedTrack = usePlayerStore((state) => state.toggleLikedTrack)

  const [isHeartAnimating, setIsHeartAnimating] = useState(false)
  const [isClosing, setIsClosing] = useState(false)

  useEffect(() => {
  if (currentTrack?.id !== track.id) {
    setTrack(track)
  }
}, [track, currentTrack?.id, setTrack])

  useEffect(() => {
    if (!isHeartAnimating) return

    const timeout = window.setTimeout(() => {
      setIsHeartAnimating(false)
    }, 220)

    return () => window.clearTimeout(timeout)
  }, [isHeartAnimating])

  const duration = storedDuration || track.durationSeconds || 160
  const safeCurrentTime = Math.min(currentTime, duration)
  const liked = likedTrackIds.includes(track.id)
  const progressPercent =
    duration > 0 ? Math.max(0, Math.min(100, (safeCurrentTime / duration) * 100)) : 0

  const handleToggleLike = () => {
    toggleLikedTrack(track.id)
    setIsHeartAnimating(true)
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

  const handleSeek = (clientX: number) => {
    const element = progressRef.current
    if (!element || duration <= 0) return

    const rect = element.getBoundingClientRect()
    const ratio = (clientX - rect.left) / rect.width
    const nextTime = Math.max(0, Math.min(duration, ratio * duration))

    setCurrentTime(nextTime)
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

<div className=" px-[16px] pt-[24px]">
          <div className="overflow-hidden rounded-[24px]">
        {track.coverUrl ? (
          <Image
            src={track.coverUrl}
            alt={track.title}
            width={370}
            height={370}
            priority
            className="h-[340px] w-full object-cover"
          />
        ) : (
          <div className="flex h-[340px] w-full items-center justify-center bg-groov-surface text-groov-muted">
            No cover
          </div>
        )}
      </div>

      <div className="mt-[20px] flex items-start justify-between">
        <div className="min-w-0">
          <h1 className="max-w-[280px] truncate text-[23px] font-normal leading-[1.15] text-groov-accent">
            {track.title}
          </h1>

          <p className="mt-[10px] max-w-[280px] truncate text-[16px] font-normal leading-[1.2] text-groov-muted">
            {track.artistName}
          </p>
        </div>

        <button
          type="button"
          aria-label={liked ? 'Прибрати з улюблених' : 'Додати в улюблені'}
          onClick={handleToggleLike}
          className="mt-[3px] flex h-[24px] w-[24px] items-center justify-center"
        >
          <HeartIcon
            filled={liked}
            className={[
              'h-[24px] w-[24px] origin-center text-groov-accent transition-all duration-200 ease-out',
              isHeartAnimating ? 'animate-heart-pop' : '',
            ].join(' ')}
          />
        </button>
      </div>

      <div className="mt-[30px]">
        <div
          ref={progressRef}
          role="slider"
          aria-label="Track progress"
          aria-valuemin={0}
          aria-valuemax={duration}
          aria-valuenow={safeCurrentTime}
          tabIndex={0}
          className="relative h-[10px] w-full cursor-pointer"
          onClick={(e) => handleSeek(e.clientX)}
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
          <span className="min-w-[52px] text-left">{formatTime(safeCurrentTime)}</span>
          <span className="min-w-[52px] text-right">{formatTime(duration)}</span>
        </div>
      </div>

      <div className="mt-[40px] flex items-center justify-between px-[1px]">
        <button
          type="button"
          aria-label="Shuffle"
          className="flex h-[24px] w-[24px] items-center justify-center text-groov-accent"
        >
          <ShuffleIcon />
        </button>

        <button
          type="button"
          aria-label="Previous"
          className="flex h-[24px] w-[24px] items-center justify-center text-groov-accent"
        >
          <PrevIcon className="h-[24px] w-[24px]" />
        </button>

     <TrackPlayToggle
  trackId={track.id}
  source="player"
  variant="circle"
  size="lg"
/>

        <button
          type="button"
          aria-label="Next"
          className="flex h-[24px] w-[24px] items-center justify-center text-groov-accent"
        >
          <NextIcon className="h-[24px] w-[24px]" />
        </button>

        <button
          type="button"
          aria-label="Repeat"
          className="flex h-[24px] w-[24px] items-center justify-center text-groov-accent"
        >
          <RepeatIcon className="h-[24px] w-[24px]" />
        </button>
      </div>

<div className="mt-auto pt-[80px] pb-[max(env(safe-area-inset-bottom),16px)]">
             <div className="grid grid-cols-3 text-center text-[18px] font-normal leading-[1.2] text-groov-accent">
          <button type="button" className="pt-[8px] pb-[8px]">
            Далі
          </button>
          <button type="button" className="pt-[8px] pb-[8px]">
            Текст
          </button>
          <button type="button" className="pt-[8px] pb-[8px]">
            Схожі
          </button>
        </div>
      </div>
    </div>

    
  </div>
)}