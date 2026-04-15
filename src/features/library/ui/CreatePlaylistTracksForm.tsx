'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/shared/api/client'
import { getBackendImageUrl } from '@/shared/lib/getBackendImageUrl'
import {
  useCreatePlaylistStore,
  type PlaylistTrack,
} from '@/features/library/model/create-playlist.store'
import { CreatePlaylistBottomAction } from './CreatePlaylistBottomAction'
import { CreatePlaylistNextButton } from './CreatePlaylistNextButton'

type TrackItem = PlaylistTrack

type TrackApiArtist = {
  id: string
  name: string
}

type TrackApiItem = {
  id: string
  title: string
  duration: string | null
  status?: string
  mainArtists?: TrackApiArtist[]
  featuredArtists?: TrackApiArtist[]
  album?: {
    cover?: {
      imageId: string
    } | null
  } | null
  cover?: {
    imageId: string
  } | null
}

function normalizeTracksResponse(data: unknown): TrackApiItem[] {
  if (Array.isArray(data)) {
    return data as TrackApiItem[]
  }

  if (data && typeof data === 'object') {
    const record = data as Record<string, unknown>

    if (Array.isArray(record.items)) {
      return record.items as TrackApiItem[]
    }

    if (
      record.tracks &&
      typeof record.tracks === 'object' &&
      Array.isArray((record.tracks as Record<string, unknown>).items)
    ) {
      return (record.tracks as { items: TrackApiItem[] }).items
    }

    if (Array.isArray(record.data)) {
      return record.data as TrackApiItem[]
    }

    if (Array.isArray(record.results)) {
      return record.results as TrackApiItem[]
    }
  }

  return []
}

function getArtistLabel(track: TrackApiItem) {
  const mainArtists = Array.isArray(track.mainArtists) ? track.mainArtists : []
  const featuredArtists = Array.isArray(track.featuredArtists)
    ? track.featuredArtists
    : []

  const names = [...mainArtists, ...featuredArtists]
    .map((artist) => artist.name)
    .filter(Boolean)

  return names.length > 0 ? names.join(', ') : 'Невідомий артист'
}

function getCoverUrl(track: TrackApiItem) {
  return (
    getBackendImageUrl(track.cover?.imageId ?? null) ??
    getBackendImageUrl(track.album?.cover?.imageId ?? null) ??
    null
  )
}

function normalizeDuration(value: string | null | undefined) {
  if (!value) return '00:00'

  if (/^\d{2}:\d{2}$/.test(value) || /^\d{2}:\d{2}:\d{2}$/.test(value)) {
    return value.slice(-5)
  }

  const parts = value.split(':')
  if (parts.length >= 2) {
    const minutes = parts[parts.length - 2]?.padStart(2, '0') ?? '00'
    const secondsRaw = parts[parts.length - 1] ?? '00'
    const seconds = secondsRaw.split('.')[0].padStart(2, '0')
    return `${minutes}:${seconds}`
  }

  return '00:00'
}

async function fetchTracks(): Promise<TrackItem[]> {
  const { data } = await apiClient.get('/api/v1/tracks')
  const items = normalizeTracksResponse(data)

  return items
    .filter((track) => track.status === 'published')
    .map((track) => ({
      id: track.id,
      title: track.title,
      artist: getArtistLabel(track),
      duration: normalizeDuration(track.duration),
      cover: getCoverUrl(track),
    }))
}
function SearchIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-[18px] w-[18px]"
      aria-hidden="true"
    >
      <path
        d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M21 21L16.65 16.65"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

type TrackRowProps = {
  track: TrackItem
  checked: boolean
  onToggle: () => void
}

function TrackRow({ track, checked, onToggle }: TrackRowProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`flex h-[70px] w-full items-center rounded-[14px] px-[12px] text-left transition-all duration-200 ${
        checked
          ? 'border border-groov-accent bg-groov-surface'
          : 'border border-transparent bg-groov-surface'
      }`}
    >
      <div className="flex h-[16px] w-[16px] shrink-0 items-center justify-center rounded-[5px] bg-groov-bg transition-colors">
        {checked ? (
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="h-[12px] w-[12px] text-groov-accent"
            aria-hidden="true"
          >
            <path
              d="M5 12.5L9.5 17L19 7.5"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ) : null}
      </div>

      <div className="ml-[12px] h-[50px] w-[50px] shrink-0 overflow-hidden rounded-[8px] bg-groov-bg">
        {track.cover ? (
          <img
            src={track.cover}
            alt={track.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-[10px] text-groov-muted">
            No image
          </div>
        )}
      </div>

      <div className="ml-[12px] min-w-0 flex-1">
        <div className="truncate text-[14px] leading-[17px] text-groov-accent">
          {track.title}
        </div>

        <div className="mt-[6px] truncate text-[12px] leading-[14px] text-groov-accent/80">
          {track.artist}
        </div>
      </div>

      <div className="ml-[10px] shrink-0 text-[14px] leading-[17px] text-groov-accent">
        {track.duration}
      </div>
    </button>
  )
}

