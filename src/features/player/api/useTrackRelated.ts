'use client'

import { useQuery } from '@tanstack/react-query'
import type { TrackDetailsResponse } from '@/shared/api/tracks'
import {
  getAlbumDetails,
  getAllArtists,
  getAllSharedTracks,
} from '@/features/player/api/player-related.api'
import type {
  RelatedAlbumCard,
  RelatedArtistCard,
  RelatedTrackCard,
  TrackRelatedData,
} from '@/features/player/model/player-related.types'

type Params = {
  currentTrackId: string | null
  currentTrackDetails: TrackDetailsResponse | null | undefined
}

function getYearLabel(value: string | null) {
  if (!value) {
    return 'Рік невідомий'
  }

  const year = new Date(value).getFullYear()

  return Number.isNaN(year) ? 'Рік невідомий' : String(year)
}

function getAlbumTypeLabel(type: string | null | undefined) {
  if (!type) {
    return 'Альбом'
  }

  const normalized = type.toLowerCase()

  if (normalized.includes('single')) {
    return 'Сингл'
  }

  if (normalized.includes('ep')) {
    return 'EP'
  }

  return 'Альбом'
}

export function useTrackRelated({ currentTrackId, currentTrackDetails }: Params) {
  return useQuery({
    queryKey: [
      'track-related',
      currentTrackId,
      currentTrackDetails?.mainArtists?.map((artist) => artist.id).join(','),
      currentTrackDetails?.genres?.map((genre) => genre.id).join(','),
    ],
    enabled: Boolean(currentTrackId && currentTrackDetails),
    staleTime: 60_000,
    queryFn: async (): Promise<TrackRelatedData> => {
      const details = currentTrackDetails
      if (!currentTrackId || !details) {
        return {
          genreTracks: [],
          albumsByArtist: [],
          relatedArtists: [],
        }
      }

      const currentGenreIds = details.genres.map((genre) => genre.id)
      const currentMainArtistIds = details.mainArtists.map((artist) => artist.id)
      const primaryArtistId = currentMainArtistIds[0] ?? null

      const [sharedTracks, artists] = await Promise.all([
        getAllSharedTracks(),
        getAllArtists(),
      ])

      const artistById = new Map(artists.map((artist) => [artist.id, artist]))

      const genreTracksRaw = sharedTracks.filter((track) => {
        if (track.id === currentTrackId) {
          return false
        }

        return track.genreIds.some((genreId) => currentGenreIds.includes(genreId))
      })

      const genreTracks: RelatedTrackCard[] = genreTracksRaw
        .slice(0, 12)
        .map((track) => {
          const artistLabel =
            track.mainArtistIds
              .map((artistId) => artistById.get(artistId)?.name ?? '')
              .filter(Boolean)
              .join(', ') || 'Unknown artist'

          return {
            id: track.id,
            title: track.title,
            artistLabel,
            coverImageId: track.coverImageId,
          }
        })

      const relatedArtistIds = Array.from(
        new Set(
          genreTracksRaw.flatMap((track) =>
            track.mainArtistIds.filter(
              (artistId) => !currentMainArtistIds.includes(artistId)
            )
          )
        )
      )

      const relatedArtists: RelatedArtistCard[] = relatedArtistIds
        .map((artistId) => artistById.get(artistId))
        .filter((artist): artist is NonNullable<typeof artist> => Boolean(artist))
        .slice(0, 12)
        .map((artist) => ({
          id: artist.id,
          name: artist.name,
          subtitle: 'Виконавець',
          avatarImageId: artist.avatar,
        }))

      let albumsByArtist: RelatedAlbumCard[] = []

      if (primaryArtistId) {
        const sameArtistAlbumIds = Array.from(
          new Set(
            sharedTracks
              .filter((track) => track.mainArtistIds.includes(primaryArtistId))
              .map((track) => track.albumId)
              .filter((albumId): albumId is string => Boolean(albumId))
          )
        ).slice(0, 10)

        const albums = await Promise.all(
          sameArtistAlbumIds.map((albumId) => getAlbumDetails(albumId))
        )

        albumsByArtist = albums
          .sort((a, b) => {
            const aTime = a.releaseDate ? new Date(a.releaseDate).getTime() : 0
            const bTime = b.releaseDate ? new Date(b.releaseDate).getTime() : 0
            return bTime - aTime
          })
          .map((album) => ({
            id: album.id,
            title: album.title,
            yearLabel: getYearLabel(album.releaseDate),
            typeLabel: getAlbumTypeLabel(album.type),
            coverImageId: album.cover?.imageId ?? null,
          }))
      }

      return {
        genreTracks,
        albumsByArtist,
        relatedArtists,
      }
    },
  })
}