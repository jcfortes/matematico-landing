'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { DropdownAcoes, IconPencil, IconTrash } from '@/app/admin/_components/DropdownAcoes'

interface User {
  id: string
  email: string
  nome: string
  role: string
  status: string
  created_at: string
  last_sign_in_at: string | null
}

const STATUS_OPCOES = [
  { value: 'cliente',    label: 'Cliente',    cor: 'bg-blue-500/15 text-blue-400 border-blue-500/30' },
  { value: 'assinante',  label: 'Assinante',  cor: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' },
  { value: 'inativo',    label: 'Inativo',    cor: 'bg-white/5 text-white/30 border-white/10' },
]

function badgeStatus(status: string) {
  const s = STATUS_OPCOES.find((o) => o.value === status) ?? STATUS_OPCOES[0]
  return (
    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${s.cor}`}>
      {s.label}
    </span>
  )
}

function formatDate(dateStr: string | null) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('pt-BR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
  })
}

function ModalEditar({ user, onClose }: { user: User; onClose: () => void }) {
  const router = useRouter()
  const [nome, setNome] = useState(user.nome)
  const [email, setEmail] = useState(user.email)
  const [status, setStatus] = useState(user.status ?? 'cliente')
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState('')

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 px-4">
      <div className="bg-[#111] border border-white/10 rounded-2xl p-6 w-full max-w-sm">
        <h2 className="text-white font-bold mb-4">Editar contratante</h2>
        <div className="space-y-4">
          <div>
            <label className="text-xs text-white/60 uppercase tracking-wider mb-2 block">Nome</label>
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Nome completo"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-white/30 text-sm focus:outline-none focus:border-emerald-500/50 transition-colors"
            />
          </div>
          <div>
            <label className="text-xs text-white/60 uppercase tracking-wider mb-2 block">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-white/30 text-sm focus:outline-none focus:border-emerald-500/50 transition-colors"
            />
          </div>
          <div>
            <label className="text-xs text-white/60 uppercase tracking-wider mb-2 block">Status</label>
            <div className="flex gap-2">
              {STATUS_OPCOES.map((s) => (
                <button
                  key={s.value}
                  type="button"
                  onClick={() => setStatus(s.value)}
                  className={`flex-1 py-2 rounded-xl text-xs font-semibold border transition-all ${
                    status === s.value
                      ? s.cor
                      : 'bg-white/5 border-white/10 text-white/40 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
          {erro && <p className="text-red-400 text-sm">{erro}</p>}
          <div className="flex gap-2 pt-1">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl text-sm text-white/50 hover:text-white border border-white/10 hover:border-white/20 transition-colors"
            >
              Cancelar
            </button>
            <button
              disabled={loading}
              onClick={async () => {
                setLoading(true); setErro('')
                const res = await fetch('/api/admin/contratantes', {
                  method: 'PATCH',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ id: user.id, nome, email, status }),
                })
                setLoading(false)
                if (res.ok) { onClose(); router.refresh() }
                else { const d = await res.json(); setErro(d.error ?? 'Erro ao salvar.') }
              }}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-emerald-600 hover:bg-emerald-500 disabled:bg-white/10 disabled:text-white/30 text-white transition-colors"
            >
              {loading ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function ModalExcluir({ user, onClose }: { user: User; onClose: () => void }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState('')

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 px-4">
      <div className="bg-[#111] border border-white/10 rounded-2xl p-6 w-full max-w-sm">
        <h2 className="text-white font-bold mb-2">Excluir contratante</h2>
        <p className="text-white/50 text-sm mb-5">
          Tem certeza que deseja excluir <span className="text-white font-medium">{user.email}</span>? Esta ação não pode ser desfeita.
        </p>
        {erro && <p className="text-red-400 text-sm mb-3">{erro}</p>}
        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl text-sm text-white/50 hover:text-white border border-white/10 hover:border-white/20 transition-colors"
          >
            Cancelar
          </button>
          <button
            disabled={loading}
            onClick={async () => {
              setLoading(true); setErro('')
              const res = await fetch('/api/admin/contratantes', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: user.id }),
              })
              setLoading(false)
              if (res.ok) { onClose(); router.refresh() }
              else { const d = await res.json(); setErro(d.error ?? 'Erro ao excluir.') }
            }}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-red-600 hover:bg-red-500 disabled:bg-white/10 disabled:text-white/30 text-white transition-colors"
          >
            {loading ? 'Excluindo...' : 'Excluir'}
          </button>
        </div>
      </div>
    </div>
  )
}

