'use client'

import { useMemo, useState } from 'react'
import { useAuthStore } from '@/shared/stores/auth.store'
import { ChevronDownIcon } from '@/shared/ui/icons/ChevronDownIcon'
import { adminGenresMock } from '@/features/admin/api/admin.mock'

export function AdminUploadForm() {
  const displayNameFromStore = useAuthStore((s) => s.displayName)

  const performerName = useMemo(() => {
    const safeName = displayNameFromStore?.trim()
    return safeName && safeName.length > 0 ? safeName : ''
  }, [displayNameFromStore])

  const [trackTitle, setTrackTitle] = useState('')
  const [selectedGenreId, setSelectedGenreId] = useState('')
  const [isGenreOpen, setIsGenreOpen] = useState(false)

  const selectedGenre = adminGenresMock.find(
    (genre) => genre.id === selectedGenreId
  )

  const handleSelectGenre = (genreId: string) => {
    setSelectedGenreId(genreId)
    setIsGenreOpen(false)
  }

  return (
    <>
      <div className="mt-[20px]">
        <label className="block">
          <span className="text-[14px] font-medium leading-[17px] text-groov-accent">
            Назва треку
          </span>

          <input
            type="text"
            value={trackTitle}
            onChange={(e) => setTrackTitle(e.target.value)}
            placeholder="Введіть назву треку"
            className="mt-[10px] h-[40px] w-full rounded-[10px] border-0 bg-groov-accent px-[14px] text-[14px] leading-[14px] text-groov-textDark outline-none placeholder:text-groov-textDark/60"
          />
        </label>
      </div>

      <div className="mt-[16px]">
        <label className="block">
          <span className="text-[14px] font-medium leading-[17px] text-groov-accent">
            Виконавець
          </span>

          <input
            type="text"
            value={performerName}
            readOnly
            placeholder="Ім’я профілю"
            className="mt-[10px] h-[40px] w-full rounded-[10px] border-0 bg-groov-accent px-[14px] text-[14px] leading-[14px] text-groov-textDark outline-none placeholder:text-groov-textDark/60"
          />
        </label>
      </div>

      <div className="mt-[16px]">
        <span className="text-[14px] font-medium leading-[17px] text-groov-accent">
          Жанр
        </span>

        <div className="relative mt-[10px]">
          <button
            type="button"
            onClick={() => setIsGenreOpen((prev) => !prev)}
            className="flex h-[40px] w-full items-center justify-between rounded-[10px] bg-groov-accent px-[14px] text-groov-textDark"
          >
            <span
              className={[
                'text-[14px] leading-[14px]',
                selectedGenre ? 'text-groov-textDark' : 'text-groov-textDark/60',
              ].join(' ')}
            >
              {selectedGenre?.name ?? 'Оберіть жанр'}
            </span>

            <ChevronDownIcon
              className={[
                'h-[24px] w-[24px] transition-transform',
                isGenreOpen ? 'rotate-180' : '',
              ].join(' ')}
            />
          </button>

          {isGenreOpen ? (
            <div className="absolute left-0 right-0 top-[46px] z-20 overflow-hidden rounded-[12px] bg-groov-accent shadow-lg">
              {adminGenresMock.map((genre) => (
                <button
                  key={genre.id}
                  type="button"
                  onClick={() => handleSelectGenre(genre.id)}
                  className="flex h-[40px] w-full items-center px-[14px] text-left text-[14px] leading-[14px] text-groov-textDark transition-colors hover:bg-black/5"
                >
                  {genre.name}
                </button>
              ))}
            </div>
          ) : null}
        </div>
      </div>

      <button
        type="button"
        className="mt-[16px] flex h-[40px] w-full items-center justify-center rounded-[12px] bg-[#8DA2BE] text-[16px] font-medium leading-[19px] text-groov-accent"
      >
        Завантажити трек
      </button>

      <p className="mt-[10px] text-center text-[11px] leading-[14px] text-groov-accent/90">
        Ваш трек з’явиться у вашому профілі після модерації
      </p>
    </>
  )
}