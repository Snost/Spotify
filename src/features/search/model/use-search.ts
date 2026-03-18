'use client'

import { useMemo } from 'react'
import { useSearchStore } from './search.store'

export function useSearch() {
  const query = useSearchStore((s) => s.query)
  const activeFilters = useSearchStore((s) => s.activeFilters)
  const advancedFilters = useSearchStore((s) => s.advancedFilters)
  const results = useSearchStore((s) => s.results)

  const setQuery = useSearchStore((s) => s.setQuery)
  const toggleFilter = useSearchStore((s) => s.toggleFilter)
  const toggleAdvancedFilter = useSearchStore((s) => s.toggleAdvancedFilter)
  const clearResults = useSearchStore((s) => s.clearResults)
  const removeItem = useSearchStore((s) => s.removeItem)
  const resetFilters = useSearchStore((s) => s.resetFilters)

  const filteredResults = useMemo(() => {
    let items = results

    if (query.trim()) {
      const q = query.trim().toLowerCase()
      items = items.filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          item.subtitle.toLowerCase().includes(q)
      )
    }

    if (activeFilters.length > 0) {
      items = items.filter((item) => {
        if (activeFilters.includes('tracks') && item.type === 'track') return true
        if (activeFilters.includes('artists') && item.type === 'artist') return true
        if (activeFilters.includes('albums') && item.type === 'album') return true
        return false
      })
    }

    return items
  }, [query, activeFilters, results])

  return {
    query,
    activeFilters,
    advancedFilters,
    filteredResults,
    setQuery,
    toggleFilter,
    toggleAdvancedFilter,
    clearResults,
    removeItem,
    resetFilters,
  }
}