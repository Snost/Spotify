'use client'

import { AdminMusicNoteIcon } from '@/shared/ui/icons/settings/AdminMusicNoteIcon'
import type { AdminTrackItem } from '@/features/admin/api/admin.types'
import { AdminTracksEmptyState } from './AdminTracksEmptyState'
import { AdminTracksList } from './AdminTracksList'

type Props = {
  tracks: AdminTrackItem[]
  onUploadClick: () => void
}

export function AdminTracksSection({ tracks, onUploadClick }: Props) {
  return (
    <>
      <div className="mt-[18px] flex items-center gap-[12px]">
        <div className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-[10px] bg-groov-surface text-groov-accent">
          <AdminMusicNoteIcon className="h-[24px] w-[24px]" />
        </div>

        <h2 className="text-[18px] font-medium leading-[22px] text-groov-accent">
          Мої треки
        </h2>
      </div>

      {tracks.length === 0 ? (
        <AdminTracksEmptyState onUploadClick={onUploadClick} />
      ) : (
        <AdminTracksList tracks={tracks} />
      )}
    </>
  )
}