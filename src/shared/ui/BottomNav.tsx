'use client'

import { Home, Search, ListMusic, Library, User } from 'lucide-react'

export function BottomNav({ active }: { active: 'home' | 'search' | 'playlists' | 'library' | 'profile' }) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 border-t border-white/5 bg-groov-bg/90 backdrop-blur">
      <div className="mx-auto flex max-w-[420px] items-center justify-between px-6 py-3">
        <NavItem icon={<Home size={20} />} label="Головна" active={active === 'home'} />
        <NavItem icon={<Search size={20} />} label="Пошук" active={active === 'search'} />
        <NavItem icon={<ListMusic size={20} />} label="Плейлісти" active={active === 'playlists'} />
        <NavItem icon={<Library size={20} />} label="Бібліотека" active={active === 'library'} />
        <NavItem icon={<User size={20} />} label="Профіль" active={active === 'profile'} />
      </div>
    </nav>
  )
}

function NavItem({ icon, label, active }: { icon: React.ReactNode; label: string; active: boolean }) {
  return (
    <button className="flex flex-col items-center gap-1">
      <div className={active ? 'text-groov-accent' : 'text-groov-blue2'}>{icon}</div>
      <div className={`text-[10px] ${active ? 'text-groov-accent' : 'text-groov-blue2'}`}>{label}</div>
    </button>
  )
}
