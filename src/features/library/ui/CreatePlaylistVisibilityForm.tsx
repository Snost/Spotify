'use client'

import Link from 'next/link'
import { useState } from 'react'
import { visibilityOptions } from '@/features/library/model/create-playlist.constants'
import type { PlaylistVisibility } from '@/features/library/model/create-playlist.types'
import { VisibilityOptionCard } from './VisibilityOptionCard'

export function CreatePlaylistVisibilityForm() {
  const [selected, setSelected] = useState<PlaylistVisibility | null>(null)

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <div className="mt-[25px] shrink-0">
        <h1 className="text-[24px] font-semibold text-groov-accent">
          Налаштування доступу
        </h1>

        <p className="mt-[10px] text-[16px] text-groov-accent">
          Виберіть, хто зможе бачити ваш плейліст.
        </p>
      </div>

      <div className="mt-[20px] shrink-0 space-y-[10px]">
        {visibilityOptions.map((option) => (
          <VisibilityOptionCard
            key={option.id}
            title={option.title}
            description={option.description}
            icon={option.icon}
            selected={selected === option.id}
            onSelect={() => setSelected(option.id)}
          />
        ))}
      </div>

      <div className="mt-auto pb-[calc(env(safe-area-inset-bottom)+32px)] pt-[24px]">
        {selected ? (
          <Link
            href="/library"
            className="flex h-[50px] w-full items-center justify-center rounded-[14px] bg-groov-secondary text-[16px] font-medium text-groov-accent transition-all duration-200 active:opacity-80"
          >
            Далі
          </Link>
        ) : (
          <button
            type="button"
            disabled
            className="h-[50px] w-full rounded-[14px] bg-groov-secondary text-[16px] font-medium text-groov-accent opacity-50"
          >
            Далі
          </button>
        )}
      </div>
    </div>
  )
}