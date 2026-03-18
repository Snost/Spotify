'use client'

import { create } from 'zustand'
import { mockSearchResults } from '../mock/search.mock'
import type { FilterType, SearchItem } from './search.types'

type SearchState = {
  query: string
  activeFilters: FilterType[]
  advancedFilters: string[]
  results: SearchItem[]

  setQuery: (value: string) => void
  toggleFilter: (filter: FilterType) => void
  toggleAdvancedFilter: (filter: string) => void
  clearResults: () => void
  removeItem: (id: string) => void
  resetFilters: () => void
}

export const useSearchStore = create<SearchState>((set) => ({
  query: '',
  activeFilters: [],
  advancedFilters: [],
  results: mockSearchResults,

  setQuery: (value) => set({ query: value }),

  toggleFilter: (filter) =>
    set((state) => ({
      activeFilters: state.activeFilters.includes(filter)
        ? state.activeFilters.filter((item) => item !== filter)
        : [...state.activeFilters, filter],
    })),

  toggleAdvancedFilter: (filter) =>
    set((state) => ({
      advancedFilters: state.advancedFilters.includes(filter)
        ? state.advancedFilters.filter((item) => item !== filter)
        : [...state.advancedFilters, filter],
    })),

  clearResults: () => set({ results: [] }),

  removeItem: (id) =>
    set((state) => ({
      results: state.results.filter((item) => item.id !== id),
    })),

  resetFilters: () =>
    set({
      activeFilters: [],
      advancedFilters: [],
    }),
}))