'use client'

import { AppShell } from '@/shared/ui/layout/AppShell'
import { advancedFilters } from '@/features/search/mock/advanced-filters.mock'
import { AdvancedFiltersHeader } from '@/features/search/ui/AdvancedFiltersHeader'
import { AdvancedFiltersGrid } from '@/features/search/ui/AdvancedFiltersGrid'

export default function SearchAdvancedFiltersPage() {
  const handleSelect = (value: string) => {
    console.log('selected filter:', value)
  
  }

  return (
    <AppShell>
      <AdvancedFiltersHeader />

      <div className="mt-[18px] pb-[24px]">
        <AdvancedFiltersGrid items={advancedFilters} onSelect={handleSelect} />
      </div>
    </AppShell>
  )
}