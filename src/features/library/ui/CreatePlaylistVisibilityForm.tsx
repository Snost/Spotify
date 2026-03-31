'use client'

import { useState } from 'react'
import { visibilityOptions } from '@/features/library/model/create-playlist.constants'
import type { PlaylistVisibility } from '@/features/library/model/create-playlist.types'
import { VisibilityOptionCard } from './VisibilityOptionCard'
import { CreatePlaylistBottomAction } from './CreatePlaylistBottomAction'
import { CreatePlaylistNextButton } from './CreatePlaylistNextButton'

export function CreatePlaylistVisibilityForm() {
  const [selected, setSelected] = useState<PlaylistVisibility | null>(null)

  return (
    <>
      <div className="mt-[25px]">
        <h1 className="text-[24px] font-semibold text-groov-accent">
          Налаштування доступу
        </h1>

        <p className="mt-[10px] text-[16px] text-groov-accent">
          Виберіть, хто зможе бачити ваш плейліст.
        </p>
      </div>

      <div className="mt-[20px] space-y-[10px]">
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

      <CreatePlaylistBottomAction className="pt-[220px]">
        <CreatePlaylistNextButton
          href="/library"
          disabled={!selected}
        />
      </CreatePlaylistBottomAction>
    </>
  )
}