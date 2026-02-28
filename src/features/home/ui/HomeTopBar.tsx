'use client'

import { Bell } from 'lucide-react'

export function HomeTopBar() {
  return (
    <div className="flex items-center justify-between">
      <div className="text-[18px] font-extrabold tracking-tight text-white">GROOV</div>

      <button
        className="grid h-9 w-9 place-items-center rounded-full bg-groov-primary text-groov-blue2 hover:text-groov-accent"
        aria-label="Notifications"
      >
        <Bell size={18} />
      </button>
    </div>
  )
}