'use client'

import { useMemo, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { IconButton } from '@/shared/ui/buttons/IconButton'
import { MoreIcon } from '@/shared/ui/icons/MoreIcon'
import { ChevronDownIcon } from '@/shared/ui/icons/ChevronDownIcon'
import { usePlayerStore } from '@/features/player/model/usePlayerStore'
import { usePlayerControls } from '@/features/player/lib/usePlayerControls'
import { usePlayerProgress } from '@/features/player/lib/usePlayerProgress'
import { useCurrentTrackDetails } from '@/features/player/api/useCurrentTrackDetails'
import { useTrackLyrics } from '@/features/player/api/useTrackLyrics'
import { useTrackRelated } from '@/features/player/api/useTrackRelated'
import type {
  PlayerTab,
  QueueTrackItem,
} from '@/features/player/model/player-screen.types'
import { TrackPlayerLyricsView } from '@/features/player/ui/TrackPlayerLyricsView'
import { TrackPlayerQueueView } from '@/features/player/ui/TrackPlayerQueueView'
import { TrackPlayerMainView } from '@/features/player/ui/TrackPlayerMainView'
import { TrackPlayerRelatedView } from '@/features/player/ui/TrackPlayerRelatedView'

export function TrackPlayerScreen() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const queue = usePlayerStore((state) => state.queue)
  const playback = usePlayerStore((state) => state.playback)

  const queryTrackId = searchParams.get('trackId')

  const currentTrackFromStore = (queue?.currentTrack ?? null) as QueueTrackItem | null
  const queueTracksFromStore = (queue?.tracksInQueue ?? []) as QueueTrackItem[]

  const resolvedTrackId = currentTrackFromStore?.id ?? queryTrackId ?? null

  const { data: currentTrackDetails } = useCurrentTrackDetails(resolvedTrackId)

  const fallbackTrack = useMemo<QueueTrackItem | null>(() => {
    if (currentTrackFromStore) {
      return currentTrackFromStore
    }

    if (!currentTrackDetails) {
      return null
    }

    return {
      id: currentTrackDetails.id,
      title: currentTrackDetails.title,
      mainArtists: currentTrackDetails.mainArtists?.map((artist) => artist.name) ?? [],
      moods: currentTrackDetails.moods?.map((mood) => mood.id) ?? [],
    } as QueueTrackItem
  }, [currentTrackFromStore, currentTrackDetails])

  const currentTrack = fallbackTrack
  const queueTracks =
    queueTracksFromStore.length > 0
      ? queueTracksFromStore
      : currentTrack
        ? [currentTrack]
        : []

  const artistLabel =
    currentTrackDetails?.mainArtists?.length
      ? currentTrackDetails.mainArtists.map((artist) => artist.name).join(', ')
      : currentTrack?.mainArtists?.join(', ') || 'Unknown artist'

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
  const [activeTab, setActiveTab] = useState<PlayerTab>(null)

  const lyrics = useTrackLyrics(currentTrack?.title ?? null)

  const relatedQuery = useTrackRelated({
  currentTrackId: currentTrack?.id ?? null,
  currentTrackDetails,
})

 const relatedData = relatedQuery.data ?? {
  genreTracks: [],
  albumsByArtist: [],
  relatedArtists: [],
}

  const progressPercent =
    durationSec > 0
      ? Math.max(0, Math.min(100, (currentTimeSec / durationSec) * 100))
      : 0

  const currentMoodIds = currentTrack?.moods ?? []

  const nextTracksByMood = useMemo(() => {
    if (!currentTrack) return []

    const withoutCurrent = queueTracks.filter((track) => track.id !== currentTrack.id)

    if (currentMoodIds.length === 0) {
      return withoutCurrent
    }

    const moodMatched = withoutCurrent.filter((track) =>
      track.moods?.some((moodId) => currentMoodIds.includes(moodId))
    )

    if (moodMatched.length > 0) {
      const matchedIds = new Set(moodMatched.map((track) => track.id))
      const rest = withoutCurrent.filter((track) => !matchedIds.has(track.id))
      return [...moodMatched, ...rest]
    }

    return withoutCurrent
  }, [currentMoodIds, currentTrack, queueTracks])

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

  const nextTracksLabel = useMemo(() => {
    const nextCount = nextTracksByMood.length ?? 0
    if (nextCount === 0) return 'Черга порожня'
    if (nextCount === 1) return '1 трек у черзі'
    return `${nextCount} треків у черзі`
  }, [nextTracksByMood])

  const openTrackOptions = (trackId: string) => {
    router.push(`/player/options?trackId=${trackId}`)
  }

  if (!currentTrack && resolvedTrackId) {
    return (
      <div className="flex min-h-[100dvh] items-center justify-center bg-groov-bg px-6 text-center text-groov-accent">
        Завантаження треку...
      </div>
    )
  }

  if (!currentTrack) {
    return (
      <div className="flex min-h-[100dvh] items-center justify-center bg-groov-bg px-6 text-center text-groov-accent">
        Нічого не відтворюється
      </div>
    )
  }

  if (activeTab === 'lyrics') {
    return (
      <TrackPlayerLyricsView
        trackId={currentTrack.id}
        title={currentTrack.title}
        artistLabel={artistLabel}
        lyrics={lyrics}
        contextExternalId={playback?.contextExternalId ?? null}
        onClose={handleClose}
        onOpenOptions={() => openTrackOptions(currentTrack.id)}
        onOpenNext={() => setActiveTab('next')}
        onOpenRelated={() => setActiveTab('related')}
      />
    )
  }

  if (activeTab === 'next') {
    return (
      <TrackPlayerQueueView
        currentTrack={currentTrack}
        playbackContextExternalId={playback?.contextExternalId ?? null}
        tracks={nextTracksByMood}
        onBack={() => setActiveTab(null)}
        onClose={handleClose}
        onOpenOptions={openTrackOptions}
        onOpenLyrics={() => setActiveTab('lyrics')}
        onOpenRelated={() => setActiveTab('related')}
      />
    )
  }

  if (activeTab === 'related') {
    return (
      <TrackPlayerRelatedView
        currentTrack={currentTrack}
        playbackContextExternalId={playback?.contextExternalId ?? null}
        genreTracks={relatedData.genreTracks}
        albumsByArtist={relatedData.albumsByArtist}
        relatedArtists={relatedData.relatedArtists}
artistSectionTitle={artistLabel}
        isLoading={relatedQuery.isLoading}
        onBack={() => setActiveTab(null)}
        onOpenOptions={openTrackOptions}
        onOpenNext={() => setActiveTab('next')}
        onOpenLyrics={() => setActiveTab('lyrics')}
      />
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
          onClick={() => {
            openTrackOptions(currentTrack.id)
          }}
          className="flex h-[24px] w-[24px] items-center justify-center p-0 text-groov-accent"
        >
          <MoreIcon />
        </IconButton>
      </div>

      <TrackPlayerMainView
        title={currentTrack.title}
        artistLabel={artistLabel}
        trackId={currentTrack.id}
        contextExternalId={playback?.contextExternalId ?? null}
        isLiked={isLiked}
        isHeartAnimating={isHeartAnimating}
        currentTimeSec={currentTimeSec}
        durationSec={durationSec}
        formattedCurrentTime={formattedCurrentTime}
        formattedDuration={formattedDuration}
        progressPercent={progressPercent}
        isShuffled={isShuffled}
        repeatMode={repeatMode}
        isDisabled={isDisabled}
        activeTab={activeTab}
        onToggleLike={handleToggleLike}
        onSeek={handleSeek}
        onToggleShuffle={() => {
          void handleToggleShuffle()
        }}
        onPrevious={() => {
          void handlePrevious()
        }}
        onNext={() => {
          void handleNext()
        }}
        onToggleRepeat={() => {
          void handleToggleRepeat()
        }}
        onOpenNext={() => setActiveTab('next')}
        onOpenLyrics={() => setActiveTab('lyrics')}
        onOpenRelated={() => setActiveTab('related')}
        nextTracksLabel={nextTracksLabel}
      />
    </div>
  )
}