'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { DropdownAcoes, IconPencil, IconTrash } from '@/app/admin/_components/DropdownAcoes'

interface Membro {
  id: string
  email: string
  nome: string
  role: string
  created_at: string
  last_sign_in_at: string | null
}

function formatDate(dateStr: string | null) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('pt-BR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
  })
}

// ── Modal base ────────────────────────────────────────────────────────────────
function Modal({ title, children, onClose }: { title: string; children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 px-4">
      <div className="bg-[#111] border border-white/10 rounded-2xl p-6 w-full max-w-sm">
        <h2 className="text-white font-bold mb-4">{title}</h2>
        {children}
      </div>
    </div>
  )
}

// ── Modal Novo membro ─────────────────────────────────────────────────────────
function ModalNovo({ onClose }: { onClose: () => void }) {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [role, setRole] = useState<'administrador' | 'gestor'>('gestor')
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState('')

  return (
    <Modal title="Convidar membro" onClose={onClose}>
      <div className="space-y-4">
        <div>
          <label className="text-xs text-white/60 uppercase tracking-wider mb-2 block">Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
            placeholder="email@exemplo.com"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-white/30 text-sm focus:outline-none focus:border-emerald-500/50 transition-colors" />
        </div>
        <div>
          <label className="text-xs text-white/60 uppercase tracking-wider mb-2 block">Perfil</label>
          <div className="flex gap-2">
            {(['gestor', 'administrador'] as const).map((r) => (
              <button key={r} type="button" onClick={() => setRole(r)}
                className={`flex-1 py-2 rounded-xl text-sm font-semibold border transition-colors ${role === r ? 'bg-emerald-600 border-emerald-500 text-white' : 'bg-white/5 border-white/10 text-white/50 hover:bg-white/8'}`}>
                {r === 'gestor' ? 'Gestor' : 'Administrador'}
              </button>
            ))}
          </div>
        </div>
        {erro && <p className="text-red-400 text-sm">{erro}</p>}
        <div className="flex gap-2 pt-1">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl text-sm text-white/50 hover:text-white border border-white/10 transition-colors">Cancelar</button>
          <button disabled={loading}
            onClick={async () => {
              if (!email) { setErro('Informe o email.'); return }
              setLoading(true); setErro('')
              const res = await fetch('/api/admin/equipe', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, role }) })
              setLoading(false)
              if (res.ok) { onClose(); router.refresh() }
              else { const d = await res.json(); setErro(d.error ?? 'Erro ao criar.') }
            }}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-emerald-600 hover:bg-emerald-500 disabled:bg-white/10 disabled:text-white/30 text-white transition-colors">
            {loading ? 'Criando...' : 'Criar'}
          </button>
        </div>
      </div>
    </Modal>
  )
}

// ── Modal Editar ──────────────────────────────────────────────────────────────
function ModalEditar({ membro, onClose }: { membro: Membro; onClose: () => void }) {
  const router = useRouter()
  const [nome, setNome] = useState(membro.nome)
  const [email, setEmail] = useState(membro.email)
  const [role, setRole] = useState<'administrador' | 'gestor'>(membro.role as any)
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState('')

  return (
    <Modal title="Editar membro" onClose={onClose}>
      <div className="space-y-4">
        <div>
          <label className="text-xs text-white/60 uppercase tracking-wider mb-2 block">Nome</label>
          <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Nome completo"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-white/30 text-sm focus:outline-none focus:border-emerald-500/50 transition-colors" />
        </div>
        <div>
          <label className="text-xs text-white/60 uppercase tracking-wider mb-2 block">Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-white/30 text-sm focus:outline-none focus:border-emerald-500/50 transition-colors" />
        </div>
        <div>
          <label className="text-xs text-white/60 uppercase tracking-wider mb-2 block">Perfil</label>
          <div className="flex gap-2">
            {(['gestor', 'administrador'] as const).map((r) => (
              <button key={r} type="button" onClick={() => setRole(r)}
                className={`flex-1 py-2 rounded-xl text-sm font-semibold border transition-colors ${role === r ? 'bg-emerald-600 border-emerald-500 text-white' : 'bg-white/5 border-white/10 text-white/50 hover:bg-white/8'}`}>
                {r === 'gestor' ? 'Gestor' : 'Administrador'}
              </button>
            ))}
          </div>
        </div>
        {erro && <p className="text-red-400 text-sm">{erro}</p>}
        <div className="flex gap-2 pt-1">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl text-sm text-white/50 hover:text-white border border-white/10 transition-colors">Cancelar</button>
          <button disabled={loading}
            onClick={async () => {
              setLoading(true); setErro('')
              const res = await fetch('/api/admin/equipe', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: membro.id, nome, email, role }) })
              setLoading(false)
              if (res.ok) { onClose(); router.refresh() }
              else { const d = await res.json(); setErro(d.error ?? 'Erro ao salvar.') }
            }}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-emerald-600 hover:bg-emerald-500 disabled:bg-white/10 disabled:text-white/30 text-white transition-colors">
            {loading ? 'Salvando...' : 'Salvar'}
          </button>
        </div>
      </div>
    </Modal>
  )
}

