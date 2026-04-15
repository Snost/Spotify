import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type LibraryPlaylistItem = {
  id: string
  title: string
  subtitle: string
  tracksCount: number
  image: string | null
  color?: string
}

type State = {
  playlists: LibraryPlaylistItem[]
  setPlaylists: (playlists: LibraryPlaylistItem[]) => void
  prependPlaylist: (playlist: LibraryPlaylistItem) => void
}

export const useLibraryPlaylistsStore = create<State>()(
  persist(
    (set) => ({
      playlists: [],
      setPlaylists: (playlists) => set({ playlists }),
      prependPlaylist: (playlist) =>
        set((state) => ({
          playlists: [playlist, ...state.playlists],
        })),
    }),
    {
      name: 'library-playlists',
    }
  )
)