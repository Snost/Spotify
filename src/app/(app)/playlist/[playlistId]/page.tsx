'use client'

import { useParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { AppShell } from '@/shared/ui/layout/AppShell'
import { CollectionDetailsScreen } from '@/features/collection/ui/CollectionDetailsScreen'
import { getPlaylistWithTracks } from '@/features/playlist/api/getPlaylistWithTracks'

export default function PlaylistDetailsPage() {
  const params = useParams<{ playlistId: string }>()
  const playlistId = params?.playlistId

  const {
    data: playlist,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['playlist-details', playlistId],
    queryFn: () => getPlaylistWithTracks(playlistId as string),
    enabled: Boolean(playlistId),
    staleTime: 30_000,
    retry: false,
  })

  if (isLoading) {
    return (
      <AppShell
        mobileMaxWidth={402}
        withDefaultPadding={false}
        contentClassName="pb-0"
      >
        <div className="flex min-h-[70vh] items-center justify-center px-6 text-center text-groov-accent">
          <p className="text-[18px] font-medium leading-[120%]">
            Завантаження плейліста...
          </p>
        </div>
      </AppShell>
    )
  }

  if (isError || !playlist) {
    return (
      <AppShell
        mobileMaxWidth={402}
        withDefaultPadding={false}
        contentClassName="pb-0"
      >
        <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center text-groov-accent">
          <h1 className="text-[22px] font-semibold leading-[120%]">
            Плейліст недоступний
          </h1>

          <p className="mt-3 max-w-[280px] text-[15px] leading-[140%] text-groov-muted">
            Не вдалося завантажити дані плейліста.
          </p>
        </div>
      </AppShell>
    )
  }

  return (
    <AppShell
      mobileMaxWidth={402}
      withDefaultPadding={false}
      contentClassName="pb-0"
    >
      <CollectionDetailsScreen data={playlist} source="playlist" />
    </AppShell>
  )
}