// ── Modal Excluir ─────────────────────────────────────────────────────────────
function ModalExcluir({ membro, onClose }: { membro: Membro; onClose: () => void }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState('')

  return (
    <Modal title="Excluir membro" onClose={onClose}>
      <p className="text-white/50 text-sm mb-5">
        Tem certeza que deseja excluir <span className="text-white font-medium">{membro.nome || membro.email}</span>? Esta ação não pode ser desfeita.
      </p>
      {erro && <p className="text-red-400 text-sm mb-3">{erro}</p>}
      <div className="flex gap-2">
        <button onClick={onClose} className="flex-1 py-2.5 rounded-xl text-sm text-white/50 hover:text-white border border-white/10 transition-colors">Cancelar</button>
        <button disabled={loading}
          onClick={async () => {
            setLoading(true); setErro('')
            const res = await fetch('/api/admin/equipe', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: membro.id }) })
            setLoading(false)
            if (res.ok) { onClose(); router.refresh() }
            else { const d = await res.json(); setErro(d.error ?? 'Erro ao excluir.') }
          }}
          className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-red-600 hover:bg-red-500 disabled:bg-white/10 disabled:text-white/30 text-white transition-colors">
          {loading ? 'Excluindo...' : 'Excluir'}
        </button>
      </div>
    </Modal>
  )
}

// ── Tabela principal ──────────────────────────────────────────────────────────
export function EquipeTable({ membros }: { membros: Membro[] }) {
  const [busca, setBusca] = useState('')
  const [editando, setEditando] = useState<Membro | null>(null)
  const [excluindo, setExcluindo] = useState<Membro | null>(null)
  const [showNovo, setShowNovo] = useState(false)

  const filtrados = membros.filter((m) =>
    [m.nome, m.email, m.role].some((v) => v?.toLowerCase().includes(busca.toLowerCase()))
  )

  return (
    <>
      {showNovo && <ModalNovo onClose={() => setShowNovo(false)} />}
      {editando && <ModalEditar membro={editando} onClose={() => setEditando(null)} />}
      {excluindo && <ModalExcluir membro={excluindo} onClose={() => setExcluindo(null)} />}

      <div className="flex items-center justify-between mb-4">
        <input
          type="text"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          placeholder="Buscar por nome, email ou perfil..."
          className="w-full max-w-sm bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-white/30 text-sm focus:outline-none focus:border-emerald-500/50 transition-colors"
        />
        <button
          onClick={() => setShowNovo(true)}
          className="ml-4 shrink-0 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors"
        >
          + Novo membro
        </button>
      </div>

      <div className="border border-white/10 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
        <table className="w-full text-sm min-w-[520px]">
          <thead>
            <tr className="border-b border-white/10 bg-white/3">
              <th className="text-left px-5 py-3 text-white/50 font-semibold text-xs uppercase tracking-wider">Nome</th>
              <th className="text-left px-5 py-3 text-white/50 font-semibold text-xs uppercase tracking-wider">Email</th>
              <th className="text-left px-5 py-3 text-white/50 font-semibold text-xs uppercase tracking-wider">Perfil</th>
              <th className="text-left px-5 py-3 text-white/50 font-semibold text-xs uppercase tracking-wider">Cadastro</th>
              <th className="text-right px-5 py-3 text-white/50 font-semibold text-xs uppercase tracking-wider">Ações</th>
            </tr>
          </thead>
          <tbody>
            {filtrados.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-10 text-white/30 text-sm">
                  {busca ? 'Nenhum resultado encontrado.' : 'Nenhum membro cadastrado.'}
                </td>
              </tr>
            ) : (
              filtrados.map((m) => (
                <tr key={m.id} className="border-b border-white/5 last:border-0 hover:bg-white/2 transition-colors">
                  <td className="px-5 py-3.5 text-white font-medium">{m.nome || '—'}</td>
                  <td className="px-5 py-3.5 text-white/60">{m.email}</td>
                  <td className="px-5 py-3.5">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${
                      m.role === 'administrador'
                        ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20'
                        : 'bg-white/5 text-white/50 border-white/10'
                    }`}>
                      {m.role === 'administrador' ? 'Administrador' : 'Gestor'}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-white/50">{formatDate(m.created_at)}</td>
                  <td className="px-5 py-3.5 text-right">
                    <DropdownAcoes itens={[
                      { label: 'Editar', icon: <IconPencil />, onClick: () => setEditando(m) },
                      { separator: true, label: '', onClick: () => {} },
                      { label: 'Excluir', icon: <IconTrash />, onClick: () => setExcluindo(m), danger: true },
                    ]} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        </div>
      </div>

      {busca && (
        <p className="text-white/30 text-xs mt-3">
          {filtrados.length} de {membros.length} membro{membros.length !== 1 ? 's' : ''}
        </p>
      )}
    </>
  )
}
