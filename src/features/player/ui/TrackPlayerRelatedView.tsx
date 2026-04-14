'use client'

import { useMemo } from 'react'
import { IconButton } from '@/shared/ui/buttons/IconButton'
import { MoreIcon } from '@/shared/ui/icons/MoreIcon'
import { ChevronDownIcon } from '@/shared/ui/icons/ChevronDownIcon'
import { TrackPlayerTabBar } from '@/features/player/ui/TrackPlayerTabBar'
import { TrackPlayerQueueMiniPlayer } from '@/features/player/ui/TrackPlayerQueueMiniPlayer'
import { getMediaImageUrl } from '@/features/player/lib/getMediaImageUrl'
import type { QueueTrackItem } from '@/features/player/model/player-screen.types'
import type {
  RelatedAlbumCard,
  RelatedArtistCard,
  RelatedTrackCard,
} from '@/features/player/model/player-related.types'

const TRACKS_PER_SLIDE = 4

type Props = {
  currentTrack: QueueTrackItem
  playbackContextExternalId: string | null
  genreTracks: RelatedTrackCard[]
  albumsByArtist: RelatedAlbumCard[]
  relatedArtists: RelatedArtistCard[]
  artistSectionTitle: string
  isLoading: boolean
  onBack: () => void
  onOpenOptions: (trackId: string) => void
  onOpenNext: () => void
  onOpenLyrics: () => void
}

