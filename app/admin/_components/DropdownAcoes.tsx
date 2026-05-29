'use client'

import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'

export interface AcaoItem {
  label: string
  icon?: React.ReactNode
  onClick: () => void
  danger?: boolean
  hidden?: boolean
  separator?: boolean
}

// Ícones inline (sem lucide-react)
export const IconPencil = () => (
  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 7.125L18 8.625" />
  </svg>
)

export const IconTrash = () => (
  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
  </svg>
)

export function DropdownAcoes({ itens }: { itens: AcaoItem[] }) {
  const [aberto, setAberto] = useState(false)
  const [pos, setPos] = useState({ top: 0, left: 0 })
  const btnRef = useRef<HTMLButtonElement>(null)

  function abrirMenu() {
    if (btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect()
      setPos({
        top: rect.bottom + window.scrollY + 4,
        left: rect.right + window.scrollX,
      })
    }
    setAberto((v) => !v)
  }

  useEffect(() => {
    if (!aberto) return
    function handleClick() { setAberto(false) }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [aberto])

  const visiveis = itens.filter((i) => !i.hidden)

  const dropdown = (
    <div
      style={{ top: pos.top, left: pos.left, transform: 'translateX(-100%)' }}
      className="fixed z-[9999] bg-[#1c1c1c] border border-white/10 rounded-xl shadow-2xl py-1 min-w-[148px]"
      onMouseDown={(e) => e.stopPropagation()}
    >
      {visiveis.map((item, i) =>
        item.separator ? (
          <div key={i} className="my-1 border-t border-white/8" />
        ) : (
          <button
            key={i}
            onClick={() => { setAberto(false); item.onClick() }}
            className={`flex items-center gap-2.5 w-full px-3.5 py-2 text-sm text-left transition-colors ${
              item.danger
                ? 'text-red-400 hover:bg-red-500/10 hover:text-red-300'
                : 'text-white/65 hover:bg-white/5 hover:text-white'
            }`}
          >
            {item.icon}
            {item.label}
          </button>
        )
      )}
    </div>
  )

  return (
    <>
      <button
        ref={btnRef}
        onClick={abrirMenu}
        className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-white/35 hover:text-white hover:bg-white/8 transition-colors"
        title="Ações"
      >
        {/* ··· horizontal */}
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <circle cx="5" cy="12" r="1.75" />
          <circle cx="12" cy="12" r="1.75" />
          <circle cx="19" cy="12" r="1.75" />
        </svg>
      </button>

      {aberto && typeof window !== 'undefined' &&
        createPortal(dropdown, document.body)}
    </>
  )
}
