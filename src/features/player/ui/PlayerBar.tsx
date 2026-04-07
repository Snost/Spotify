'use client'

import { MediaCircleButton } from '@/shared/ui/buttons/MediaCircleButton'
import { PlayIcon } from '@/shared/ui/icons/PlayIcon'
import { PauseIcon } from '@/shared/ui/icons/PauseIcon'
import { NextIcon } from '@/shared/ui/icons/NextIcon'
import { PrevIcon } from '@/shared/ui/icons/PrevIcon'
import { ShuffleIcon } from '@/shared/ui/icons/ShuffleIcon'
import { RepeatIcon } from '@/shared/ui/icons/RepeatIcon'
import { usePlayerControls } from '@/features/player/lib/usePlayerControls'
import { usePlayerProgress } from '@/features/player/lib/usePlayerProgress'
import { Slider } from '@/components/ui/slider'

export function PlayerBar() {
  const {
    currentTrack,
    isPlaying,
    isShuffled,
    repeatMode,
    isDisabled,
    canGoNext,
    canGoPrevious,
    handleTogglePlay,
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

  const hasTrack = Boolean(currentTrack)

  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-[rgb(var(--border))] bg-[rgb(var(--surface))]">
      <div className="mx-auto flex min-h-20 max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-medium">
            {hasTrack ? currentTrack?.title : 'Not playing'}
          </div>

          <div className="truncate text-xs text-[rgb(var(--muted))]">
            {hasTrack
              ? isPlaying
                ? 'Playing now'
                : 'Paused'
              : 'Select a track'}
          </div>
        </div>

        <div className="flex min-w-0 max-w-[520px] flex-1 flex-col items-center gap-2">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleToggleShuffle}
              disabled={isDisabled || !hasTrack}
              className={`transition-opacity ${
                isShuffled ? 'opacity-100' : 'opacity-60'
              } ${isDisabled || !hasTrack ? 'pointer-events-none opacity-40' : ''}`}
            >
              <ShuffleIcon className="h-5 w-5" />
            </button>

            <button
              type="button"
              onClick={handlePrevious}
              disabled={isDisabled || !hasTrack || !canGoPrevious}
              className={isDisabled || !hasTrack || !canGoPrevious ? 'pointer-events-none opacity-40' : ''}
            >
              <PrevIcon className="h-5 w-5" />
            </button>

            <MediaCircleButton
              onClick={handleTogglePlay}
              disabled={!hasTrack || isDisabled}
              className={!hasTrack || isDisabled ? 'pointer-events-none opacity-50' : ''}
            >
              {isPlaying ? (
                <PauseIcon className="h-6 w-6" />
              ) : (
                <PlayIcon className="h-6 w-6" />
              )}
            </MediaCircleButton>

            <button
              type="button"
              onClick={handleNext}
              disabled={isDisabled || !hasTrack || !canGoNext}
              className={isDisabled || !hasTrack || !canGoNext ? 'pointer-events-none opacity-40' : ''}
            >
              <NextIcon className="h-5 w-5" />
            </button>

            <button
              type="button"
              onClick={handleToggleRepeat}
              disabled={isDisabled || !hasTrack}
              className={`transition-opacity ${
                repeatMode !== 'Off' ? 'opacity-100' : 'opacity-60'
              } ${isDisabled || !hasTrack ? 'pointer-events-none opacity-40' : ''}`}
            >
              <RepeatIcon className="h-5 w-5" />
            </button>
          </div>

          <div className="flex w-full items-center gap-3">
            <span className="min-w-[52px] text-left text-xs text-[rgb(var(--muted))]">
              {formattedCurrentTime}
            </span>

            <Slider
              value={[currentTimeSec]}
              min={0}
              max={durationSec || 0}
              step={1}
              onValueChange={handleProgressChange}
              onValueCommit={handleProgressCommit}
              disabled={!hasTrack || !durationSec || isDisabled}
              className="flex-1"
            />

            <span className="min-w-[52px] text-right text-xs text-[rgb(var(--muted))]">
              {formattedDuration}
            </span>
          </div>
        </div>

        <div className="flex-1" />
      </div>
    </div>
  )
}