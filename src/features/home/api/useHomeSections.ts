'use client'

import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/shared/api/client'
import { getBackendImageUrl } from '@/shared/lib/getBackendImageUrl'

export type HomeItem = {
  id: string
  title: string
  subtitle?: string
  image?: string
  contextType?: 'album' | 'playlist'
  contextExternalId?: string | null
}

type HomeSections = {
  recently: HomeItem[]
  forYou: HomeItem[]
  albums: HomeItem[]
}

type AnyRecord = Record<string, unknown>

function isRecord(value: unknown): value is AnyRecord {
  return typeof value === 'object' && value !== null
}

function asArray(value: unknown): unknown[] {
  if (Array.isArray(value)) return value

  if (isRecord(value)) {
    if (Array.isArray(value.items)) return value.items
    if (Array.isArray(value.data)) return value.data
    if (Array.isArray(value.results)) return value.results
    if (Array.isArray(value.value)) return value.value

    if (isRecord(value.playlists) && Array.isArray(value.playlists.items)) {
      return value.playlists.items
    }

    if (isRecord(value.tracks) && Array.isArray(value.tracks.items)) {
      return value.tracks.items
    }

    if (isRecord(value.albums) && Array.isArray(value.albums.items)) {
      return value.albums.items
    }
  }

  return []
}

function pickString(...values: unknown[]): string | undefined {
  for (const value of values) {
    if (typeof value === 'string' && value.trim()) return value
  }
  return undefined
}

function pickImage(value: unknown): string | undefined {
  if (typeof value === 'string' && value.trim()) return value

  if (isRecord(value)) {
    const imageId = pickString(value.imageId)
    if (imageId) {
      return getBackendImageUrl(imageId) ?? undefined
    }

    return pickString(
      value.url,
      value.src,
      value.path,
      value.imageUrl,
      value.coverUrl,
      value.avatarUrl
    )
  }

  return undefined
}

function mapTrack(item: unknown): HomeItem | null {
  if (!isRecord(item)) return null

  const id = pickString(item.id, item.trackId)
  const title = pickString(item.title, item.name)
  if (!id || !title) return null

  const mainArtists = Array.isArray(item.mainArtists) ? item.mainArtists : []
  const featuredArtists = Array.isArray(item.featuredArtists)
    ? item.featuredArtists
    : []

  const artistNames = [...mainArtists, ...featuredArtists]
    .map((artist) => {
      if (!isRecord(artist)) return null
      return pickString(artist.name, artist.title)
    })
    .filter(Boolean)
    .join(', ')

  const albumId =
    typeof item.albumId === 'string'
      ? item.albumId
      : isRecord(item.album) && typeof item.album.id === 'string'
        ? item.album.id
        : null

  const image =
    pickImage(item.coverImage) ??
    pickImage(item.image) ??
    pickImage(item.cover) ??
    (isRecord(item.album)
      ? pickImage(item.album.coverImage) ??
        pickImage(item.album.image) ??
        pickImage(item.album.cover)
      : undefined)

  return {
    id,
    title,
    subtitle: artistNames || pickString(item.subtitle, item.description),
    image,
    contextType: 'album',
    contextExternalId: albumId,
  }
}

function mapAlbum(item: unknown): HomeItem | null {
  if (!isRecord(item)) return null

  const id = pickString(item.id, item.albumId)
  const title = pickString(item.title, item.name)
  if (!id || !title) return null

  const artists = Array.isArray(item.artists)
    ? item.artists
    : Array.isArray(item.mainArtists)
      ? item.mainArtists
      : []

  const artistNames = artists
    .map((artist) => {
      if (!isRecord(artist)) return null
      return pickString(artist.name, artist.title)
    })
    .filter(Boolean)
    .join(' • ')

  const image =
    pickImage(item.coverImage) ??
    pickImage(item.image) ??
    pickImage(item.cover)

  return {
    id,
    title,
    subtitle:
      artistNames || pickString(item.subtitle, item.description, item.type),
    image,
  }
}

function mapPlaylist(item: unknown): HomeItem | null {
  if (!isRecord(item)) return null

  const id = pickString(item.id, item.playlistId)
  const title = pickString(item.name, item.title)
  if (!id || !title) return null

  const owner = isRecord(item.owner)
    ? pickString(item.owner.name, item.owner.displayName)
    : undefined

  const image =
    pickImage(item.customCoverImageId) ??
    pickImage(item.coverImage) ??
    pickImage(item.image) ??
    pickImage(item.cover)

  return {
    id,
    title,
    subtitle: pickString(item.description, owner, item.subtitle),
    image,
  }
}

async function tryEndpoints(endpoints: string[]): Promise<unknown[]> {
  for (const endpoint of endpoints) {
    try {
      const { data } = await apiClient.get(endpoint)
      const items = asArray(data)
      if (items.length > 0) return items
    } catch {
      // next
    }
  }

  return []
}

async function getHomeSections(): Promise<HomeSections> {
  const [trackRaw, playlistRaw, albumRaw] = await Promise.all([
    tryEndpoints([
      '/api/v1/tracks',
      '/tracks',
      '/api/v1/me/tracks',
      '/api/v1/search/tracks',
    ]),
    tryEndpoints([
      '/api/v1/playlists',
      '/playlists',
      '/api/v1/me/playlists',
    ]),
    tryEndpoints(['/api/v1/albums', '/albums']),
  ])

  return {
    recently: trackRaw.map(mapTrack).filter(Boolean).slice(0, 12) as HomeItem[],
    forYou: playlistRaw
      .map(mapPlaylist)
      .filter(Boolean)
      .slice(0, 4) as HomeItem[],
    albums: albumRaw.map(mapAlbum).filter(Boolean).slice(0, 12) as HomeItem[],
  }
}

export function useHomeSections() {
  return useQuery({
    queryKey: ['home-sections'],
    queryFn: getHomeSections,
    staleTime: 30_000,
  })
}