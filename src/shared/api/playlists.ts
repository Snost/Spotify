import { apiClient } from '@/shared/api/client'

export type PlaylistDetailsResponse = {
  id: string
  name: string
  description: string | null
  ownerId: string
  isPublic: boolean
  customCoverImageId: {
    imageId: string
    width: number
    height: number
    fileType: string
    sizeInBytes: number
  } | null
  generatedCoverImageIds: string[]
  collaborators: Array<{
    id: string
    name: string
    avatarImageId: string | null
  }>
  tracks: Array<{
    id: string
    position: number
  }>
}

export type CreatePlaylistResponse = {
  playlistId: string
}

export type UpdatePlaylistRequest = {
  name: string
  description: string | null
  isPublic: boolean
}

export type AddTrackToPlaylistRequest = {
  trackId: string
}

export type LinkPlaylistCoverRequest = {
  imageId: string
  imageWidth: number
  imageHeight: number
  imageFileType: string
  imageSizeInBytes: number
}

export async function getPlaylist(id: string) {
  const { data } = await apiClient.get<PlaylistDetailsResponse>(
    `/playlists/${id}`,
  )
  return data
}

export async function createPlaylist() {
  const { data } = await apiClient.post<CreatePlaylistResponse>('/playlists')
  return data
}

export async function updatePlaylist(
  id: string,
  body: UpdatePlaylistRequest,
) {
  await apiClient.put(`/playlists/${id}`, body)
}

export async function addTrackToPlaylist(
  id: string,
  body: AddTrackToPlaylistRequest,
) {
  await apiClient.post(`/playlists/${id}/tracks`, body)
}

export async function linkPlaylistCover(
  id: string,
  body: LinkPlaylistCoverRequest,
) {
  await apiClient.put(`/playlists/${id}/cover`, body)
}