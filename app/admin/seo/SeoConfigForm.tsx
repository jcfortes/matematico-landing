'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Props {
  tituloInicial: string
  descricaoInicial: string
  googleVerifInicial: string
}

export function SeoConfigForm({ tituloInicial, descricaoInicial, googleVerifInicial }: Props) {
  const router = useRouter()
  const [titulo, setTitulo] = useState(tituloInicial)
  const [descricao, setDescricao] = useState(descricaoInicial)
  const [googleVerif, setGoogleVerif] = useState(googleVerifInicial)
  const [salvando, setSalvando] = useState(false)
  const [msg, setMsg] = useState<{ tipo: 'ok' | 'erro'; texto: string } | null>(null)

  const tituloMudou = titulo !== tituloInicial
  const descricaoMudou = descricao !== descricaoInicial
  const verifMudou = googleVerif !== googleVerifInicial
  const alterado = tituloMudou || descricaoMudou || verifMudou

  async function salvar() {
    if (!alterado) return
    setSalvando(true)
    setMsg(null)
    try {
      const items: { key: string; valor: string }[] = []
      if (tituloMudou) items.push({ key: 'seo.titulo', valor: titulo })
      if (descricaoMudou) items.push({ key: 'seo.descricao', valor: descricao })
      if (verifMudou) items.push({ key: 'seo.google_verification', valor: googleVerif.trim() })

      const res = await fetch('/api/admin/landing', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error ?? 'Erro ao salvar')
      setMsg({ tipo: 'ok', texto: 'Salvo. Hard refresh (Cmd+Shift+R) para o Google ver as mudanças.' })
      router.refresh()
    } catch (e) {
      setMsg({ tipo: 'erro', texto: e instanceof Error ? e.message : 'Erro ao salvar' })
    } finally {
      setSalvando(false)
    }
  }

  const inputBase = 'w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-emerald-500/50 transition-colors'
  const labelBase = 'text-xs text-white/60 uppercase tracking-wider mb-2 block font-semibold'

  return (
    <div className="border border-white/10 rounded-2xl p-6 bg-white/3 space-y-5">
      <h2 className="text-base font-bold text-emerald-400">⚙️ Configurações editáveis</h2>

      <div>
        <label className={labelBase}>
          Título do site
          {tituloMudou && <span className="ml-2 text-emerald-400">●</span>}
        </label>
        <input
          type="text"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          className={inputBase}
        />
        <p className="text-[11px] text-white/40 mt-1">
          Aparece na aba do navegador e como título nos resultados do Google. <strong>Limite recomendado: 60 caracteres.</strong> Atual: {titulo.length}
        </p>
      </div>

      <div>
        <label className={labelBase}>
          Descrição
          {descricaoMudou && <span className="ml-2 text-emerald-400">●</span>}
        </label>
        <textarea
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          rows={4}
          className={`${inputBase} text-sm leading-relaxed resize-y min-h-[100px]`}
        />
        <p className="text-[11px] text-white/40 mt-1">
          Aparece embaixo do título nos resultados do Google e ao compartilhar. <strong>Limite recomendado: 160 caracteres.</strong> Atual: {descricao.length}
        </p>
      </div>

      <div>
        <label className={labelBase}>
          Código de verificação do Google
          {verifMudou && <span className="ml-2 text-emerald-400">●</span>}
        </label>
        <input
          type="text"
          value={googleVerif}
          onChange={(e) => setGoogleVerif(e.target.value)}
          placeholder="(ainda não configurado)"
          className={`${inputBase} font-mono text-sm`}
        />
        <p className="text-[11px] text-white/40 mt-1">
          Só o valor de <code className="bg-white/10 px-1 rounded text-white/70">content=&quot;...&quot;</code> da meta tag do Google Search Console. Veja o passo a passo no final da página.
        </p>
      </div>

      <div className="flex items-center justify-between gap-3 pt-2 flex-wrap">
        <div className="text-sm">
          {alterado ? (
            <span className="text-emerald-400 font-semibold">Há alterações pendentes</span>
          ) : msg ? (
            <span className={msg.tipo === 'ok' ? 'text-emerald-400' : 'text-red-400'}>{msg.texto}</span>
          ) : (
            <span className="text-white/40">Sem alterações</span>
          )}
        </div>
        <button
          onClick={salvar}
          disabled={salvando || !alterado}
          className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-bold px-6 py-2.5 rounded-xl transition-colors cursor-pointer"
        >
          {salvando ? 'Salvando...' : 'Salvar alterações'}
        </button>
      </div>
    </div>
  )
}
