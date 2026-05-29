'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface AppData {
  id?: string
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

const STATUS_OPCOES = [
  { v: 'ativo',  l: 'Ativo (botão funcional)' },
  { v: 'breve',  l: 'Em breve (botão desabilitado)' },
  { v: 'oculto', l: 'Oculto (não aparece na home)' },
]

export function AppForm({ app }: { app?: AppData }) {
  const router = useRouter()
  const isEdit = !!app

  const [slug, setSlug] = useState(app?.slug ?? '')
  const [ordem, setOrdem] = useState(String(app?.ordem ?? 0))
  const [status, setStatus] = useState<'ativo' | 'breve' | 'oculto'>(app?.status ?? 'ativo')
  const [emoji, setEmoji] = useState(app?.emoji ?? '')
  const [tagline, setTagline] = useState(app?.tagline ?? '')
  const [nome, setNome] = useState(app?.nome ?? '')
  const [descricao, setDescricao] = useState(app?.descricao ?? '')
  const [url, setUrl] = useState(app?.url ?? '')
  const [recursos, setRecursos] = useState<string[]>(app?.recursos ?? [''])

  const [salvando, setSalvando] = useState(false)
  const [erro, setErro] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErro('')
    if (!nome.trim() || !slug.trim()) {
      setErro('Slug e nome são obrigatórios.')
      return
    }
    setSalvando(true)

    const payload = {
      slug: slug.trim(),
      ordem: parseInt(ordem) || 0,
      status,
      emoji: emoji.trim() || null,
      tagline: tagline.trim() || null,
      nome: nome.trim(),
      descricao: descricao.trim() || null,
      url: url.trim() || null,
      recursos: recursos.map((r) => r.trim()).filter(Boolean),
    }

    try {
      const res = isEdit
        ? await fetch(`/api/admin/landing/apps/${app.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          })
        : await fetch('/api/admin/landing/apps', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error ?? 'Erro ao salvar')
      router.push('/admin/landing/apps')
      router.refresh()
    } catch (e) {
      setErro(e instanceof Error ? e.message : 'Erro ao salvar')
    } finally {
      setSalvando(false)
    }
  }

  function setRecurso(idx: number, v: string) {
    setRecursos((prev) => prev.map((r, i) => (i === idx ? v : r)))
  }
  function addRecurso() { setRecursos((prev) => [...prev, '']) }
  function removeRecurso(idx: number) {
    setRecursos((prev) => prev.filter((_, i) => i !== idx))
  }

  const inputBase = 'w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-emerald-500/50 transition-colors'
  const labelBase = 'text-xs text-white/60 uppercase tracking-wider mb-2 block font-semibold'

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className={labelBase}>Slug *</label>
          <input
            type="text"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="ex: avaliacao"
            className={`${inputBase} text-sm`}
            disabled={isEdit}
            required
          />
          {isEdit && <p className="text-[10px] text-white/35 mt-1">Slug não pode ser alterado após criar</p>}
        </div>
        <div>
          <label className={labelBase}>Ordem</label>
          <input
            type="number"
            value={ordem}
            onChange={(e) => setOrdem(e.target.value)}
            className={`${inputBase} text-sm`}
          />
          <p className="text-[10px] text-white/35 mt-1">Menor valor aparece primeiro</p>
        </div>
        <div>
          <label className={labelBase}>Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as 'ativo' | 'breve' | 'oculto')}
            className={`${inputBase} text-sm cursor-pointer`}
          >
            {STATUS_OPCOES.map((o) => (
              <option key={o.v} value={o.v}>{o.l}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-[80px_1fr] gap-4">
        <div>
          <label className={labelBase}>Emoji</label>
          <input
            type="text"
            value={emoji}
            onChange={(e) => setEmoji(e.target.value)}
            placeholder="📊"
            className={`${inputBase} text-2xl text-center`}
          />
        </div>
        <div>
          <label className={labelBase}>Nome *</label>
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Sistema de Atualização Monetária"
            className={`${inputBase} text-sm`}
            required
          />
        </div>
      </div>

      <div>
        <label className={labelBase}>Tagline (uppercase, pequena, acima do nome)</label>
        <input
          type="text"
          value={tagline}
          onChange={(e) => setTagline(e.target.value)}
          placeholder="ATUALIZAÇÃO DE VALORES"
          className={`${inputBase} text-sm`}
        />
      </div>

      <div>
        <label className={labelBase}>Descrição</label>
        <textarea
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          placeholder="Texto descritivo do app..."
          rows={3}
          className={`${inputBase} text-sm leading-relaxed resize-y`}
        />
      </div>

      <div>
        <label className={labelBase}>URL do app (ativo precisa ter)</label>
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://atualizacao.matematico.com.br"
          className={`${inputBase} text-sm`}
        />
      </div>

      <div>
        <label className={labelBase}>Recursos (lista com ✓)</label>
        <div className="space-y-2">
          {recursos.map((r, idx) => (
            <div key={idx} className="flex gap-2">
              <input
                type="text"
                value={r}
                onChange={(e) => setRecurso(idx, e.target.value)}
                placeholder="Ex: IPCA, IGPM, INPC"
                className={`${inputBase} text-sm flex-1`}
              />
              <button
                type="button"
                onClick={() => removeRecurso(idx)}
                disabled={recursos.length <= 1}
                className="text-xs bg-red-500/10 hover:bg-red-500/20 disabled:opacity-30 border border-red-500/20 text-red-300 px-3 rounded-lg transition-colors"
              >
                Remover
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addRecurso}
            className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold transition-colors"
          >
            + Adicionar recurso
          </button>
        </div>
      </div>

      {erro && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-sm text-red-300">
          {erro}
        </div>
      )}

      <div className="flex gap-2 justify-end pt-4">
        <button
          type="button"
          onClick={() => router.push('/admin/landing/apps')}
          disabled={salvando}
          className="text-sm bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white px-5 py-2.5 rounded-xl transition-colors"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={salvando}
          className="text-sm bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white font-bold px-6 py-2.5 rounded-xl transition-colors"
        >
          {salvando ? 'Salvando...' : isEdit ? 'Salvar alterações' : 'Criar app'}
        </button>
      </div>
    </form>
  )
}
