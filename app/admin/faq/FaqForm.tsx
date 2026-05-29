'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Assunto {
  id: string
  nome: string
}

interface FaqData {
  id: string
  categoria: string
  pergunta: string
  resposta: string
  ordem: number
  ativo: boolean
  assunto_id: string | null
  tipo?: 'base' | 'faq'
}

interface Props {
  faq?: FaqData
  assuntos: Assunto[]
  // 'base' = Base de Conhecimento, 'faq' = FAQ. Default 'faq' (mantém compat. com URL atual)
  tipo?: 'base' | 'faq'
}

const categorias = [
  { value: 'amortizacao', label: 'Amortização' },
  { value: 'atualizacao', label: 'Atualização Monetária' },
  { value: 'geral', label: 'Geral' },
]

export function FaqForm({ faq, assuntos: assuntosIniciais, tipo = 'faq' }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState('')
  const tipoEfetivo = faq?.tipo ?? tipo
  const rotaLista = tipoEfetivo === 'base' ? '/admin/base-conhecimento' : '/admin/faq'

  const [categoria, setCategoria] = useState(faq?.categoria ?? 'geral')
  const [pergunta, setPergunta] = useState(faq?.pergunta ?? '')
  const [resposta, setResposta] = useState(faq?.resposta ?? '')
  const [ordem, setOrdem] = useState(String(faq?.ordem ?? 0))
  const [ativo, setAtivo] = useState(faq?.ativo ?? true)
  const [assuntoId, setAssuntoId] = useState(faq?.assunto_id ?? '')

  const [assuntos, setAssuntos] = useState<Assunto[]>(assuntosIniciais)
  const [novoAssunto, setNovoAssunto] = useState('')
  const [criandoAssunto, setCriandoAssunto] = useState(false)
  const [showNovoAssunto, setShowNovoAssunto] = useState(false)

  const isEdit = !!faq

  async function handleCriarAssunto() {
    if (!novoAssunto.trim()) return
    setCriandoAssunto(true)
    const res = await fetch('/api/admin/faq/assuntos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome: novoAssunto.trim(), tipo: tipoEfetivo }),
    })
    setCriandoAssunto(false)
    if (res.ok) {
      const novo = await res.json()
      setAssuntos((prev) => [...prev, novo].sort((a, b) => a.nome.localeCompare(b.nome)))
      setAssuntoId(novo.id)
      setNovoAssunto('')
      setShowNovoAssunto(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErro('')
    setLoading(true)

    const payload = {
      categoria,
      pergunta,
      resposta,
      ordem: parseInt(ordem) || 0,
      ativo,
      assunto_id: assuntoId || null,
      tipo: tipoEfetivo,
    }

    const res = isEdit
      ? await fetch(`/api/admin/faq/${faq.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
      : await fetch('/api/admin/faq', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })

    setLoading(false)

    if (res.ok) {
      router.push(rotaLista)
      router.refresh()
    } else {
      const data = await res.json()
      setErro(data.error ?? 'Erro ao salvar.')
    }
  }

  const inputClass = "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-emerald-500/50 transition-colors"
  const labelClass = "text-xs text-white/60 uppercase tracking-wider mb-2 block"

  return (
    <form onSubmit={handleSubmit} className="space-y-5">

      {/* Assunto (campo pai) */}
      <div>
        <label className={labelClass}>Assunto</label>
        <div className="flex gap-2">
          <select
            value={assuntoId}
            onChange={(e) => setAssuntoId(e.target.value)}
            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500/50 transition-colors appearance-none cursor-pointer"
          >
            <option value="" className="bg-[#111] text-white/50">— Sem assunto —</option>
            {assuntos.map((a) => (
              <option key={a.id} value={a.id} className="bg-[#111] text-white">{a.nome}</option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => setShowNovoAssunto(!showNovoAssunto)}
            className="px-4 py-3 rounded-xl text-sm border border-dashed border-white/20 text-white/40 hover:text-white hover:border-white/40 transition-all cursor-pointer whitespace-nowrap"
          >
            + Novo
          </button>
        </div>

        {showNovoAssunto && (
          <div className="flex gap-2 mt-2">
            <input
              type="text"
              value={novoAssunto}
              onChange={(e) => setNovoAssunto(e.target.value)}
              placeholder="Nome do novo assunto..."
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleCriarAssunto() } }}
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-white/30 text-sm focus:outline-none focus:border-emerald-500/50 transition-colors"
            />
            <button
              type="button"
              onClick={handleCriarAssunto}
              disabled={criandoAssunto || !novoAssunto.trim()}
              className="px-4 py-2.5 rounded-xl text-sm font-semibold bg-emerald-600 hover:bg-emerald-500 disabled:bg-white/10 disabled:text-white/30 text-white transition-colors"
            >
              {criandoAssunto ? '...' : 'Criar'}
            </button>
          </div>
        )}
      </div>

      {/* Categoria */}
      <div>
        <label className={labelClass}>Categoria</label>
        <div className="flex gap-2 flex-wrap">
          {categorias.map((c) => (
            <button
              key={c.value}
              type="button"
              onClick={() => setCategoria(c.value)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-all cursor-pointer ${
                categoria === c.value
                  ? 'bg-emerald-600 border-emerald-500 text-white'
                  : 'bg-white/5 border-white/10 text-white/55 hover:text-white hover:bg-white/10'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Pergunta */}
      <div>
        <label className={labelClass}>Pergunta</label>
        <input
          type="text"
          value={pergunta}
          onChange={(e) => setPergunta(e.target.value)}
          placeholder="Ex: Como calcular o CET de um financiamento?"
          required
          className={inputClass}
        />
      </div>

      {/* Resposta */}
      <div>
        <label className={labelClass}>Resposta</label>
        <textarea
          value={resposta}
          onChange={(e) => setResposta(e.target.value)}
          placeholder="Escreva a resposta completa aqui..."
          required
          rows={6}
          className={`${inputClass} resize-y`}
        />
      </div>

      {/* Ordem e Ativo */}
      <div className="flex gap-4 items-end">
        <div className="w-28">
          <label className={labelClass}>Ordem</label>
          <input
            type="number"
            value={ordem}
            onChange={(e) => setOrdem(e.target.value)}
            min={0}
            className={inputClass}
          />
        </div>
        <label className="flex items-center gap-2 cursor-pointer pb-3">
          <input
            type="checkbox"
            checked={ativo}
            onChange={(e) => setAtivo(e.target.checked)}
            className="w-4 h-4 accent-emerald-500"
          />
          <span className="text-sm text-white/70">Publicar (visível no site)</span>
        </label>
      </div>

      {erro && <p className="text-red-400 text-sm">{erro}</p>}

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="bg-emerald-600 hover:bg-emerald-500 disabled:bg-white/10 disabled:text-white/30 text-white font-bold px-6 py-3 rounded-xl transition-all text-sm cursor-pointer"
        >
          {loading ? 'Salvando...' : isEdit ? 'Salvar alterações →' : 'Criar pergunta →'}
        </button>
        <button
          type="button"
          onClick={() => router.push(rotaLista)}
          className="bg-white/5 hover:bg-white/10 border border-white/10 text-white/60 hover:text-white font-medium px-6 py-3 rounded-xl transition-all text-sm cursor-pointer"
        >
          Cancelar
        </button>
      </div>
    </form>
  )
}