export function CreatePlaylistTracksForm() {
  const router = useRouter()
  const savedTracks = useCreatePlaylistStore((state) => state.tracks)
  const setTracks = useCreatePlaylistStore((state) => state.setTracks)

  const [query, setQuery] = useState('')
  const [visibleCount, setVisibleCount] = useState(8)
  const [selectedIds, setSelectedIds] = useState<string[]>(
    savedTracks.map((track) => track.id)
  )

  const { data: allTracks = [], isLoading, isError } = useQuery({
    queryKey: ['create-playlist-tracks'],
    queryFn: fetchTracks,
    staleTime: 30_000,
  })

  useEffect(() => {
    setVisibleCount(8)
  }, [query])

  const filteredTracks = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()

    if (!normalizedQuery) return allTracks

    return allTracks.filter(
      (track) =>
        track.title.toLowerCase().includes(normalizedQuery) ||
        track.artist.toLowerCase().includes(normalizedQuery)
    )
  }, [allTracks, query])

  const visibleTracks = filteredTracks.slice(0, visibleCount)

  const selectedTracks = useMemo(
    () => allTracks.filter((track) => selectedIds.includes(track.id)),
    [allTracks, selectedIds]
  )

  const toggleTrack = (trackId: string) => {
    setSelectedIds((prev) =>
      prev.includes(trackId)
        ? prev.filter((id) => id !== trackId)
        : [...prev, trackId]
    )
  }

  const hasSelectedTracks = selectedIds.length > 0

  const handleNext = (
    event?: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>,
  ) => {
    event?.preventDefault()

    setTracks(selectedTracks)
    router.push('/library/create-playlist/visibility')
  }

  return (
    <>
      <div className="mt-[25px]">
        <h1 className="text-[24px] font-semibold leading-[24px] text-groov-accent">
          Додайте треки
        </h1>

        <p className="mt-[10px] max-w-[360px] text-[16px] leading-[18px] text-groov-accent">
          Виберіть треки, які будуть у вашому плейлісті. Можна додати будь-яку
          кількість.
        </p>
      </div>

      <div className="mt-[18px]">
        <label className="relative block">
          <span className="pointer-events-none absolute left-[14px] top-1/2 -translate-y-1/2 text-groov-accent">
            <SearchIcon />
          </span>

          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Пошук треків за назвою, артистом..."
            className="h-[40px] w-full rounded-[12px] bg-groov-surface pl-[42px] pr-[14px] text-[16px] leading-[17px] text-groov-accent outline-none placeholder:text-groov-accent"
          />
        </label>
      </div>

      {isLoading ? (
        <div className="mt-[18px] text-[15px] text-groov-accent">
          Завантаження треків...
        </div>
      ) : isError ? (
        <div className="mt-[18px] text-[15px] text-groov-accent">
          Не вдалося завантажити треки
        </div>
      ) : (
        <>
          <div className="mt-[14px] space-y-[8px]">
            {visibleTracks.map((track) => (
              <TrackRow
                key={track.id}
                track={track}
                checked={selectedIds.includes(track.id)}
                onToggle={() => toggleTrack(track.id)}
              />
            ))}
          </div>

          <div className="h-[24px]" />

          {visibleCount < filteredTracks.length && (
            <button
              type="button"
              onClick={() => setVisibleCount((prev) => prev + 8)}
              className="w-full text-center text-[16px] leading-[19px] text-groov-accent transition-opacity active:opacity-70"
            >
              Завантажити ще
            </button>
          )}
        </>
      )}

      <CreatePlaylistBottomAction
        mode="sticky"
        className="pt-[24px]"
        bottomOffset={40}
      >
        <CreatePlaylistNextButton
          href="/library/create-playlist/visibility"
          disabled={!hasSelectedTracks}
          onClick={handleNext}
        />
      </CreatePlaylistBottomAction>
    </>
  )
}