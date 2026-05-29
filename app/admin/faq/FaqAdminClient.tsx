'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

interface Props {
  action: 'delete' | 'toggle' | 'logout'
  id?: string
  ativo?: boolean
}

export function FaqAdminClient({ action, id, ativo }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleDelete() {
    if (!confirm('Excluir esta pergunta permanentemente?')) return
    setLoading(true)
    await fetch(`/api/admin/faq/${id}`, { method: 'DELETE' })
    router.refresh()
    setLoading(false)
  }

  async function handleToggle() {
    setLoading(true)
    await fetch(`/api/admin/faq/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ativo: !ativo }),
    })
    router.refresh()
    setLoading(false)
  }

  async function handleLogout() {
    await fetch('/api/admin/logout', { method: 'POST' })
    router.push('/admin')
  }

  if (action === 'logout') {
    return (
      <button
        onClick={handleLogout}
        className="text-xs text-white/40 hover:text-white/70 transition-colors cursor-pointer"
      >
        Sair
      </button>
    )
  }

  if (action === 'toggle') {
    return (
      <button
        onClick={handleToggle}
        disabled={loading}
        className={`text-xs border px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
          ativo
            ? 'bg-white/5 hover:bg-white/10 border-white/10 text-white/60 hover:text-white'
            : 'bg-emerald-600/20 hover:bg-emerald-600/30 border-emerald-500/30 text-emerald-400'
        }`}
      >
        {loading ? '...' : ativo ? 'Desativar' : 'Ativar'}
      </button>
    )
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="text-xs bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 hover:text-red-300 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
    >
      {loading ? '...' : 'Excluir'}
    </button>
  )
}
