import type { AdminTrackItem } from '@/features/admin/api/admin.types'

type Props = {
  tracks: AdminTrackItem[]
}

export function AdminTracksList({ tracks }: Props) {
  return (
    <div className="mt-[16px] space-y-[10px]">
      {tracks.map((track) => (
        <div
          key={track.id}
          className="rounded-[14px] bg-groov-surface px-[14px] py-[14px]"
        >
          <div className="flex items-start justify-between gap-[12px]">
            <div className="min-w-0">
              <p className="truncate text-[16px] font-medium leading-[19px] text-groov-accent">
                {track.title}
              </p>
              <p className="mt-[6px] truncate text-[14px] leading-[17px] text-groov-accent/90">
                {track.artist}
              </p>
            </div>

            <span className="shrink-0 rounded-full bg-groov-primary px-[10px] py-[4px] text-[12px] leading-[14px] text-groov-accent">
              {track.status === 'published' ? 'Опубліковано' : 'На модерації'}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}