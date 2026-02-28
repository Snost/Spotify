'use client'

import { useAuthStore } from '@/shared/stores/auth.store'
import { BottomNav } from '@/shared/ui/BottomNav'
import { HomeTopBar } from '@/features/home/ui/HomeTopBar'
import { HomeHeroCard } from '@/features/home/ui/HomeHeroCard'
import { SectionHeader } from '@/features/home/ui/SectionHeader'
import { HScroll } from '@/features/home/ui/HScroll'
import { GridCards } from '@/features/home/ui/GridCards'
import { recently, forYou, mood, albums } from '@/features/home/mock'

export default function HomePage() {
  const displayName = useAuthStore((s) => s.displayName)

  return (
    <div className="min-h-dvh bg-groov-bg">
      {/* мобільний контейнер */}
      <div className="mx-auto max-w-[390px] px-5 pb-24 pt-6">
        <HomeTopBar />

        <div className="mt-4">
          <div className="text-[20px] font-semibold leading-tight text-white">
            Добрий вечір{displayName ? `, ${displayName}` : ''}
          </div>
          <div className="mt-2 max-w-[320px] text-[13px] leading-snug text-groov-blue2">
            Слухайте музику, яка налаштовує на потрібний лад
          </div>
        </div>

        <HomeHeroCard />

        <div className="mt-7 space-y-3">
          <SectionHeader title="Нещодавно слухали" href="/recent" />
          <HScroll items={recently} hrefPrefix="/track" />
        </div>

        <div className="mt-7 space-y-3">
          <SectionHeader title="Плейлісти для вас" href="/playlists" />
          <GridCards items={forYou} hrefPrefix="/playlist" />
        </div>

        <div className="mt-7 space-y-3">
          <SectionHeader title="Настрій" href="/mood" />
          <HScroll items={mood} hrefPrefix="/playlist" />
        </div>

        <div className="mt-7 space-y-3">
          <SectionHeader title="Популярні альбоми" href="/albums" />
          <HScroll items={albums} hrefPrefix="/album" />
        </div>
      </div>

      <BottomNav active="home" />
    </div>
  )
}