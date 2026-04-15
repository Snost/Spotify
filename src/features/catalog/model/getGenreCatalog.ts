import { apiClient } from '@/shared/api/client'
import { getAlbums } from '@/shared/api/albums'
import { getPlaylists } from '@/shared/api/playlists'
import { getBackendImageUrl } from '@/shared/lib/getBackendImageUrl'
import { getGenres } from '@/features/admin/api/admin.api'

type SharedTrack = {
  id: string
  title: string
  isExplicit: boolean
  releaseDateUtc: string | null
  coverImageId: string | null
  albumId: string | null
  mainArtistIds: string[]
  featuredArtistIds: string[]
  genreIds: string[]
  moodIds: string[]
}

type AlbumListItem = {
  id: string
  title: string
}

type PlaylistListItem = {
  id: string
  name: string
  description: string | null
  customCoverImageId?: {
    imageId: string
  } | null
  generatedCoverImageIds?: string[]
}

export type CatalogCard = {
  id: string
  title: string
  subtitle: string
  image: string | null
  type: 'track' | 'album' | 'playlist'
}

export type CatalogSection = {
  id: string
  title: string
  items: CatalogCard[]
}

export type GenreCatalog = {
  title: string
  sections: CatalogSection[]
}

const genreSlugAliases: Record<string, string[]> = {
  classic: ['classic', 'classical', 'класика', 'classical music'],
  pop: ['pop', 'поп'],
  rock: ['rock', 'рок'],
  jazz: ['jazz', 'джаз'],
  'hip-hop': ['hip-hop', 'hip hop', 'хіп-хоп', 'хип-хоп'],
  rap: ['rap', 'реп'],
  electronic: ['electronic', 'edm', 'електронна'],
  indie: ['indie', 'інді'],
  'lo-fi': ['lo-fi', 'lofi'],
  romance: ['romance', 'romantic', 'романтика'],
  sleep: ['sleep', 'сон', 'для сну'],
  workout: ['workout', 'training', 'тренування'],
  study: ['study', 'навчання'],
  relax: ['relax', 'relaxing', 'розслаблення'],
  new: ['new', 'нові релізи'],
  metal: ['metal', 'метал'],
  rnb: ['r&b', 'rnb', 'rnb та соул'],
  'ua-pop': ['ua pop', 'ukrainian pop', 'український поп'],
  'ua-rock': ['ua rock', 'ukrainian rock', 'український рок'],
  arabic: ['arabic', 'арабська'],
  african: ['african', 'африканська'],
  blues: ['blues', 'блюз'],
  bollywood: ['bollywood', 'боллівуд'],
  kids: ['kids', 'children', 'діти'],
  focus: ['focus', 'концентрація'],
  sad: ['sad', 'сум'],
  travel: ['travel', 'в дорозі'],
  party: ['party', 'вечірка'],
  happy: ['happy', 'гарний настрій'],
  latin: ['latin', 'латинська'],
  podcasts: ['podcasts', 'подкасти'],
  music: ['music', 'музика'],
  gaming: ['gaming', 'ігри'],
  food: ['food', 'їжа'],
  kpop: ['k-pop', 'kpop'],
  folk: ['folk', 'фолк'],
  soundtracks: ['soundtracks', 'саундтреки'],
}

const ukrainianGenreTitles: Record<string, string> = {
  classic: 'Класика',
  pop: 'Поп',
  rock: 'Рок',
  jazz: 'Джаз',
  'hip-hop': 'Хіп-хоп',
  rap: 'Реп',
  electronic: 'Електроніка',
  indie: 'Інді',
  'lo-fi': 'Lo-fi',
  romance: 'Романтика',
  sleep: 'Для сну',
  workout: 'Тренування',
  study: 'Навчання',
  relax: 'Розслаблення',
  new: 'Новинки',
  metal: 'Метал',
  rnb: 'R&B',
  'ua-pop': 'Український поп',
  'ua-rock': 'Український рок',
  arabic: 'Арабська музика',
  african: 'Африканська музика',
  blues: 'Блюз',
  bollywood: 'Боллівуд',
  kids: 'Дітям',
  focus: 'Концентрація',
  sad: 'Сумний настрій',
  travel: 'В дорозі',
  party: 'Вечірка',
  happy: 'Гарний настрій',
  latin: 'Латинська музика',
  podcasts: 'Подкасти',
  music: 'Музика',
  gaming: 'Ігри',
  food: 'Для їжі',
  kpop: 'K-pop',
  folk: 'Фолк',
  soundtracks: 'Саундтреки',
}

