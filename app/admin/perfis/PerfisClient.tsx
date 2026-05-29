'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { PAGINAS_ADMIN } from '@/lib/paginas-admin'
import { DropdownAcoes, IconPencil, IconTrash } from '@/app/admin/_components/DropdownAcoes'

interface Perfil {
  id: string
  nome: string
  label: string
  created_at: string
  permissoes: { pagina: string }[]
}

function Modal({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 px-4">
      <div className="bg-[#111] border border-white/10 rounded-2xl p-6 w-full max-w-md">
        <h2 className="text-white font-bold mb-5">{title}</h2>
        {children}
      </div>
    </div>
  )
}

function FormPerfil({
  inicial,
  onSalvar,
  onCancelar,
  loading,
  erro,
}: {
  inicial: { label: string; paginas: string[] }
  onSalvar: (label: string, paginas: string[]) => void
  onCancelar: () => void
  loading: boolean
  erro: string
}) {
  const [label, setLabel] = useState(inicial.label)
  const [paginas, setPaginas] = useState<string[]>(inicial.paginas)

  function togglePagina(slug: string) {
    setPaginas((prev) =>
      prev.includes(slug) ? prev.filter((p) => p !== slug) : [...prev, slug]
    )
  }

  return (
    <div className="space-y-5">
      <div>
        <label className="text-xs text-white/60 uppercase tracking-wider mb-2 block">Nome do perfil</label>
        <input
          type="text"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder="ex: Suporte, Financeiro..."
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-white/30 text-sm focus:outline-none focus:border-emerald-500/50 transition-colors"
        />
      </div>

      <div>
        <label className="text-xs text-white/60 uppercase tracking-wider mb-3 block">Páginas com acesso</label>
        <div className="space-y-2">
          {PAGINAS_ADMIN.map((p) => (
            <label
              key={p.slug}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl border cursor-pointer transition-colors ${
                paginas.includes(p.slug)
                  ? 'border-emerald-500/30 bg-emerald-500/8'
                  : 'border-white/8 bg-white/3 hover:bg-white/5'
              }`}
            >
              <input
                type="checkbox"
                checked={paginas.includes(p.slug)}
                onChange={() => togglePagina(p.slug)}
                className="accent-emerald-500 w-4 h-4"
              />
              <span className="text-sm text-white">{p.label}</span>
            </label>
          ))}
        </div>
      </div>

      {erro && <p className="text-red-400 text-sm">{erro}</p>}

      <div className="flex gap-2 pt-1">
        <button
          onClick={onCancelar}
          className="flex-1 py-2.5 rounded-xl text-sm text-white/50 hover:text-white border border-white/10 transition-colors"
        >
          Cancelar
        </button>
        <button
          disabled={loading}
          onClick={() => onSalvar(label, paginas)}
          className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-emerald-600 hover:bg-emerald-500 disabled:bg-white/10 disabled:text-white/30 text-white transition-colors"
        >
          {loading ? 'Salvando...' : 'Salvar'}
        </button>
      </div>
    </div>
  )
}

export function PerfisClient({ perfis }: { perfis: Perfil[] }) {
  const router = useRouter()
  const [showNovo, setShowNovo] = useState(false)
  const [editando, setEditando] = useState<Perfil | null>(null)
  const [excluindo, setExcluindo] = useState<Perfil | null>(null)
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState('')

  async function handleCriar(label: string, paginas: string[]) {
    if (!label.trim()) { setErro('Informe o nome do perfil.'); return }
    setLoading(true); setErro('')
    const res = await fetch('/api/admin/perfis', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome: label, label, paginas }),
    })
    setLoading(false)
    if (res.ok) { setShowNovo(false); router.refresh() }
    else { const d = await res.json(); setErro(d.error ?? 'Erro ao criar perfil.') }
  }

  async function handleEditar(label: string, paginas: string[]) {
    if (!label.trim()) { setErro('Informe o nome do perfil.'); return }
    setLoading(true); setErro('')
    const res = await fetch('/api/admin/perfis', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: editando!.id, label, paginas }),
    })
    setLoading(false)
    if (res.ok) { setEditando(null); router.refresh() }
    else { const d = await res.json(); setErro(d.error ?? 'Erro ao salvar.') }
  }

  async function handleExcluir() {
    setLoading(true); setErro('')
    const res = await fetch('/api/admin/perfis', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: excluindo!.id }),
    })
    setLoading(false)
    if (res.ok) { setExcluindo(null); router.refresh() }
    else { const d = await res.json(); setErro(d.error ?? 'Erro ao excluir.') }
  }

  return (
    <>
      {/* Modal Novo */}
      {showNovo && (
        <Modal title="Novo perfil">
          <FormPerfil
            inicial={{ label: '', paginas: [] }}
            onSalvar={handleCriar}
            onCancelar={() => { setShowNovo(false); setErro('') }}
            loading={loading}
            erro={erro}
          />
        </Modal>
      )}

      {/* Modal Editar */}
      {editando && (
        <Modal title="Editar perfil">
          <FormPerfil
            inicial={{
              label: editando.label,
              paginas: editando.permissoes.map((p) => p.pagina),
            }}
            onSalvar={handleEditar}
            onCancelar={() => { setEditando(null); setErro('') }}
            loading={loading}
            erro={erro}
          />
        </Modal>
      )}

      {/* Modal Excluir */}
      {excluindo && (
        <Modal title="Excluir perfil">
          <p className="text-white/50 text-sm mb-5">
            Tem certeza que deseja excluir o perfil <span className="text-white font-medium">{excluindo.label}</span>?
            Usuários com este perfil perderão o acesso ao painel.
          </p>
          {erro && <p className="text-red-400 text-sm mb-3">{erro}</p>}
          <div className="flex gap-2">
            <button
              onClick={() => { setExcluindo(null); setErro('') }}
              className="flex-1 py-2.5 rounded-xl text-sm text-white/50 hover:text-white border border-white/10 transition-colors"
            >
              Cancelar
            </button>
            <button
              disabled={loading}
              onClick={handleExcluir}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-red-600 hover:bg-red-500 disabled:bg-white/10 disabled:text-white/30 text-white transition-colors"
            >
              {loading ? 'Excluindo...' : 'Excluir'}
            </button>
          </div>
        </Modal>
      )}

      {/* Header com botão */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold">Perfis</h1>
          <p className="text-white/50 text-sm mt-1">
            {perfis.length} {perfis.length === 1 ? 'perfil cadastrado' : 'perfis cadastrados'}
          </p>
        </div>
        <button
          onClick={() => { setShowNovo(true); setErro('') }}
          className="bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors"
        >
          + Novo perfil
        </button>
      </div>

      {/* Tabela */}
      <div className="border border-white/10 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
        <table className="w-full text-sm min-w-[480px]">
          <thead>
            <tr className="border-b border-white/10 bg-white/3">
              <th className="text-left px-5 py-3 text-white/50 font-semibold text-xs uppercase tracking-wider">Perfil</th>
              <th className="text-left px-5 py-3 text-white/50 font-semibold text-xs uppercase tracking-wider">Identificador</th>
              <th className="text-left px-5 py-3 text-white/50 font-semibold text-xs uppercase tracking-wider">Páginas com acesso</th>
              <th className="text-right px-5 py-3 text-white/50 font-semibold text-xs uppercase tracking-wider">Ações</th>
            </tr>
          </thead>
          <tbody>
            {perfis.map((perfil) => (
              <tr key={perfil.id} className="border-b border-white/5 last:border-0 hover:bg-white/2 transition-colors">
                <td className="px-5 py-4">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${
                    perfil.nome === 'administrador'
                      ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20'
                      : 'bg-white/5 text-white/60 border-white/10'
                  }`}>
                    {perfil.label}
                  </span>
                </td>
                <td className="px-5 py-4 text-white/40 font-mono text-xs">{perfil.nome}</td>
                <td className="px-5 py-4">
                  <div className="flex flex-wrap gap-1.5">
                    {perfil.permissoes.length === 0 ? (
                      <span className="text-white/25 text-xs">Nenhum acesso</span>
                    ) : (
                      perfil.permissoes.map((p) => {
                        const pagina = PAGINAS_ADMIN.find((pg) => pg.slug === p.pagina)
                        return (
                          <span key={p.pagina} className="text-xs bg-white/5 border border-white/10 text-white/50 px-2 py-0.5 rounded-full">
                            {pagina?.label ?? p.pagina}
                          </span>
                        )
                      })
                    )}
                  </div>
                </td>
                <td className="px-5 py-4 text-right">
                  <DropdownAcoes itens={[
                    { label: 'Editar', icon: <IconPencil />, onClick: () => { setEditando(perfil); setErro('') } },
                    { separator: true, label: '', onClick: () => {}, hidden: perfil.nome === 'administrador' },
                    { label: 'Excluir', icon: <IconTrash />, onClick: () => { setExcluindo(perfil); setErro('') }, danger: true, hidden: perfil.nome === 'administrador' },
                  ]} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>
    </>
  )
}
