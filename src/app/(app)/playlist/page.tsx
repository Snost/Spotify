'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import { AppShell } from '@/shared/ui/layout/AppShell'
import { AllPlaylistsGridCard } from '@/features/playlist/ui/AllPlaylistsGridCard'
import {
  getPlaylists,
  type PlaylistSummary,
} from '@/shared/api/playlists'
import { useLibraryPlaylistsStore } from '@/features/library/model/useLibraryPlaylistsStore'

type LibraryPlaylistPreview = {
  id: string
  title: string
  subtitle: string
  tracksCount: number
  image: string | null
}

function getImageUrl(imageId?: string | null) {
  if (!imageId) {
    return null
  }

  return `${process.env.NEXT_PUBLIC_API_BASE}/api/v1/media/images/${imageId}`
}

function normalizePlaylistsResponse(data: unknown): PlaylistSummary[] {
  if (Array.isArray(data)) {
    return data as PlaylistSummary[]
  }

  if (!data || typeof data !== 'object') {
    return []
  }

  const typedData = data as {
    playlists?:
      | PlaylistSummary[]
      | {
          items?: PlaylistSummary[]
        }
  }

  if (Array.isArray(typedData.playlists)) {
    return typedData.playlists
  }

  if (
    typedData.playlists &&
    typeof typedData.playlists === 'object' &&
    Array.isArray(typedData.playlists.items)
  ) {
    return typedData.playlists.items
  }

  return []
}

function getBackendPlaylistImage(playlist: PlaylistSummary) {
  if (playlist.customCoverImageId?.imageId) {
    return getImageUrl(playlist.customCoverImageId.imageId)
  }

  if (playlist.generatedCoverImageIds.length > 0) {
    return getImageUrl(playlist.generatedCoverImageIds[0])
  }

  return null
}

function getPlaylistSubtitle(
  playlist: PlaylistSummary,
  localPreview?: LibraryPlaylistPreview,
) {
  if (localPreview?.subtitle?.trim()) {
    return localPreview.subtitle.trim()
  }

  const description = playlist.description?.trim()
  if (description) {
    return description
  }

  return 'GROOV'
}

function getPlaylistTracksCount(
  _playlist: PlaylistSummary,
  localPreview?: LibraryPlaylistPreview,
) {
  if (typeof localPreview?.tracksCount === 'number') {
    return localPreview.tracksCount
  }

  return 0
}

export default function PlaylistsPage() {
  const router = useRouter()
  const [playlists, setPlaylists] = useState<PlaylistSummary[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const localPlaylists = useLibraryPlaylistsStore((state) => state.playlists)

  useEffect(() => {
    let isMounted = true

    async function load() {
      try {
        const response = await getPlaylists({
          page: 1,
          pageSize: 100,
        })

        if (!isMounted) {
          return
        }

        setPlaylists(normalizePlaylistsResponse(response))
      } catch (error) {
        console.error('Failed to load playlists', error)

        if (!isMounted) {
          return
        }

        setPlaylists([])
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    load()

    return () => {
      isMounted = false
    }
  }, [])

  const mergedPlaylists = useMemo(() => {
    return playlists.map((playlist) => {
      const localPreview = localPlaylists.find(
        (item) => item.id === playlist.id,
      )

      return {
        id: playlist.id,
        title: playlist.name,
        subtitle: getPlaylistSubtitle(playlist, localPreview),
        tracksCount: getPlaylistTracksCount(playlist, localPreview),
        image: getBackendPlaylistImage(playlist) || localPreview?.image || null,
      }
    })
  }, [playlists, localPlaylists])

  const handleBack = () => {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back()
      return
    }

    router.push('/home')
  }

  return (
    <AppShell withSafeAreaTop withSafeAreaBottom>
      <div className="w-full pb-[24px]">
        <div className="flex h-[64px] w-full items-center gap-[12px] bg-groov-surface px-[16px]">
          <button
            type="button"
            onClick={handleBack}
            className="flex h-[24px] w-[24px] items-center justify-center text-groov-accent"
            aria-label="Назад"
          >
            ←
          </button>

          <h1 className="text-[20px] font-semibold leading-[24px] text-groov-accent">
            Плейлісти
          </h1>
        </div>

        <div className="px-[12px] pt-[16px]">
          {isLoading ? (
            <div className="grid grid-cols-2 gap-x-[8px] gap-y-[10px]">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="overflow-hidden rounded-[16px] bg-groov-surface"
                >
                  <div className="h-[138px] w-full bg-groov-primary/40" />
                  <div className="h-[62px] px-[12px] pb-[8px] pt-[8px]">
                    <div className="h-[17px] rounded bg-groov-primary/40" />
                    <div className="mt-[4px] h-[14px] rounded bg-groov-primary/30" />
                    <div className="mt-[2px] h-[14px] w-[72px] rounded bg-groov-primary/30" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-x-[8px] gap-y-[10px]">
              {mergedPlaylists.map((playlist) => (
                <AllPlaylistsGridCard
                  key={playlist.id}
                  id={playlist.id}
                  title={playlist.title}
                  subtitle={playlist.subtitle}
                  tracksCount={playlist.tracksCount}
                  image={playlist.image}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </AppShell>
  )
}