function normalize(value: string) {
  return value.trim().toLowerCase()
}

function humanizeSlug(slug: string) {
  return ukrainianGenreTitles[slug] ?? slug.charAt(0).toUpperCase() + slug.slice(1)
}

function resolveGenreBySlug(
  slug: string,
  genres: Array<{ id: string; name: string }>
) {
  const aliases = genreSlugAliases[slug] ?? [slug]
  const normalizedAliases = aliases.map(normalize)

  return (
    genres.find((genre) => normalizedAliases.includes(normalize(genre.name))) ??
    null
  )
}

async function getSharedTracksSafe(): Promise<SharedTrack[]> {
  try {
    const { data } = await apiClient.get<SharedTrack[]>('/api/v1/shared/tracks')
    return Array.isArray(data) ? data : []
  } catch {
    return []
  }
}

function extractAlbumItems(response: unknown): AlbumListItem[] {
  if (Array.isArray(response)) {
    return response as AlbumListItem[]
  }

  if (
    response &&
    typeof response === 'object' &&
    'albums' in response &&
    response.albums &&
    typeof response.albums === 'object' &&
    'items' in response.albums &&
    Array.isArray(response.albums.items)
  ) {
    return response.albums.items as AlbumListItem[]
  }

  return []
}

function extractPlaylistItems(response: unknown): PlaylistListItem[] {
  if (Array.isArray(response)) {
    return response as PlaylistListItem[]
  }

  if (
    response &&
    typeof response === 'object' &&
    'playlists' in response &&
    response.playlists &&
    typeof response.playlists === 'object' &&
    'items' in response.playlists &&
    Array.isArray(response.playlists.items)
  ) {
    return response.playlists.items as PlaylistListItem[]
  }

  if (
    response &&
    typeof response === 'object' &&
    'playlists' in response &&
    Array.isArray((response as { playlists: unknown[] }).playlists)
  ) {
    return (response as { playlists: PlaylistListItem[] }).playlists
  }

  return []
}

