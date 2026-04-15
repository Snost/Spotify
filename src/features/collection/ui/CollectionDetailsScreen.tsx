'use client'

import { useRouter } from 'next/navigation'
import { IconButton } from '@/shared/ui/buttons/IconButton'
import { BackButton } from '@/shared/ui/buttons/BackButton'
import { MoreIcon } from '@/shared/ui/icons/MoreIcon'
import { ShareIcon } from '@/shared/ui/icons/ShareIcon'
import { DownloadIcon } from '@/shared/ui/icons/DownloadIcon'
import { ShuffleToggle } from '@/features/player/ui/ShuffleToggle'
import { TrackPlayToggle } from '@/features/player/ui/TrackPlayToggle'

type CollectionTrackItem = {
  id: string
  position: number
  title: string
  duration: string | null
  artist: string
  image: string | null
  albumId: string | null
  containsExplicitContent: boolean
}

type CollectionDetailsData = {
  id: string
  title: string
  description: string
  author: string
  year: string
  tracksCount: number
  cover: string | null
  tracks: CollectionTrackItem[]
}

type Props = {
  data: CollectionDetailsData
  source: 'playlist' | 'album'
}

function formatTracksCount(count: number) {
  return `${count} пісень`
}

export function CollectionDetailsScreen({ data, source }: Props) {
  const router = useRouter()

  return (
    <>
      <div className="flex items-center gap-3 px-4 pt-2 text-groov-accent">
        <BackButton className="flex h-[26px] w-[26px] items-center justify-center text-groov-accent" />

        <h1 className="line-clamp-1 text-[20px] font-semibold tracking-[-0.01em] text-groov-accent">
          {data.title}
        </h1>
      </div>

      <div className="px-4 pb-6">
        <div className="flex flex-col items-center pt-5 text-center">
          <div className="flex h-[230px] w-[230px] items-center justify-center overflow-hidden rounded-[18px] bg-groov-surface">
            {data.cover ? (
              <img
                src={data.cover}
                alt={data.title}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-[14px] text-groov-muted">
                No cover
              </div>
            )}
          </div>

          <h2 className="mt-4 text-[24px] font-semibold text-groov-accent">
            {data.title}
          </h2>

          {source === 'playlist' ? (
            <>
              {!!data.description && (
                <p className="mt-[8px] w-[340px] text-[16px] leading-[20px] text-groov-accent">
                  {data.description}
                </p>
              )}

              <p className="mt-[10px] text-[16px] leading-[21px] text-groov-accent">
                Плейліст • {data.author}
                <br />
                {data.year ? `${data.year} • ` : ''}
                {formatTracksCount(data.tracksCount)}
              </p>
            </>
          ) : (
            <p className="mt-[10px] text-[15px] leading-[21px] text-groov-accent">
              {data.author}
              <br />
              {data.year}
            </p>
          )}
        </div>

        <div className="mt-[22px] flex items-center justify-between text-groov-accent">
          <div className="flex items-center gap-[10px]">
            <IconButton className="h-[28px] w-[28px]">
              <MoreIcon className="h-[20px] w-[20px]" />
            </IconButton>

            <IconButton className="h-[28px] w-[28px]">
              <ShareIcon className="h-[24px] w-[24px]" />
            </IconButton>

            <IconButton className="h-[28px] w-[28px]">
              <DownloadIcon className="h-[24px] w-[24px]" />
            </IconButton>
          </div>

          <div className="flex items-center gap-[10px]">
            <ShuffleToggle />

            <TrackPlayToggle
              trackId={data.tracks[0]?.id ?? ''}
              source={source}
              contextExternalId={data.id}
              variant="round"
              size="md"
              disabled={!data.tracks.length}
            />
          </div>
        </div>

        <div className="mt-[20px] space-y-[12px]">
          {data.tracks.map((track) => (
            <div key={track.id} className="flex min-h-[64px] items-center gap-3">
              <button
                type="button"
                className="flex min-w-0 flex-1 items-center gap-3 text-left"
                onClick={() => router.push(`/play/${track.id}`)}
              >
                <div className="flex h-[48px] w-[48px] shrink-0 items-center justify-center overflow-hidden rounded-[8px] bg-groov-surface">
                  {track.image ? (
                    <img
                      src={track.image}
                      alt={track.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="text-[11px] text-groov-muted">No image</div>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-[17px] text-groov-accent">
                    {track.title}
                  </p>
                  <p className="truncate text-[14px] text-groov-accent">
                    {track.artist}
                  </p>
                </div>
              </button>

              <TrackPlayToggle
                trackId={track.id}
                source={source}
                contextExternalId={data.id}
                size="sm"
              />

              <IconButton className="h-[28px] w-[28px]">
                <MoreIcon className="h-[20px] w-[20px]" />
              </IconButton>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}