'use client'

import { useRouter } from 'next/navigation'

function BackIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M15 6L9 12L15 18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function AdvancedFiltersHeader() {
  const router = useRouter()

  return (
    <div className="sticky top-0 z-20 -mx-4 flex h-[50px] items-center gap-3 bg-groov-surface px-4">
      <button
        type="button"
        onClick={() => router.back()}
        className="shrink-0 text-groov-accent"
      >
        <BackIcon />
      </button>

      <h1 className="text-[16px] font-medium leading-[20px] text-groov-accent">
        Розширені фільтри
      </h1>
    </div>
  )
}