function dedupeCards(items: CatalogCard[]) {
  const seen = new Set<string>()
  return items.filter((item) => {
    const key = `${item.type}-${item.id}`
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}

function cloneForSection(items: CatalogCard[], sectionId: string, take = 6) {
  const source = items.slice(0, take)

  return source.map((item, index) => ({
    ...item,
    id: `${sectionId}-${item.id}-${index}`,
  }))
}

function buildMockLikeSections(
  slug: string,
  genreTitle: string,
  tracks: CatalogCard[],
  albums: CatalogCard[],
  playlists: CatalogCard[]
): CatalogSection[] {
  const safeTracks = tracks.length > 0 ? tracks : []
  const safeAlbums = albums.length > 0 ? albums : safeTracks
  const safePlaylists = playlists.length > 0 ? playlists : safeTracks

  if (slug === 'classic') {
    return [
      {
        id: 'classic-songs',
        title: 'Класичні пісні',
        items: cloneForSection(safeTracks, 'classic-songs', 6),
      },
      {
        id: 'classic-songs-for-you',
        title: 'Класичні пісні для вас',
        items: cloneForSection(safePlaylists, 'classic-songs-for-you', 6),
      },
      {
        id: 'classic-for-you',
        title: 'Класика для вас',
        items: cloneForSection(safeTracks, 'classic-for-you', 6),
      },
      {
        id: 'classic-relax',
        title: 'Класика для розслаблення',
        items: cloneForSection(safePlaylists, 'classic-relax', 6),
      },
      {
        id: 'classic-albums',
        title: 'Альбоми',
        items: cloneForSection(safeAlbums, 'classic-albums', 6),
      },
    ]
  }

  return [
    {
      id: `${slug}-songs`,
      title: `${genreTitle} пісні`,
      items: cloneForSection(safeTracks, `${slug}-songs`, 6),
    },
    {
      id: `${slug}-for-you`,
      title: `${genreTitle} для вас`,
      items: cloneForSection(safePlaylists, `${slug}-for-you`, 6),
    },
    {
      id: `${slug}-relax`,
      title: `${genreTitle} для розслаблення`,
      items: cloneForSection(safeTracks, `${slug}-relax`, 6),
    },
    {
      id: `${slug}-albums`,
      title: 'Альбоми',
      items: cloneForSection(safeAlbums, `${slug}-albums`, 6),
    },
  ]
}

export async function getGenreCatalog(slug: string): Promise<GenreCatalog> {
  const [tracks, genres] = await Promise.all([
    getSharedTracksSafe(),
    getGenres().catch(() => []),
  ])

  const matchedGenre = resolveGenreBySlug(slug, genres)
  const genreId = matchedGenre?.id ?? null
  const title = humanizeSlug(slug)

  if (!genreId) {
    return {
      title,
      sections: [],
    }
  }

  const genreTracks = tracks.filter((track) => track.genreIds.includes(genreId))
  const genreTrackIds = genreTracks.map((track) => track.id)

  const trackItems = dedupeCards(
    genreTracks.map((track) => ({
      id: track.id,
      title: track.title,
      subtitle: 'Track',
      image: getBackendImageUrl(track.coverImageId),
      type: 'track' as const,
    }))
  )

  const [albumsRaw, playlistsRaw] = await Promise.all([
    getAlbums({
      genreIds: [genreId],
      page: 1,
      pageSize: 100,
    }).catch(() => []),
    getPlaylists({
      trackIds: genreTrackIds,
      page: 1,
      pageSize: 100,
    }).catch(() => []),
  ])

  const albumsList = extractAlbumItems(albumsRaw)
  const playlistsList = extractPlaylistItems(playlistsRaw)

  const albumItemsFromApi = dedupeCards(
    albumsList.map((album) => ({
      id: album.id,
      title: album.title,
      subtitle: 'Album',
      image: null,
      type: 'album' as const,
    }))
  )

  const playlistItemsFromApi = dedupeCards(
    playlistsList.map((playlist) => ({
      id: playlist.id,
      title: playlist.name,
      subtitle: playlist.description ?? 'Playlist',
      image: getBackendImageUrl(
        playlist.customCoverImageId?.imageId ??
          playlist.generatedCoverImageIds?.[0] ??
          null
      ),
      type: 'playlist' as const,
    }))
  )

  const fallbackAlbumItems = dedupeCards(
    genreTracks.slice(0, 6).map((track, index) => ({
      id: track.albumId ?? `fallback-album-${track.id}-${index}`,
      title: `${title} Album ${index + 1}`,
      subtitle: 'Demo album',
      image: getBackendImageUrl(track.coverImageId),
      type: 'album' as const,
    }))
  )

  const fallbackPlaylistItems = dedupeCards(
    genreTracks.slice(0, 6).map((track, index) => ({
      id: `fallback-playlist-${track.id}-${index}`,
      title: `${title} Playlist ${index + 1}`,
      subtitle: 'Demo playlist',
      image: getBackendImageUrl(track.coverImageId),
      type: 'playlist' as const,
    }))
  )

  const albumItems =
    albumItemsFromApi.length > 0 ? albumItemsFromApi : fallbackAlbumItems

  const playlistItems =
    playlistItemsFromApi.length > 0 ? playlistItemsFromApi : fallbackPlaylistItems

  const sections = buildMockLikeSections(
    slug,
    title,
    trackItems,
    albumItems,
    playlistItems
  )

  console.log('GENRE DEBUG', {
    slug,
    genreId,
    totalTracks: tracks.length,
    matchedGenreTracks: genreTracks.length,
    genreTrackIds,
    albumListCount: albumsList.length,
    matchedAlbumItems: albumItems.length,
    playlistListCount: playlistsList.length,
    matchedPlaylistItems: playlistItems.length,
  })

  return {
    title,
    sections,
  }
}