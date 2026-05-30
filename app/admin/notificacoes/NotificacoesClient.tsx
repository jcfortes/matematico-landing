'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface EmailNotif {
  id: string
  email: string
  nome: string | null
  notif_prazo_expirado: boolean
  notif_novo_cadastro: boolean
  notif_erros: boolean
  created_at: string
}

export function NotificacoesClient({ emails }: { emails: EmailNotif[] }) {
  const router = useRouter()
  const [novoEmail, setNovoEmail] = useState('')
  const [novoNome, setNovoNome] = useState('')
  const [adicionando, setAdicionando] = useState(false)
  const [erro, setErro] = useState('')

  async function adicionar(e: React.FormEvent) {
    e.preventDefault()
    setErro('')
    if (!novoEmail) return

    setAdicionando(true)
    const res = await fetch('/api/admin/notificacoes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: novoEmail,
        nome: novoNome || null,
        notif_prazo_expirado: true,
        notif_novo_cadastro: false,
        notif_erros: false,
      }),
    })
    setAdicionando(false)
    const data = await res.json()
    if (!res.ok) {
      setErro(data.error ?? 'Erro ao adicionar')
      return
    }
    setNovoEmail('')
    setNovoNome('')
    router.refresh()
  }

  async function alternarToggle(
    id: string,
    campo: 'notif_prazo_expirado' | 'notif_novo_cadastro' | 'notif_erros',
    novoValor: boolean
  ) {
    await fetch('/api/admin/notificacoes', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, [campo]: novoValor }),
    })
    router.refresh()
  }

  async function excluir(id: string, email: string) {
    if (!confirm(`Remover ${email} das notificações?`)) return
    await fetch('/api/admin/notificacoes', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    router.refresh()
  }

  return (
    <div className="space-y-6">
      {/* Aviso sobre setup */}
      {!process.env.NEXT_PUBLIC_EMAIL_CONFIGURADO && (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl px-4 py-3 text-sm text-amber-300">
          ⚠ <strong>Atenção:</strong> Pra que os emails sejam enviados de verdade, é necessário configurar a variável
          de ambiente <code className="bg-amber-500/20 px-1 rounded">BREVO_API_KEY</code> na Vercel.
          Enquanto isso, as notificações ficam registradas em log mas não são enviadas.
        </div>
      )}

      {/* Form adicionar */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
        <h2 className="text-sm font-bold text-white mb-3 uppercase tracking-wider">
          + Adicionar email
        </h2>
        <form onSubmit={adicionar} className="flex flex-col sm:flex-row gap-2">
          <input
            type="email"
            value={novoEmail}
            onChange={(e) => setNovoEmail(e.target.value)}
            placeholder="email@exemplo.com"
            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-white/30 text-sm focus:outline-none focus:border-emerald-500/50"
            required
          />
          <input
            type="text"
            value={novoNome}
            onChange={(e) => setNovoNome(e.target.value)}
            placeholder="Nome (opcional)"
            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-white/30 text-sm focus:outline-none focus:border-emerald-500/50"
          />
          <button
            type="submit"
            disabled={adicionando}
            className="bg-emerald-600 hover:bg-emerald-500 disabled:bg-white/10 disabled:text-white/30 text-white font-semibold px-6 py-2.5 rounded-xl text-sm transition-colors"
          >
            {adicionando ? 'Adicionando...' : 'Adicionar'}
          </button>
        </form>
        {erro && <p className="text-red-400 text-xs mt-2">{erro}</p>}
        <p className="text-xs text-white/40 mt-3">
          💡 Adicione o email do administrador ou gestor. Você pode escolher abaixo quais notificações ele recebe.
        </p>
      </div>

      {/* Tabela */}
      {emails.length === 0 ? (
        <div className="bg-white/5 border border-white/10 rounded-2xl py-12 text-center text-white/40">
          <p className="text-3xl mb-3">📬</p>
          <p className="text-sm">Nenhum email cadastrado ainda.</p>
        </div>
      ) : (
        <div className="bg-white/3 border border-white/10 rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left px-5 py-3 text-white/50 font-semibold text-xs uppercase tracking-wider">
                  Email
                </th>
                <th className="text-center px-3 py-3 text-white/50 font-semibold text-xs uppercase tracking-wider">
                  Prazo expirado
                </th>
                <th className="text-center px-3 py-3 text-white/50 font-semibold text-xs uppercase tracking-wider">
                  Novo cadastro
                </th>
                <th className="text-center px-3 py-3 text-white/50 font-semibold text-xs uppercase tracking-wider">
                  Erros
                </th>
                <th className="text-right px-5 py-3 text-white/50 font-semibold text-xs uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody>
              {emails.map((e) => (
                <tr key={e.id} className="border-b border-white/5 last:border-b-0">
                  <td className="px-5 py-3.5">
                    <p className="font-semibold text-white">{e.nome || '—'}</p>
                    <p className="text-xs text-white/50">{e.email}</p>
                  </td>
                  <td className="px-3 py-3.5 text-center">
                    <Toggle
                      ativo={e.notif_prazo_expirado}
                      onChange={(v) => alternarToggle(e.id, 'notif_prazo_expirado', v)}
                    />
                  </td>
                  <td className="px-3 py-3.5 text-center">
                    <Toggle
                      ativo={e.notif_novo_cadastro}
                      onChange={(v) => alternarToggle(e.id, 'notif_novo_cadastro', v)}
                    />
                  </td>
                  <td className="px-3 py-3.5 text-center">
                    <Toggle
                      ativo={e.notif_erros}
                      onChange={(v) => alternarToggle(e.id, 'notif_erros', v)}
                    />
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <button
                      onClick={() => excluir(e.id, e.email)}
                      className="text-xs text-red-400 hover:text-red-300 transition-colors"
                    >
                      Remover
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

function Toggle({ ativo, onChange }: { ativo: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!ativo)}
      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
        ativo ? 'bg-emerald-500' : 'bg-white/15'
      }`}
    >
      <span
        className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
          ativo ? 'translate-x-5' : 'translate-x-1'
        }`}
      />
    </button>
  )
}
