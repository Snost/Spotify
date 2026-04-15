import { apiClient } from '@/shared/api/client'

export type AlbumCoverImage = {
  imageId: string
  width: number
  height: number
  fileType: string
  sizeInBytes: number
}

export type AlbumArtist = {
  id: string
  name: string
  status: string
  ownerId: string | null
  avatar: string | null
}

export type AlbumTrack = {
  id: string
  title: string
  containsExplicitContent: boolean
  status: string
  duration: string | null
  position: number
}

export type AlbumListItem = {
  id: string
  title: string
  releaseDate: string | null
  status: string
  type: string
}

export type AlbumsListResponse = {
  albums: {
    items: AlbumListItem[]
    page: number
    pageSize: number
    totalCount: number
    hasNextPage: boolean
    hasPreviousPage: boolean
  }
}

export type AlbumDetailsResponse = {
  id: string
  title: string
  releaseDate: string | null
  status: string
  type: string
  cover: AlbumCoverImage | null
  mainArtists: AlbumArtist[]
  tracks: AlbumTrack[]
}

type GetAlbumsParams = {
  genreIds?: string[]
  moodIds?: string[]
  trackIds?: string[]
  page?: number
  pageSize?: number
}

export async function getAlbums(params?: GetAlbumsParams) {
  const { data } = await apiClient.get<AlbumsListResponse>('/api/v1/albums', {
    params: {
      GenreIds: params?.genreIds,
      MoodIds: params?.moodIds,
      TrackIds: params?.trackIds,
      Page: params?.page ?? 1,
      PageSize: params?.pageSize ?? 100,
    },
  })

  return data
}

export async function getAlbum(id: string) {
  const { data } = await apiClient.get<AlbumDetailsResponse>(`/api/v1/albums/${id}`)
  return data
}