export function ContratantesClient({ users }: { users: User[] }) {
  const [busca, setBusca] = useState('')
  const [filtroStatus, setFiltroStatus] = useState<string>('todos')
  const [editando, setEditando] = useState<User | null>(null)
  const [excluindo, setExcluindo] = useState<User | null>(null)

  const filtrados = users.filter((u) => {
    const matchBusca = u.email.toLowerCase().includes(busca.toLowerCase()) ||
      u.nome.toLowerCase().includes(busca.toLowerCase())
    const matchStatus = filtroStatus === 'todos' || u.status === filtroStatus
    return matchBusca && matchStatus
  })

  const contadores = {
    todos: users.length,
    cliente: users.filter((u) => u.status === 'cliente').length,
    assinante: users.filter((u) => u.status === 'assinante').length,
    inativo: users.filter((u) => u.status === 'inativo').length,
  }

  return (
    <div>
      {editando && <ModalEditar user={editando} onClose={() => setEditando(null)} />}
      {excluindo && <ModalExcluir user={excluindo} onClose={() => setExcluindo(null)} />}

      {/* Filtros de status */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {[
          { key: 'todos', label: `Todos (${contadores.todos})` },
          { key: 'cliente', label: `Clientes (${contadores.cliente})` },
          { key: 'assinante', label: `Assinantes (${contadores.assinante})` },
          { key: 'inativo', label: `Inativos (${contadores.inativo})` },
        ].map((f) => (
          <button
            key={f.key}
            onClick={() => setFiltroStatus(f.key)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
              filtroStatus === f.key
                ? 'bg-emerald-600 border-emerald-500 text-white hover:bg-emerald-500'
                : 'bg-white/5 border-emerald-500/40 text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10 hover:border-emerald-400'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Busca */}
      <div className="mb-4">
        <input
          type="text"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          placeholder="Buscar por nome ou email..."
          className="w-full max-w-sm bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-white/30 text-sm focus:outline-none focus:border-emerald-500/50 transition-colors"
        />
      </div>

      {/* Tabela */}
      <div className="border border-white/10 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
        <table className="w-full text-sm min-w-[560px]">
          <thead>
            <tr className="border-b border-white/10 bg-white/3">
              <th className="text-left px-5 py-3 text-white/50 font-semibold text-xs uppercase tracking-wider">Nome / Email</th>
              <th className="text-left px-5 py-3 text-white/50 font-semibold text-xs uppercase tracking-wider">Status</th>
              <th className="text-left px-5 py-3 text-white/50 font-semibold text-xs uppercase tracking-wider">Cadastro</th>
              <th className="text-left px-5 py-3 text-white/50 font-semibold text-xs uppercase tracking-wider">Último acesso</th>
              <th className="text-right px-5 py-3 text-white/50 font-semibold text-xs uppercase tracking-wider">Ações</th>
            </tr>
          </thead>
          <tbody>
            {filtrados.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-8 text-white/30 text-sm">
                  Nenhum resultado encontrado.
                </td>
              </tr>
            ) : (
              filtrados.map((user) => (
                <tr key={user.id} className="border-b border-white/5 last:border-0 hover:bg-white/2 transition-colors">
                  <td className="px-5 py-3.5">
                    <p className="text-white font-medium">{user.nome || '—'}</p>
                    <p className="text-white/40 text-xs mt-0.5">{user.email}</p>
                  </td>
                  <td className="px-5 py-3.5">{badgeStatus(user.status ?? 'cliente')}</td>
                  <td className="px-5 py-3.5 text-white/50">{formatDate(user.created_at)}</td>
                  <td className="px-5 py-3.5 text-white/50">{formatDate(user.last_sign_in_at)}</td>
                  <td className="px-5 py-3.5 text-right">
                    <DropdownAcoes itens={[
                      { label: 'Editar', icon: <IconPencil />, onClick: () => setEditando(user) },
                      { separator: true, label: '', onClick: () => {} },
                      { label: 'Excluir', icon: <IconTrash />, onClick: () => setExcluindo(user), danger: true },
                    ]} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        </div>
      </div>

      {(busca || filtroStatus !== 'todos') && (
        <p className="text-white/30 text-xs mt-3">
          {filtrados.length} de {users.length} usuário{users.length !== 1 ? 's' : ''}
        </p>
      )}
    </div>
  )
}
