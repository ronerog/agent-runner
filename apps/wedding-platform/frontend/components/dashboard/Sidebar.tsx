'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '../../app/contexts/AuthContext'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: '🏠' },
  { href: '/dashboard/site', label: 'My Site', icon: '🌐' },
  { href: '/dashboard/guests', label: 'Guests', icon: '👥' },
  { href: '/dashboard/gifts', label: 'Gifts', icon: '🎁' },
]

export default function Sidebar() {
  const pathname = usePathname()
  const { user, logout } = useAuth()

  return (
    <aside className="bg-slate-900 w-64 fixed h-full flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-slate-700">
        <div className="flex items-center gap-2">
          <span className="text-2xl">💍</span>
          <span className="text-white font-semibold text-lg">Wedding Platform</span>
        </div>
        {user && (
          <p className="text-slate-400 text-xs mt-2 truncate">{user.email}</p>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium
                transition-colors duration-150
                ${isActive
                  ? 'bg-rose-500 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }
              `}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-slate-700">
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <span>🚪</span>
          <span>Sign out</span>
        </button>
      </div>
    </aside>
  )
}
