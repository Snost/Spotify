'use client'

import Link from 'next/link'
import { useRef, useState } from 'react'
import { HexColorPicker } from 'react-colorful'
import { DownloadLibIcon } from '@/shared/ui/icons/DownloadLibIcon'
import { EyedropperIcon } from '@/shared/ui/icons/EyedropperIcon'

const coverColors = [
  '#E5B19C',
  '#827145',
  '#8C6900',
  '#35C7D6',
  '#CB8BD0',
] as const

export function CreatePlaylistCoverForm() {
  const [selectedColor, setSelectedColor] = useState<string>(coverColors[0])
  const [isCoverSelected, setIsCoverSelected] = useState(false)
  const [isPickerOpen, setIsPickerOpen] = useState(false)
  const [uploadedImageName, setUploadedImageName] = useState('')
  const [isUploadSelected, setIsUploadSelected] = useState(false)

  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const isPresetColor = coverColors.includes(
    selectedColor as (typeof coverColors)[number]
  )

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <>
      <div className="mt-[38px]">
        <h1 className="text-[24px] font-semibold leading-[24px] text-groov-accent">
          Обкладинка плейлісту
        </h1>

        <p className="mt-[10px] max-w-[350px] text-[16px] leading-[18px] text-groov-accent/50">
          Виберіть обкладинку для вашого плейлісту. Це перше, що побачать інші.
        </p>
      </div>

      {/* GENERATE COVER */}
      <div
        className={`mt-[24px] rounded-[16px] border-2 bg-groov-surface px-[10px] pb-[10px] pt-[10px] transition-all duration-200 ${
          isCoverSelected
            ? 'border-groov-accent shadow-[0_0_0_1px_rgba(240,238,233,0.25)]'
            : 'border-transparent hover:border-groov-accent/40'
        }`}
      >
        <h2 className="text-[20px] font-medium leading-[19px] text-groov-accent">
          Згенерувати обкладинку
        </h2>

        <p className="mt-[8px] max-w-[350px] text-[16px] leading-[17px] text-groov-accent/70">
          Автоматично створити обкладинку на основі назви плейлісту та вибраного
          фону
        </p>

        <div className="mt-[14px] flex justify-center">
          <div
            className="h-[120px] w-[120px] rounded-[18px] transition-colors duration-200"
            style={{ backgroundColor: selectedColor }}
          />
        </div>

        <div className="mt-[14px] text-[16px] font-medium leading-[19px] text-groov-accent">
          Виберіть фон:
        </div>

        <div className="mt-[10px] grid grid-cols-3 gap-[8px]">
          {coverColors.map((color) => {
            const isSelected = selectedColor === color

            return (
              <button
                key={color}
                type="button"
                onClick={() => {
                  setSelectedColor(color)
                  setIsCoverSelected(true)
                  setIsPickerOpen(false)
                }}
                className={`h-[111px] rounded-[16px] border-2 transition-all duration-200 active:scale-[0.97] ${
                  isSelected ? 'border-groov-accent' : 'border-transparent'
                }`}
                style={{ backgroundColor: color }}
              />
            )
          })}

          <button
            type="button"
            onClick={() => {
              setIsPickerOpen((prev) => !prev)
              setIsCoverSelected(true)
            }}
            className={`flex h-[111px] items-center justify-center rounded-[16px] border-2 bg-[#8DA3C0] text-groov-accent transition-all duration-200 active:scale-[0.97] ${
              !isPresetColor && isCoverSelected
                ? 'border-groov-accent'
                : 'border-transparent'
            }`}
          >
            <EyedropperIcon className="h-[27px] w-[27px]" />
          </button>
        </div>

        {isPickerOpen && (
          <div className="mt-[12px] rounded-[12px] bg-groov-bg/40 p-[10px]">
            <HexColorPicker
              color={selectedColor}
              onChange={(color) => {
                setSelectedColor(color)
                setIsCoverSelected(true)
              }}
              className="!w-full"
            />

            <div className="mt-[10px] flex items-center justify-between gap-[10px]">
              <div className="flex items-center gap-[8px]">
                <div
                  className="h-[28px] w-[28px] rounded-full border border-groov-accent/30"
                  style={{ backgroundColor: selectedColor }}
                />
                <span className="text-[14px] leading-[17px] text-groov-accent/80">
                  {selectedColor.toUpperCase()}
                </span>
              </div>

              <button
                type="button"
                onClick={() => setIsPickerOpen(false)}
                className="rounded-[10px] bg-groov-secondary px-[12px] py-[6px] text-[14px] leading-[17px] text-groov-accent transition-opacity active:opacity-80"
              >
                Готово
              </button>
            </div>
          </div>
        )}
      </div>

      {/* UPLOAD COVER */}
      <div
        className={`mt-[16px] rounded-[12px] border-2 bg-groov-surface px-[10px] pb-[10px] pt-[10px] transition-all duration-200 ${
          isUploadSelected
            ? 'border-groov-accent shadow-[0_0_0_1px_rgba(240,238,233,0.25)]'
            : 'border-transparent hover:border-groov-accent/40'
        }`}
      >
        <div className="flex items-start gap-[8px]">
          <div className="mt-[2px] flex h-[28px] w-[28px] items-center justify-center rounded-[8px] border border-groov-accent/30 text-groov-accent">
            <DownloadLibIcon className="h-[16px] w-[16px]" />
          </div>

          <div className="min-w-0">
            <h2 className="text-[16px] font-medium text-groov-accent">
              Завантажити власне зображення
            </h2>

            <p className="mt-[8px] text-[14px] text-groov-accent/50">
              Завантажте власне зображення для обкладинки плейлісту.
            </p>

            {uploadedImageName ? (
              <p className="mt-[8px] truncate text-[13px] text-groov-accent/70">
                {uploadedImageName}
              </p>
            ) : null}
          </div>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (!file) return

            setUploadedImageName(file.name)
            setIsUploadSelected(true)
          }}
        />

        <button
          type="button"
          onClick={handleUploadClick}
          className="mt-[14px] h-[40px] w-full rounded-[12px] bg-groov-secondary text-[16px] text-groov-accent transition-opacity active:opacity-80"
        >
          Завантажити зображення
        </button>
      </div>

      {/* NEXT */}
      <div className="mt-auto pb-[max(env(safe-area-inset-bottom),40px)] pt-[24px]">
    
<Link
  href="/library/create-playlist/tracks"          className="flex h-[50px] w-full items-center justify-center rounded-[14px] bg-groov-secondary text-[16px] text-groov-accent transition-opacity active:opacity-80"
        >
          Далі
        </Link>
      </div>
    </>
  )
}