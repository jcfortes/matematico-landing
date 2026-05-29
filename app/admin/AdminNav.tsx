'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import { PAGINAS_ADMIN } from '@/lib/paginas-admin'

interface Props {
  role: string
  paginas: string[]
}

export function AdminNav({ role, paginas }: Props) {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)

  async function handleLogout() {
    await fetch('/api/admin/logout', { method: 'POST' })
    router.push('/admin')
  }

  const items = PAGINAS_ADMIN.filter((p) => paginas.includes(p.slug))

  const navContent = (onClickItem?: () => void) => (
    <>
      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {items.map((item) => (
          <Link
            key={item.slug}
            href={item.href}
            onClick={onClickItem}
            className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm transition-colors ${
              pathname.startsWith(item.href)
                ? 'bg-emerald-600/20 text-emerald-400 font-semibold'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      {/* Role badge + logout */}
      <div className="px-5 py-4 border-t border-white/8">
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${
          role === 'administrador'
            ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20'
            : 'bg-white/5 text-white/50 border-white/10'
        }`}>
          {role === 'administrador' ? 'Administrador' : role.charAt(0).toUpperCase() + role.slice(1)}
        </span>
        <button
          onClick={handleLogout}
          className="mt-3 text-xs text-white/35 hover:text-white/70 transition-colors cursor-pointer block"
        >
          Sair →
        </button>
      </div>
    </>
  )

  return (
    <>
      {/* ── DESKTOP: sidebar fixa ── */}
      <aside className="hidden sm:flex w-56 shrink-0 border-r border-white/8 bg-[#0a0a0a] flex-col">
        {navContent()}
      </aside>

      {/* ── MOBILE: botão sanduíche no header ── */}
      <button
        onClick={() => setMobileOpen(true)}
        className="sm:hidden fixed top-5 right-5 z-40 p-2 rounded-xl bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/10 transition-colors"
        aria-label="Menu"
      >
        <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* ── MOBILE: drawer overlay ── */}
      {mobileOpen && (
        <>
          {/* Fundo escuro */}
          <div
            className="sm:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            onClick={() => setMobileOpen(false)}
          />

          {/* Drawer lateral */}
          <div className="sm:hidden fixed top-0 left-0 h-full w-64 bg-[#0a0a0a] border-r border-white/10 z-50 flex flex-col">
            {/* Cabeçalho do drawer */}
            <div className="flex items-center justify-between px-5 h-20 border-b border-white/8 shrink-0">
              <span className="text-sm font-semibold text-white/50 uppercase tracking-widest">Menu</span>
              <button
                onClick={() => setMobileOpen(false)}
                className="p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {navContent(() => setMobileOpen(false))}
          </div>
        </>
      )}
    </>
  )
}
