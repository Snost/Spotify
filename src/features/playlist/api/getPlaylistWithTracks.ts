import { getPlaylist } from '@/shared/api/playlists'
import { getTrackDetails } from '@/shared/api/tracks'
import { getImageAssetDetails } from '@/shared/api/images'
import { getBackendImageUrl } from '@/shared/lib/getBackendImageUrl'

export type PlaylistTrackViewModel = {
  id: string
  position: number
  title: string
  duration: string | null
  artist: string
  image: string | null
  albumId: string | null
  containsExplicitContent: boolean
}

export type PlaylistDetailsViewModel = {
  id: string
  title: string
  description: string
  author: string
  year: string
  tracksCount: number
  cover: string | null
  tracks: PlaylistTrackViewModel[]
}

function getYearLabel() {
  return String(new Date().getFullYear())
}

async function resolveImageUrl(imageId?: string | null) {
  if (!imageId) {
    return null
  }

  try {
    const image = await getImageAssetDetails(imageId)
    const maybeWebpUrl = (image as { webpUrl?: string | null }).webpUrl

    if (maybeWebpUrl) {
      return maybeWebpUrl
    }
  } catch {
    // fallback нижче
  }

  return getBackendImageUrl(imageId)
}

export async function getPlaylistWithTracks(
  playlistId: string,
): Promise<PlaylistDetailsViewModel> {
  const playlist = await getPlaylist(playlistId)

  const sortedTrackRefs = [...playlist.tracks].sort(
    (a, b) => a.position - b.position,
  )

  const trackDetails = await Promise.all(
    sortedTrackRefs.map((trackRef) => getTrackDetails(trackRef.id)),
  )

  const coverImageId =
    playlist.customCoverImageId?.imageId ??
    playlist.generatedCoverImageIds?.[0] ??
    null

  const cover = await resolveImageUrl(coverImageId)

  const tracks: PlaylistTrackViewModel[] = sortedTrackRefs.map(
    (trackRef, index) => {
      const track = trackDetails[index]

      return {
        id: track.id,
        position: trackRef.position,
        title: track.title,
        duration: track.duration,
        artist:
          track.mainArtists.length > 0
            ? track.mainArtists.map((artist) => artist.name).join(', ')
            : 'Невідомий артист',
        image: null,
        albumId: track.albumId,
        containsExplicitContent: track.containsExplicitContent,
      }
    },
  )

  return {
    id: playlist.id,
    title: playlist.name,
    description: playlist.description?.trim() || 'Без опису',
    author: 'GROOV',
    year: getYearLabel(),
    tracksCount: tracks.length,
    cover,
    tracks,
  }
}