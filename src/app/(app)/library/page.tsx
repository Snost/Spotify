'use client'

import { useState } from 'react'
import { AppShell } from '@/shared/ui/layout/AppShell'
import { BottomNav } from '@/shared/ui/BottomNav'
import { libraryData } from '@/features/library/model/library.mock'
import type { LibraryTabId } from '@/features/library/model/types'
import { LibraryHeader } from '@/features/library/ui/LibraryHeader'
import { LibraryFilters } from '@/features/library/ui/LibraryFilters'
import { LibraryStats } from '@/features/library/ui/LibraryStats'
import { SavedCollections } from '@/features/library/ui/SavedCollections'
import { RecentPlaylists } from '@/features/library/ui/RecentPlaylists'
import { LikedTracksList } from '@/features/library/ui/LikedTracksList'

export default function LibraryPage() {
  const [activeTab, setActiveTab] = useState<LibraryTabId>('saved')

  return (
    <AppShell
      mobileMaxWidth={402}
      withDefaultPadding={false}
      withBottomNavSpacing
      contentClassName="pb-0"
    >
      <div className="min-h-full bg-groov-bg px-[10px] pt-[10px]">
        <LibraryHeader />

        <LibraryFilters
          tabs={libraryData.tabs}
          activeTab={activeTab}
          onChange={setActiveTab}
        />

        <LibraryStats stats={libraryData.stats} />

        {activeTab === 'saved' && (
          <>
<SavedCollections
  items={libraryData.saved.savedCollections}
/>          <RecentPlaylists items={libraryData.saved.recentPlaylists} />
          </>
        )}

        {activeTab === 'liked' && (
          <LikedTracksList
            title={libraryData.liked.sectionTitle}
            tracks={libraryData.liked.tracks}
          />
        )}

        {activeTab === 'playlists' && (
          <RecentPlaylists items={libraryData.saved.recentPlaylists} />
        )}

        {activeTab === 'artists' && (
          <div className="mt-[24px] rounded-[14px] bg-groov-surface p-4 text-groov-accent">
            Артисти додамо наступним кроком
          </div>
        )}
      </div>

      <BottomNav />
    </AppShell>
  )
}