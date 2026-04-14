import { apiClient } from '@/shared/api/client'

export type SharedTrackResponseItem = {
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

export type RelatedArtist = {
  id: string
  name: string
  status: string
  ownerId: string | null
  avatar: string | null
}

export type RelatedAlbumDetails = {
  id: string
  title: string
  releaseDate: string | null
  status: string
  type: string
  cover: {
    imageId: string
    width: number
    height: number
    fileType: string
    sizeInBytes: number
  } | null
  mainArtists: Array<{
    id: string
    name: string
    status: string
    ownerId: string | null
    avatar: string | null
  }>
  tracks: Array<{
    id: string
    title: string
    containsExplicitContent: boolean
    status: string
    duration: string | null
    position: number
  }>
}

export async function getAllSharedTracks() {
  const { data } = await apiClient.get<SharedTrackResponseItem[]>(
    '/api/v1/shared/tracks'
  )
  return data
}

export async function getAllArtists() {
  const { data } = await apiClient.get<RelatedArtist[]>('/api/v1/artists', {
    params: {
      page: 1,
      pageSize: 100,
    },
  })

  return data
}

export async function getAlbumDetails(albumId: string) {
  const { data } = await apiClient.get<RelatedAlbumDetails>(
    `/api/v1/albums/${albumId}`
  )
  return data
}