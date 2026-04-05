import { apiClient } from '@/shared/api/client'

export type TrackDetailsResponse = {
  id: string
  title: string
  duration: number | null
  releaseDate: string | null
  containsExplicitContent: boolean
  status: string
  audioFileId: string | null
  albumId: string | null
  mainArtists: Array<{
    id: string
    name: string
    status: string
    ownerId: string | null
    avatar: string | null
  }>
  featuredArtists: Array<{
    id: string
    name: string
    status: string
    ownerId: string | null
    avatar: string | null
  }>
  genres: Array<{
    id: string
    name: string
  }>
  moods: Array<{
    id: string
    name: string
  }>
}

export async function getTrack(id: string) {
  const { data } = await apiClient.get<TrackDetailsResponse>(`/tracks/${id}`)
  return data
}