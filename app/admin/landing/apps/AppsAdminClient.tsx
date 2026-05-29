'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface App {
  id: string
  slug: string
  ordem: number
  status: 'ativo' | 'breve' | 'oculto'
  emoji: string | null
  tagline: string | null
  nome: string
  descricao: string | null
  recursos: string[]
  url: string | null
}

const STATUS_LABEL: Record<string, { l: string; classe: string }> = {
  ativo:  { l: 'Ativo',          classe: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' },
  breve:  { l: 'Em breve',       classe: 'bg-amber-500/15 text-amber-400 border-amber-500/30' },
  oculto: { l: 'Oculto',         classe: 'bg-white/5 text-white/40 border-white/10' },
}

export function AppsAdminClient({ apps }: { apps: App[] }) {
  const router = useRouter()
  const [excluindo, setExcluindo] = useState<string | null>(null)
  const [confirmando, setConfirmando] = useState<App | null>(null)

  async function confirmarExcluir() {
    if (!confirmando) return
    setExcluindo(confirmando.id)
    try {
      const res = await fetch(`/api/admin/landing/apps/${confirmando.id}`, { method: 'DELETE' })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data?.error ?? 'Erro ao excluir')
      }
      setConfirmando(null)
      router.refresh()
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Erro ao excluir')
    } finally {
      setExcluindo(null)
    }
  }

  if (apps.length === 0) {
    return (
      <div className="text-center py-16 text-white/40">
        <p className="text-4xl mb-4">📱</p>
        <p className="text-sm">Nenhum app cadastrado ainda.</p>
        <Link href="/admin/landing/apps/novo" className="text-emerald-400 hover:text-emerald-300 text-sm mt-2 inline-block">
          Cadastrar primeiro app →
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {apps.map((a) => {
        const st = STATUS_LABEL[a.status] ?? STATUS_LABEL.oculto
        return (
          <div key={a.id} className={`border rounded-2xl p-5 transition-colors ${a.status === 'oculto' ? 'opacity-60' : ''} border-white/10 bg-white/3`}>
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${st.classe}`}>
                    {st.l}
                  </span>
                  <span className="text-xs text-white/30">ordem: {a.ordem}</span>
                  <span className="text-xs text-white/30">slug: <code className="text-white/50">{a.slug}</code></span>
                </div>
                <p className="font-semibold text-white text-sm mb-1">
                  {a.emoji && <span className="mr-1.5">{a.emoji}</span>}
                  {a.nome}
                </p>
                {a.descricao && (
                  <p className="text-white/55 text-sm leading-relaxed line-clamp-2">{a.descricao}</p>
                )}
                {a.recursos && a.recursos.length > 0 && (
                  <p className="text-xs text-white/40 mt-2">
                    {a.recursos.length} {a.recursos.length === 1 ? 'recurso' : 'recursos'} cadastrado{a.recursos.length === 1 ? '' : 's'}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Link href={`/admin/landing/apps/${a.id}/editar`} className="text-xs bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white px-3 py-1.5 rounded-lg transition-colors">
                  Editar
                </Link>
                <button
                  onClick={() => setConfirmando(a)}
                  disabled={excluindo === a.id}
                  className="text-xs bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-300 hover:text-red-200 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-40"
                >
                  Excluir
                </button>
              </div>
            </div>
          </div>
        )
      })}

      {/* Confirmação de exclusão */}
      {confirmando && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-[#0a0a0a] border border-white/15 rounded-2xl p-6 max-w-md w-full">
            <h3 className="text-base font-bold text-white mb-2">Excluir app?</h3>
            <p className="text-sm text-white/65 mb-1">
              Você está prestes a excluir <strong>{confirmando.nome}</strong> ({confirmando.slug}).
            </p>
            <p className="text-xs text-amber-400 mb-5">
              Esta ação não pode ser desfeita. Se quiser apenas esconder, use status <strong>Oculto</strong>.
            </p>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setConfirmando(null)}
                disabled={excluindo === confirmando.id}
                className="text-sm bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white px-4 py-2 rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={confirmarExcluir}
                disabled={excluindo === confirmando.id}
                className="text-sm bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-200 hover:text-red-100 px-4 py-2 rounded-lg transition-colors"
              >
                {excluindo === confirmando.id ? 'Excluindo...' : 'Excluir definitivamente'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
