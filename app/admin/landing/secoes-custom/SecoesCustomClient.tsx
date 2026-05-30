'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface SecaoCustom {
  id: string
  slug: string
  titulo: string
  subtitulo: string | null
  descricao: string | null
  imagem_url: string | null
  imagem_posicao: string
  cta_texto: string | null
  cta_url: string | null
  posicao_apos: string
  ordem: number
  oculta: boolean
}

const POSICOES = [
  { v: 'hero', l: 'Após Hero' },
  { v: 'simulador', l: 'Após Simulador' },
  { v: 'apps', l: 'Após Apps' },
  { v: 'diferenciais', l: 'Após Diferenciais' },
  { v: 'cta', l: 'Após CTA' },
  { v: 'base_faq', l: 'Após Base/FAQ' },
  { v: 'contato', l: 'Após Contato' },
  { v: 'fim', l: 'No final (antes do rodapé)' },
]

const POSICOES_IMG = [
  { v: 'sem', l: 'Sem imagem (só texto)' },
  { v: 'topo', l: 'Imagem no topo' },
  { v: 'esquerda', l: 'Imagem à esquerda, texto à direita' },
  { v: 'direita', l: 'Texto à esquerda, imagem à direita' },
]

function labelPosicao(v: string) {
  return POSICOES.find((p) => p.v === v)?.l ?? v
}

const inputBase = 'w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-white/30 text-sm focus:outline-none focus:border-emerald-500/50 transition-colors'

