import { AdminUploadIcon } from '@/shared/ui/icons/settings/AdminUploadIcon'
import { AdminMusicNoteIcon } from '@/shared/ui/icons/settings/AdminMusicNoteIcon'
import { AdminUploadForm } from './AdminUploadForm'

export function AdminUploadSection() {
  return (
    <>
      <div className="mt-[18px] flex items-center gap-[12px]">
        <div className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-[10px] bg-groov-surface text-groov-accent">
          <AdminUploadIcon className="h-[24px] w-[24px]" />
        </div>

        <h2 className="text-[18px] font-medium leading-[22px] text-groov-accent">
          Завантажте свій перший трек
        </h2>
      </div>

      <div className="mt-[16px] rounded-[14px] bg-groov-surface px-[16px] py-[34px] text-center">
        <div className="flex justify-center text-groov-accent">
          <AdminMusicNoteIcon className="h-[58px] w-[58px]" />
        </div>

        <p className="mt-[22px] text-[16px] leading-[19px] text-groov-accent">
          Перетягніть аудіофайл сюди
        </p>

        <p className="mt-[8px] text-[14px] leading-[17px] text-groov-accent/90">
          MP3, WAV, FLAC до 50MB
        </p>
      </div>

      <AdminUploadForm />
    </>
  )
}