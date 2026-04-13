import { useQuery } from '@tanstack/react-query'
import { getArtists, getMyTracks } from './admin.api'
import type { AdminTrackItem } from './admin.types'
import type { AdminArtist, MyTrack } from './admin.api'

export function useAdminTracks() {
  return useQuery({
    queryKey: ['admin-my-tracks'],
    queryFn: async (): Promise<AdminTrackItem[]> => {
      const [tracksRes, artistsRes] = await Promise.all([
        getMyTracks(),
        getArtists(),
      ])

      console.log('getMyTracks response:', tracksRes)
      console.log('getArtists response:', artistsRes)

      const tracks: MyTrack[] = tracksRes?.tracks?.items ?? []
      const artists: AdminArtist[] = Array.isArray(artistsRes) ? artistsRes : []

      return tracks.map((track) => {
        const mainArtistIds = track.mainArtistIds ?? []

        const mainArtist = artists.find((artist) =>
          mainArtistIds.includes(artist.id)
        )

        return {
          id: track.id,
          title: track.title,
          artist: mainArtist?.name ?? 'Unknown artist',
          status: mapStatus(track.status),
        }
      })
    },
  })
}

function mapStatus(status: string): 'published' | 'pending' {
  if (status === 'ready_to_publish' || status === 'published') {
    return 'published'
  }

  return 'pending'
}