export function SecoesCustomClient({ secoes }: { secoes: SecaoCustom[] }) {
  const router = useRouter()
  const [editando, setEditando] = useState<SecaoCustom | null>(null)
  const [criando, setCriando] = useState(false)

  async function alternarOculta(s: SecaoCustom) {
    await fetch('/api/admin/landing/secoes-custom', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: s.id, oculta: !s.oculta }),
    })
    router.refresh()
  }

  async function excluir(s: SecaoCustom) {
    if (!confirm(`Excluir a seção "${s.titulo}"? Não pode ser desfeito.`)) return
    await fetch('/api/admin/landing/secoes-custom', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: s.id }),
    })
    router.refresh()
  }

  return (
    <div className="space-y-6">
      <div>
        <button
          onClick={() => setCriando(true)}
          className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors"
        >
          + Nova seção
        </button>
      </div>

      {secoes.length === 0 ? (
        <div className="bg-white/5 border border-white/10 rounded-2xl py-12 text-center text-white/40">
          <p className="text-3xl mb-3">📄</p>
          <p className="text-sm">Nenhuma seção customizada criada ainda.</p>
          <p className="text-xs mt-1">Use o botão acima pra criar.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {secoes.map((s) => (
            <div
              key={s.id}
              className={`border rounded-2xl p-5 ${s.oculta ? 'border-amber-500/30 bg-amber-500/5 opacity-70' : 'border-white/10 bg-white/3'}`}
            >
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <h3 className="font-bold text-white">{s.titulo}</h3>
                    {s.oculta && (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 uppercase tracking-wider">
                        Oculta
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-white/40">
                    {labelPosicao(s.posicao_apos)} · ordem {s.ordem} · /<code>{s.slug}</code>
                  </p>
                  {s.descricao && (
                    <p className="text-sm text-white/60 mt-2 line-clamp-2">{s.descricao}</p>
                  )}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => alternarOculta(s)}
                    className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-white/15 text-white/70 hover:text-white hover:border-white/30 hover:bg-white/5 transition-colors"
                  >
                    {s.oculta ? '👁 Mostrar' : '🚫 Ocultar'}
                  </button>
                  <button
                    onClick={() => setEditando(s)}
                    className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-emerald-600/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-600/30 transition-colors"
                  >
                    ✏ Editar
                  </button>
                  <button
                    onClick={() => excluir(s)}
                    className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors"
                  >
                    🗑
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {(criando || editando) && (
        <ModalSecao
          secao={editando}
          onClose={() => { setCriando(false); setEditando(null) }}
        />
      )}
    </div>
  )
}

function ModalSecao({ secao, onClose }: { secao: SecaoCustom | null; onClose: () => void }) {
  const router = useRouter()
  const editando = !!secao
  const [titulo, setTitulo] = useState(secao?.titulo ?? '')
  const [subtitulo, setSubtitulo] = useState(secao?.subtitulo ?? '')
  const [descricao, setDescricao] = useState(secao?.descricao ?? '')
  const [imagemUrl, setImagemUrl] = useState(secao?.imagem_url ?? '')
  const [imagemPosicao, setImagemPosicao] = useState(secao?.imagem_posicao ?? 'sem')
  const [uploadando, setUploadando] = useState(false)
  const [erroUpload, setErroUpload] = useState('')

  async function handleUpload(arquivo: File) {
    setUploadando(true); setErroUpload('')
    const formData = new FormData()
    formData.append('file', arquivo)
    try {
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      })
      const data = await res.json()
      if (!res.ok) {
        setErroUpload(data.error ?? 'Erro ao enviar')
      } else {
        setImagemUrl(data.url)
        // Se imagem_posicao é 'sem', muda pra 'topo' por padrão
        if (imagemPosicao === 'sem') setImagemPosicao('topo')
      }
    } catch (err) {
      setErroUpload(err instanceof Error ? err.message : 'Erro de rede')
    } finally {
      setUploadando(false)
    }
  }
  const [ctaTexto, setCtaTexto] = useState(secao?.cta_texto ?? '')
  const [ctaUrl, setCtaUrl] = useState(secao?.cta_url ?? '')
  const [posicaoApos, setPosicaoApos] = useState(secao?.posicao_apos ?? 'cta')
  const [ordem, setOrdem] = useState(secao?.ordem ?? 0)
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState('')

  async function salvar() {
    setLoading(true); setErro('')
    const corpo = {
      ...(editando ? { id: secao!.id } : {}),
      titulo, subtitulo, descricao,
      imagem_url: imagemUrl, imagem_posicao: imagemPosicao,
      cta_texto: ctaTexto, cta_url: ctaUrl,
      posicao_apos: posicaoApos, ordem: Number(ordem),
    }
    const res = await fetch('/api/admin/landing/secoes-custom', {
      method: editando ? 'PATCH' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(corpo),
    })
    setLoading(false)
    if (res.ok) { onClose(); router.refresh() }
    else { const d = await res.json(); setErro(d.error ?? 'Erro ao salvar') }
  }

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 px-4 py-8 overflow-y-auto">
      <div className="bg-[#111] border border-white/10 rounded-2xl p-6 w-full max-w-xl my-auto">
        <h2 className="text-white font-bold text-lg mb-4">
          {editando ? 'Editar seção' : 'Nova seção customizada'}
        </h2>

        <div className="space-y-4">
          <div>
            <label className="text-xs text-white/60 uppercase tracking-wider mb-2 block">Título *</label>
            <input
              type="text"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder="Ex: Promoção de Lançamento"
              className={inputBase}
            />
          </div>

          <div>
            <label className="text-xs text-white/60 uppercase tracking-wider mb-2 block">Subtítulo (acima do título)</label>
            <input
              type="text"
              value={subtitulo}
              onChange={(e) => setSubtitulo(e.target.value)}
              placeholder="Ex: NOVIDADE"
              className={inputBase}
            />
          </div>

          <div>
            <label className="text-xs text-white/60 uppercase tracking-wider mb-2 block">Descrição</label>
            <textarea
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              rows={4}
              placeholder="Texto principal da seção. Quebras de linha são preservadas."
              className={inputBase}
            />
          </div>

          {/* ── Imagem (upload OU URL externa) ── */}
          <div className="border border-white/10 rounded-xl p-3 space-y-3">
            <label className="text-xs text-white/60 uppercase tracking-wider block">Imagem (opcional)</label>

            {/* Preview se já tem */}
            {imagemUrl && (
              <div className="relative">
                <img
                  src={imagemUrl}
                  alt="Preview"
                  className="rounded-lg border border-white/10 max-h-40 w-auto mx-auto"
                />
                <button
                  type="button"
                  onClick={() => setImagemUrl('')}
                  className="absolute top-2 right-2 bg-red-500/80 hover:bg-red-500 text-white text-xs px-2 py-1 rounded-md"
                  title="Remover imagem"
                >
                  ✕ Remover
                </button>
              </div>
            )}

            {/* Botão upload */}
            <div>
              <label className={`flex items-center justify-center gap-2 cursor-pointer border-2 border-dashed border-emerald-500/30 hover:border-emerald-500/60 hover:bg-emerald-500/5 rounded-xl py-3 px-4 text-sm text-emerald-300 transition-colors ${uploadando ? 'opacity-50 cursor-wait' : ''}`}>
                {uploadando ? '⏳ Enviando...' : '📁 Enviar arquivo do meu computador'}
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/gif"
                  disabled={uploadando}
                  onChange={(e) => {
                    const f = e.target.files?.[0]
                    if (f) handleUpload(f)
                    e.target.value = '' // permite re-upload do mesmo arquivo
                  }}
                  className="hidden"
                />
              </label>
              <p className="text-[10px] text-white/40 mt-1.5 text-center">
                PNG, JPG, WebP ou GIF · até 5MB
              </p>
              {erroUpload && (
                <p className="text-xs text-red-400 mt-1">{erroUpload}</p>
              )}
            </div>

            {/* OU URL externa */}
            <div className="relative flex items-center gap-2">
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-[10px] text-white/40 uppercase tracking-wider">ou</span>
              <div className="flex-1 h-px bg-white/10" />
            </div>

            <div>
              <label className="text-[10px] text-white/40 uppercase tracking-wider mb-1.5 block">
                Cole uma URL externa (ImgBB, Imgur, etc.)
              </label>
              <input
                type="url"
                value={imagemUrl}
                onChange={(e) => setImagemUrl(e.target.value)}
                placeholder="https://..."
                className={inputBase}
              />
            </div>

            {/* Posição */}
            <div>
              <label className="text-[10px] text-white/40 uppercase tracking-wider mb-1.5 block">
                Posição da imagem no layout
              </label>
              <select
                value={imagemPosicao}
                onChange={(e) => setImagemPosicao(e.target.value)}
                className={inputBase + ' cursor-pointer'}
              >
                {POSICOES_IMG.map((p) => <option key={p.v} value={p.v}>{p.l}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-white/60 uppercase tracking-wider mb-2 block">Texto do botão CTA</label>
              <input
                type="text"
                value={ctaTexto}
                onChange={(e) => setCtaTexto(e.target.value)}
                placeholder="Ex: Saber mais"
                className={inputBase}
              />
            </div>
            <div>
              <label className="text-xs text-white/60 uppercase tracking-wider mb-2 block">URL do botão</label>
              <input
                type="url"
                value={ctaUrl}
                onChange={(e) => setCtaUrl(e.target.value)}
                placeholder="https://... ou #contato"
                className={inputBase}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-white/60 uppercase tracking-wider mb-2 block">Posição na landing *</label>
              <select
                value={posicaoApos}
                onChange={(e) => setPosicaoApos(e.target.value)}
                className={inputBase + ' cursor-pointer'}
              >
                {POSICOES.map((p) => <option key={p.v} value={p.v}>{p.l}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-white/60 uppercase tracking-wider mb-2 block">Ordem (menor = primeiro)</label>
              <input
                type="number"
                value={ordem}
                onChange={(e) => setOrdem(Number(e.target.value))}
                className={inputBase}
              />
            </div>
          </div>

          {erro && <p className="text-red-400 text-sm">{erro}</p>}

          <div className="flex gap-2 pt-2">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl text-sm text-white/50 hover:text-white border border-white/10 hover:border-white/20 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={salvar}
              disabled={loading || !titulo}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-emerald-600 hover:bg-emerald-500 disabled:bg-white/10 disabled:text-white/30 text-white transition-colors"
            >
              {loading ? 'Salvando...' : editando ? 'Salvar alterações' : 'Criar seção'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
