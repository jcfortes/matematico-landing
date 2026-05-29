'use client'

import { useState } from 'react'
import Link from 'next/link'

const items = [
  { label: 'Início', href: '#' },
  { label: 'Simular', href: '#simulador' },
  { label: 'Apps', href: '#apps' },
  { label: 'Por que usar', href: '#diferenciais' },
  { label: 'Contato', href: '#contato' },
]

export function NavMobile() {
  const [open, setOpen] = useState(false)

  return (
    <div className="sm:hidden">
      {/* Botão hambúrguer */}
      <button
        onClick={() => setOpen(!open)}
        className="p-2 text-white/60 hover:text-emerald-400 transition-colors"
        aria-label="Menu"
      >
        {open ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </button>

      {/* Menu dropdown */}
      {open && (
        <div className="absolute top-full left-0 right-0 bg-[#0f0f0f] border-b border-white/10 py-4 px-6 flex flex-col gap-4">
          {items.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="text-base text-white/60 hover:text-emerald-400 transition-colors py-1"
            >
              {item.label}
            </a>
          ))}
          <Link
            href="https://amortizacao.matematico.com.br"
            onClick={() => setOpen(false)}
            className="text-base bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2.5 rounded-lg font-medium transition-colors text-center mt-1"
          >
            Acessar →
          </Link>
        </div>
      )}
    </div>
  )
}
