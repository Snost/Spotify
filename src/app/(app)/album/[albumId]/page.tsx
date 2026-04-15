'use client'

import { useParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { AppShell } from '@/shared/ui/layout/AppShell'
import { CollectionDetailsScreen } from '@/features/collection/ui/CollectionDetailsScreen'
import { getAlbumWithTracks } from '@/features/album/model/getAlbumWithTracks'

export default function AlbumDetailsPage() {
  const params = useParams<{ albumId: string }>()
  const albumId = params?.albumId

  const {
    data: album,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['album-details', albumId],
    queryFn: () => getAlbumWithTracks(albumId as string),
    enabled: Boolean(albumId),
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
            Завантаження альбому...
          </p>
        </div>
      </AppShell>
    )
  }

  if (isError || !album) {
    return (
      <AppShell
        mobileMaxWidth={402}
        withDefaultPadding={false}
        contentClassName="pb-0"
      >
        <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center text-groov-accent">
          <h1 className="text-[22px] font-semibold leading-[120%]">
            Альбом недоступний
          </h1>

          <p className="mt-3 max-w-[280px] text-[15px] leading-[140%] text-groov-muted">
            Не вдалося завантажити дані альбому.
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
      <CollectionDetailsScreen data={album} source="album" />
    </AppShell>
  )
}