import { useMutation } from '@tanstack/react-query'
import {
  addTrackToPlaylist,
  createPlaylist,
  updatePlaylist,
} from '@/shared/api/playlists'

type CreatePlaylistInput = {
  name: string
  description: string | null
  isPublic: boolean
  trackIds: string[]
  coverFile?: File | null
}

export function useCreatePlaylist() {
  return useMutation({
    mutationFn: async ({
      name,
      description,
      isPublic,
      trackIds,
    }: CreatePlaylistInput) => {
      const created = await createPlaylist()
      const playlistId = created.playlistId

      await updatePlaylist(playlistId, {
        name,
        description,
        isPublic,
      })

      for (const trackId of trackIds) {
        await addTrackToPlaylist(playlistId, { trackId })
      }

      return { playlistId }
    },
  })
}