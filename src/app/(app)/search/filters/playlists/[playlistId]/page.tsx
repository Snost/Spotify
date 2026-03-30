import { notFound } from 'next/navigation'
import { AppShell } from '@/shared/ui/layout/AppShell'
import { IconButton } from '@/shared/ui/buttons/IconButton'
import { BackButton } from '@/shared/ui/buttons/BackButton'
import { MoreIcon } from '@/shared/ui/icons/MoreIcon'
import { ShareIcon } from '@/shared/ui/icons/ShareIcon'
import { DownloadIcon } from '@/shared/ui/icons/DownloadIcon'
import { ShuffleToggle } from '@/features/player/ui/ShuffleToggle'
import { getPlaylistDetails } from '@/features/search/mock/playlist-details.mock'
import { TrackPlayToggle } from '@/features/player/ui/TrackPlayToggle'

type Props = {
  params: Promise<{ playlistId: string }>
}

export default async function PlaylistDetailsPage({ params }: Props) {
  const { playlistId } = await params
  const playlist = getPlaylistDetails(playlistId)

  if (!playlist) {
    notFound()
  }

  return (
    <AppShell
      mobileMaxWidth={402}
      withDefaultPadding={false}
      contentClassName="pb-0"
    >
      <div className="w-full border-t border-groov-accent/10" />

      <div className="flex items-center gap-3 text-groov-accent">
        <BackButton className="flex h-[26px] w-[26px] items-center justify-center text-groov-accent" />

        <h1 className="line-clamp-1 text-[20px] font-semibold tracking-[-0.01em] text-groov-accent">
          {playlist.title}
        </h1>
      </div>

      <div className="px-4 pb-6">
        <div className="flex flex-col items-center pt-5 text-center">
          <div className="h-[230px] w-[230px] overflow-hidden rounded-[18px]">
            <img
              src={playlist.cover}
              alt={playlist.title}
              className="h-full w-full object-cover"
            />
          </div>

          <h2 className="mt-4 text-[20px] font-semibold text-groov-accent">
            {playlist.title}
          </h2>

          <p className="mt-[8px] w-[340px] text-[15px] leading-[20px] text-groov-accent">
            {playlist.description}
          </p>

          <p className="mt-[10px] text-[15px] leading-[21px] text-groov-accent">
            Плейлист • {playlist.author}
            <br />
            {playlist.year} • {playlist.tracksCount} пісень
          </p>
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
            <TrackPlayToggle trackId={playlist.id} />
          </div>
        </div>

        <div className="mt-[20px] space-y-[12px]">
          {playlist.tracks.map((track) => (
            <div key={track.id} className="flex min-h-[64px] items-center gap-3">
              <div className="h-[48px] w-[48px] shrink-0 overflow-hidden rounded-[8px]">
                <img
                  src={track.image}
                  alt={track.title}
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-[17px] text-groov-accent">
                  {track.title}
                </p>
                <p className="truncate text-[14px] text-groov-accent">
                  {track.artist}
                </p>
              </div>

              <IconButton className="h-[28px] w-[28px]">
                <MoreIcon className="h-[20px] w-[20px]" />
              </IconButton>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  )
}