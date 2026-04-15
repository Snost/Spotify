import { getAlbum } from '@/shared/api/albums'
import { getPlaylist } from '@/shared/api/playlists'
import { getTrack } from '@/shared/api/tracks'
import { getBackendImageUrl } from '@/shared/lib/getBackendImageUrl'
import type {
  CollectionDetails,
  CollectionTrackItem,
} from '@/features/collection/model/collection-details.types'

type Params = {
  type: 'playlist' | 'album'
  id: string
}

function getYearLabel(value: string | null) {
  if (!value) {
    return '2025'
  }

  const date = new Date(value)
  const year = date.getFullYear()

  return Number.isNaN(year) ? '2025' : String(year)
}

async function buildPlaylistTracks(trackIds: string[]): Promise<CollectionTrackItem[]> {
  const results = await Promise.all(
    trackIds.map(async (trackId): Promise<CollectionTrackItem | null> => {
      try {
        const track = await getTrack(trackId)

        const artist =
          track.mainArtists?.map((item) => item.name).filter(Boolean).join(', ') ||
          'Unknown artist'

        return {
          id: track.id,
          title: track.title,
          artist,
          image: null,
        }
      } catch {
        return null
      }
    })
  )

  return results.filter(
    (item): item is CollectionTrackItem => item !== null
  )
}

export async function getCollectionDetails({
  type,
  id,
}: Params): Promise<CollectionDetails | null> {
  if (type === 'playlist') {
    const playlist = await getPlaylist(id)

    const tracks = await buildPlaylistTracks(
      playlist.tracks
        .slice()
        .sort((a, b) => a.position - b.position)
        .map((item) => item.id)
    )

    return {
      id: playlist.id,
      title: playlist.name,
      description:
        playlist.description ?? 'Добірка, автоматично сформована для прослуховування.',
      author: 'GROOV',
      year: '2025',
      tracksCount: tracks.length,
      cover: getBackendImageUrl(playlist.customCoverImageId?.imageId ?? null),
      tracks,
    }
  }

  const album = await getAlbum(id)

  const artistLabel =
    album.mainArtists?.map((artist) => artist.name).filter(Boolean).join(', ') ||
    'Unknown artist'

  const tracks: CollectionTrackItem[] = album.tracks
    .slice()
    .sort((a, b) => a.position - b.position)
    .map((track) => ({
      id: track.id,
      title: track.title,
      artist: artistLabel,
      image: getBackendImageUrl(album.cover?.imageId ?? null),
    }))

  return {
    id: album.id,
    title: album.title,
    description: `${album.type || 'Album'} • ${artistLabel}`,
    author: artistLabel,
    year: getYearLabel(album.releaseDate),
    tracksCount: tracks.length,
    cover: getBackendImageUrl(album.cover?.imageId ?? null),
    tracks,
  }
}