function GenreTrackRow({
  track,
  onOpenOptions,
}: {
  track: RelatedTrackCard
  onOpenOptions: (trackId: string) => void
}) {
  const coverUrl = getMediaImageUrl(track.coverImageId)

  return (
    <div className="flex items-center gap-[12px]">
      <div className="flex h-[50px] w-[50px] shrink-0 items-center justify-center overflow-hidden rounded-[6px] bg-groov-surface">
        {coverUrl ? (
          <img
            src={coverUrl}
            alt={track.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <span className="text-groov-muted">♪</span>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-[16px] leading-[1.2] text-groov-accent">
          {track.title}
        </p>
        <p className="mt-[6px] truncate text-[14px] leading-[1.2] text-groov-accent/85">
          {track.artistLabel}
        </p>
      </div>

      <button
        type="button"
        onClick={() => onOpenOptions(track.id)}
        className="flex h-[24px] w-[24px] shrink-0 items-center justify-center text-groov-accent"
        aria-label="Опції треку"
      >
        <MoreIcon className="h-[20px] w-[20px]" />
      </button>
    </div>
  )
}

function AlbumCard({ album }: { album: RelatedAlbumCard }) {
  const coverUrl = getMediaImageUrl(album.coverImageId)

  return (
    <div className="w-[170px] shrink-0 rounded-[18px] bg-groov-surface px-[12px] pb-[14px] pt-[12px]">
      <div className="flex h-[146px] w-full items-center justify-center overflow-hidden rounded-[14px] bg-groov-primary/40">
        {coverUrl ? (
          <img
            src={coverUrl}
            alt={album.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <span className="text-groov-muted">Album cover</span>
        )}
      </div>

      <p className="mt-[12px] line-clamp-2 text-[15px] leading-[1.2] text-groov-accent">
        {album.title}
      </p>

      <p className="mt-[10px] text-[13px] leading-[1.2] text-groov-accent/75">
        {album.typeLabel} · {album.yearLabel}
      </p>
    </div>
  )
}

function ArtistCard({ artist }: { artist: RelatedArtistCard }) {
  const avatarUrl = getMediaImageUrl(artist.avatarImageId)

  return (
    <div className="w-[136px] shrink-0">
      <div className="flex h-[136px] w-[136px] items-center justify-center overflow-hidden rounded-[18px] bg-groov-surface">
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={artist.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <span className="text-groov-muted">Artist</span>
        )}
      </div>

      <p className="mt-[10px] truncate text-[15px] leading-[1.2] text-groov-accent">
        {artist.name}
      </p>

      <p className="mt-[6px] truncate text-[13px] leading-[1.2] text-groov-accent/75">
        {artist.subtitle}
      </p>
    </div>
  )
}

function chunkTracks(tracks: RelatedTrackCard[]) {
  const chunks: RelatedTrackCard[][] = []

  for (let index = 0; index < tracks.length; index += TRACKS_PER_SLIDE) {
    chunks.push(tracks.slice(index, index + TRACKS_PER_SLIDE))
  }

  return chunks
}

export function TrackPlayerRelatedView({
  currentTrack,
  playbackContextExternalId,
  genreTracks,
  albumsByArtist,
  relatedArtists,
  artistSectionTitle,
  isLoading,
  onBack,
  onOpenOptions,
  onOpenNext,
  onOpenLyrics,
}: Props) {
  const trackSlides = useMemo(() => chunkTracks(genreTracks), [genreTracks])

  return (
    <div className="flex h-[100dvh] min-h-[100dvh] flex-col overflow-hidden bg-groov-bg text-groov-text">
      <div className="shrink-0 flex items-center justify-between px-[16px] pt-[6px]">
        <IconButton
          aria-label="Назад"
          onClick={onBack}
          className="flex h-[24px] w-[24px] items-center justify-center p-0 text-groov-accent"
        >
          <ChevronDownIcon className="h-[16px] w-[16px]" />
        </IconButton>

        <IconButton
          aria-label="Меню"
          onClick={() => onOpenOptions(currentTrack.id)}
          className="flex h-[24px] w-[24px] items-center justify-center p-0 text-groov-accent"
        >
          <MoreIcon />
        </IconButton>
      </div>

      <div className="flex min-h-0 flex-1 flex-col px-[16px] pt-[14px]">
        <div className="shrink-0">
          <TrackPlayerQueueMiniPlayer
            track={currentTrack}
            playbackContextExternalId={playbackContextExternalId}
          />

          <TrackPlayerTabBar
            activeTab="related"
            onNextClick={onOpenNext}
            onLyricsClick={onOpenLyrics}
            onRelatedClick={() => {}}
          />
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden overscroll-contain pb-[120px] pt-[14px] [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {isLoading ? (
            <div className="text-[16px] leading-[1.45] text-groov-muted">
              Завантаження...
            </div>
          ) : (
            <>
              <section>
                <h2 className="text-[18px] font-medium leading-[1.2] text-groov-accent">
                  Вам також може сподобатися
                </h2>

                {trackSlides.length > 0 ? (
                  <div className="mt-[18px] overflow-x-auto overflow-y-hidden overscroll-x-contain snap-x snap-mandatory scroll-smooth [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                    <div className="flex w-full gap-0">
                      {trackSlides.map((slide, index) => (
                        <div
                          key={`track-slide-${index}`}
                          className="w-full min-w-full shrink-0 snap-start"
                        >
                          <div className="space-y-[16px]">
                            {slide.map((track) => (
                              <GenreTrackRow
                                key={track.id}
                                track={track}
                                onOpenOptions={onOpenOptions}
                              />
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="mt-[14px] text-[15px] leading-[1.4] text-groov-muted">
                    Схожі треки не знайдені
                  </p>
                )}
              </section>

              <section className="pt-[28px]">
                <div className="flex items-end justify-between gap-[12px]">
                  <h2 className="text-[18px] font-medium leading-[1.2] text-groov-accent">
                    {artistSectionTitle}
                  </h2>

                  <button
                    type="button"
                    className="shrink-0 text-[14px] leading-[1.2] text-groov-accent/75"
                  >
                    Дивитись все
                  </button>
                </div>

                {albumsByArtist.length > 0 ? (
                  <div className="mt-[16px] overflow-x-auto overflow-y-hidden overscroll-x-contain [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                    <div className="flex gap-[12px] pr-[16px]">
                      {albumsByArtist.map((album) => (
                        <AlbumCard key={album.id} album={album} />
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="mt-[14px] text-[15px] leading-[1.4] text-groov-muted">
                    Альбоми не знайдені
                  </p>
                )}
              </section>

              <section className="pt-[28px]">
                <h2 className="text-[18px] font-medium leading-[1.2] text-groov-accent">
                  Схожі виконавці
                </h2>

                {relatedArtists.length > 0 ? (
                  <div className="mt-[16px] overflow-x-auto overflow-y-hidden overscroll-x-contain [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                    <div className="flex gap-[12px] pr-[16px]">
                      {relatedArtists.map((artist) => (
                        <ArtistCard key={artist.id} artist={artist} />
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="mt-[14px] text-[15px] leading-[1.4] text-groov-muted">
                    Схожі виконавці не знайдені
                  </p>
                )}
              </section>
            </>
          )}
        </div>
      </div>
    </div>
  )
}