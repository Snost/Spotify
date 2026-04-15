import { getAlbum } from '@/shared/api/albums'
import { getBackendImageUrl } from '@/shared/lib/getBackendImageUrl'

export type AlbumTrackViewModel = {
  id: string
  position: number
  title: string
  duration: string | null
  artist: string
  image: string | null
  albumId: string | null
  containsExplicitContent: boolean
}

export type AlbumDetailsViewModel = {
  id: string
  title: string
  description: string
  author: string
  year: string
  tracksCount: number
  cover: string | null
  tracks: AlbumTrackViewModel[]
}

function formatReleaseDate(value: string | null) {
  if (!value) {
    return 'Невідомо'
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return 'Невідомо'
  }

  return date.toLocaleDateString('uk-UA', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export async function getAlbumWithTracks(
  albumId: string
): Promise<AlbumDetailsViewModel> {
  const album = await getAlbum(albumId)

  const artistLabel =
    album.mainArtists.length > 0
      ? album.mainArtists.map((artist) => artist.name).join(', ')
      : 'Unknown artist'

  const cover = getBackendImageUrl(album.cover?.imageId ?? null)

  const tracks: AlbumTrackViewModel[] = [...album.tracks]
    .sort((a, b) => a.position - b.position)
    .map((track) => ({
      id: track.id,
      position: track.position,
      title: track.title,
      duration: track.duration,
      artist: artistLabel,
      image: cover,
      albumId: album.id,
      containsExplicitContent: track.containsExplicitContent,
    }))

  return {
    id: album.id,
    title: album.title,
    description: `${album.type || 'Album'} • ${artistLabel}`,
    author: artistLabel,
    year: `Альбом · ${formatReleaseDate(album.releaseDate)}`,
    tracksCount: tracks.length,
    cover,
    tracks,
  }
}