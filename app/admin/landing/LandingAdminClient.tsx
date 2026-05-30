'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { estiloParaClasses, type EstiloConfig } from '@/lib/landing-content'

interface Item {
  key: string
  secao: string
  ordem: number
  tipo: string
  valor: string
  valor_padrao: string
  estilo: EstiloConfig | null
  descricao: string | null
}

// Opções dos selects (label, value)
const OPCOES_TAMANHO = [
  { v: 'padrao',     l: 'Padrão' },
  { v: 'pequeno',    l: 'Pequeno' },
  { v: 'grande',     l: 'Grande' },
  { v: 'grandeplus', l: 'Grande++' },
  { v: 'imenso',     l: 'Imenso' },
]
const OPCOES_PESO = [
  { v: '',             l: 'Padrão' },
  { v: 'normal',       l: 'Normal' },
  { v: 'medio',        l: 'Médio' },
  { v: 'negrito',      l: 'Negrito' },
  { v: 'extranegrito', l: 'Extra-negrito' },
]
const OPCOES_COR = [
  { v: 'padrao', l: 'Padrão' },
  { v: 'branca', l: 'Branca' },
  { v: 'verde',  l: 'Verde' },
  { v: 'cinza',  l: 'Cinza claro' },
  { v: 'ambar',  l: 'Âmbar (alerta)' },
]
const OPCOES_ESTILO = [
  { v: 'normal',  l: 'Normal' },
  { v: 'italico', l: 'Itálico' },
]
const OPCOES_ALINHAMENTO = [
  { v: 'padrao',   l: 'Padrão' },
  { v: 'esquerda', l: 'Esquerda' },
  { v: 'centro',   l: 'Centro' },
  { v: 'direita',  l: 'Direita' },
]

export function LandingAdminClient({
  itens,
  secoesOcultasIniciais = [],
}: {
  itens: Item[]
  secoesOcultasIniciais?: string[]
}) {
  const router = useRouter()
  const [secoesOcultas, setSecoesOcultas] = useState<Set<string>>(
    () => new Set(secoesOcultasIniciais)
  )
  const [excluindoSecao, setExcluindoSecao] = useState<string | null>(null)
  const [confirmExclusao, setConfirmExclusao] = useState('')
  const [processando, setProcessando] = useState(false)

  async function toggleOcultarSecao(secao: string, ocultar: boolean) {
    setProcessando(true)
    const res = await fetch('/api/admin/landing/secoes', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ secao, oculta: ocultar }),
    })
    setProcessando(false)
    if (res.ok) {
      setSecoesOcultas((prev) => {
        const next = new Set(prev)
        if (ocultar) next.add(secao)
        else next.delete(secao)
        return next
      })
    }
  }

  async function excluirSecao() {
    if (!excluindoSecao) return
    if (confirmExclusao !== excluindoSecao) return
    setProcessando(true)
    const res = await fetch('/api/admin/landing/secoes', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ secao: excluindoSecao, confirmacao: confirmExclusao }),
    })
    setProcessando(false)
    if (res.ok) {
      setExcluindoSecao(null)
      setConfirmExclusao('')
      router.refresh()
    }
  }
  const [valores, setValores] = useState<Record<string, string>>(() => {
    const m: Record<string, string> = {}
    for (const i of itens) m[i.key] = i.valor
    return m
  })
  const [estilos, setEstilos] = useState<Record<string, EstiloConfig>>(() => {
    const m: Record<string, EstiloConfig> = {}
    for (const i of itens) m[i.key] = i.estilo ?? {}
    return m
  })
  const [estiloAberto, setEstiloAberto] = useState<Record<string, boolean>>({})
  const [salvando, setSalvando] = useState(false)
  const [msg, setMsg] = useState<{ tipo: 'ok' | 'erro'; texto: string } | null>(null)

  const porSecao = useMemo(() => {
    const grupos = new Map<string, Item[]>()
    for (const i of itens) {
      const arr = grupos.get(i.secao) ?? []
      arr.push(i)
      grupos.set(i.secao, arr)
    }
    return grupos
  }, [itens])

  // Detectar alterações (valor OU estilo)
  const alterados = useMemo(() => {
    return itens.filter((i) => {
      const valorMudou = valores[i.key] !== i.valor
      const estiloOriginal = JSON.stringify(i.estilo ?? {})
      const estiloAtual = JSON.stringify(estilos[i.key] ?? {})
      return valorMudou || estiloOriginal !== estiloAtual
    })
  }, [itens, valores, estilos])

  async function salvar() {
    if (alterados.length === 0) return
    setSalvando(true)
    setMsg(null)
    try {
      const res = await fetch('/api/admin/landing', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: alterados.map((i) => ({
            key: i.key,
            valor: valores[i.key],
            estilo: estilos[i.key] ?? {},
          })),
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error ?? 'Erro ao salvar')
      setMsg({ tipo: 'ok', texto: `${alterados.length} ${alterados.length === 1 ? 'item atualizado' : 'itens atualizados'}.` })
      router.refresh()
    } catch (e) {
      setMsg({ tipo: 'erro', texto: e instanceof Error ? e.message : 'Erro ao salvar' })
    } finally {
      setSalvando(false)
    }
  }

  function restaurarTexto(key: string, padrao: string) {
    setValores((prev) => ({ ...prev, [key]: padrao }))
  }

  function restaurarEstilo(key: string) {
    setEstilos((prev) => ({ ...prev, [key]: {} }))
  }

  function setEstiloProp<K extends keyof EstiloConfig>(key: string, prop: K, value: EstiloConfig[K]) {
    setEstilos((prev) => {
      const atual = { ...(prev[key] ?? {}) }
      if (!value || value === 'padrao') {
        delete atual[prop]
      } else {
        atual[prop] = value
      }
      return { ...prev, [key]: atual }
    })
  }

  const inputBase = 'w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-emerald-500/50 transition-colors'
  const selectBase = 'bg-[#0a0a0a] border border-white/15 rounded-lg px-3 py-1.5 text-white text-xs focus:outline-none focus:border-emerald-500/50 cursor-pointer'

  return (
    <div className="space-y-8">
      {[...porSecao.entries()].map(([secao, items]) => {
        const oculta = secoesOcultas.has(secao)
        return (
        <div
          key={secao}
          className={`border rounded-2xl p-6 transition-colors ${
            oculta
              ? 'border-amber-500/30 bg-amber-500/5'
              : 'border-white/10 bg-white/3'
          }`}
        >
          <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className={`text-base font-bold ${oculta ? 'text-amber-400' : 'text-emerald-400'}`}>
                {secao}
              </h2>
              {oculta && (
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 uppercase tracking-wider">
                  Oculta na landing
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => toggleOcultarSecao(secao, !oculta)}
                disabled={processando}
                className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-colors ${
                  oculta
                    ? 'border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10'
                    : 'border-white/15 text-white/70 hover:text-white hover:border-white/30 hover:bg-white/5'
                }`}
                title={oculta ? 'Mostrar essa seção na landing' : 'Esconder essa seção da landing'}
              >
                {oculta ? '👁 Mostrar' : '🚫 Ocultar'}
              </button>
              <button
                type="button"
                onClick={() => { setExcluindoSecao(secao); setConfirmExclusao('') }}
                disabled={processando}
                className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors"
                title="Excluir TODOS os campos dessa seção (irreversível)"
              >
                🗑 Excluir
              </button>
            </div>
          </div>
          <div className="space-y-5">
            {items.map((i) => {
              const valor = valores[i.key]
              const estilo = estilos[i.key] ?? {}
              const valorMudou = valor !== i.valor
              const estiloMudou = JSON.stringify(estilo) !== JSON.stringify(i.estilo ?? {})
              const alterado = valorMudou || estiloMudou
              const desviaDoPadrao = valor !== i.valor_padrao
              const aberto = !!estiloAberto[i.key]
              const temEstilo = Object.keys(estilo).length > 0
              const previewClasses = estiloParaClasses(estilo)
              return (
                <div key={i.key} className="space-y-2 pb-5 border-b border-white/5 last:border-b-0">
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <label className="text-xs text-white/60 uppercase tracking-wider font-semibold">
                      <code className="text-[10px] text-white/35 normal-case mr-2">{i.key}</code>
                      {alterado && <span className="ml-1 text-emerald-400">●</span>}
                    </label>
                    <div className="flex items-center gap-3">
                      {desviaDoPadrao && (
                        <button
                          type="button"
                          onClick={() => restaurarTexto(i.key, i.valor_padrao)}
                          className="text-xs text-white/40 hover:text-emerald-400 transition-colors"
                          title="Voltar ao texto padrão (cadastrado no código)"
                        >
                          Restaurar texto
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => setEstiloAberto((p) => ({ ...p, [i.key]: !aberto }))}
                        className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
                      >
                        🎨 Estilo {temEstilo && '✓'}
                      </button>
                    </div>
                  </div>
                  {i.descricao && (
                    <p className="text-xs text-white/45 leading-relaxed">{i.descricao}</p>
                  )}
                  {/* Aviso especial pra chave nav.aplicativos: explicar onde editar nomes dos apps filhos */}
                  {i.key === 'nav.aplicativos' && (
                    <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg px-3 py-2 text-xs text-emerald-200">
                      💡 <strong>Atenção:</strong> Aqui você edita apenas o <em>rótulo do dropdown</em> (&quot;Aplicativos&quot;).
                      Pra editar o <strong>nome dos apps</strong> que aparecem dentro do menu, vá em{' '}
                      <a
                        href="/admin/landing/apps"
                        className="underline font-semibold hover:text-emerald-100"
                      >
                        Apps (LP) →
                      </a>
                    </div>
                  )}
                  {i.tipo === 'rich_text' || valor.length > 100 ? (
                    <textarea
                      value={valor}
                      onChange={(e) => setValores((prev) => ({ ...prev, [i.key]: e.target.value }))}
                      rows={Math.max(3, Math.ceil(valor.length / 80))}
                      className={`${inputBase} resize-y min-h-[80px] text-sm leading-relaxed`}
                    />
                  ) : (
                    <input
                      type="text"
                      value={valor}
                      onChange={(e) => setValores((prev) => ({ ...prev, [i.key]: e.target.value }))}
                      className={`${inputBase} text-sm`}
                    />
                  )}

                  {/* Painel de estilo */}
                  {aberto && (
                    <div className="mt-2 bg-white/3 border border-white/10 rounded-xl p-4 space-y-3">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-xs font-semibold text-white/70 uppercase tracking-wider">Configurações de estilo</p>
                        {temEstilo && (
                          <button
                            type="button"
                            onClick={() => restaurarEstilo(i.key)}
                            className="text-xs text-white/40 hover:text-emerald-400 transition-colors"
                          >
                            Limpar estilos
                          </button>
                        )}
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        <CampoSelect label="Tamanho" value={estilo.tamanho ?? 'padrao'} opcoes={OPCOES_TAMANHO}
                          onChange={(v) => setEstiloProp(i.key, 'tamanho', v as EstiloConfig['tamanho'])}
                          selectClass={selectBase} />
                        <CampoSelect label="Peso" value={estilo.peso ?? ''} opcoes={OPCOES_PESO}
                          onChange={(v) => setEstiloProp(i.key, 'peso', v as EstiloConfig['peso'])}
                          selectClass={selectBase} />
                        <CampoSelect label="Cor" value={estilo.cor ?? 'padrao'} opcoes={OPCOES_COR}
                          onChange={(v) => setEstiloProp(i.key, 'cor', v as EstiloConfig['cor'])}
                          selectClass={selectBase} />
                        <CampoSelect label="Estilo" value={estilo.estilo ?? 'normal'} opcoes={OPCOES_ESTILO}
                          onChange={(v) => setEstiloProp(i.key, 'estilo', v as EstiloConfig['estilo'])}
                          selectClass={selectBase} />
                        <CampoSelect label="Alinhamento" value={estilo.alinhamento ?? 'padrao'} opcoes={OPCOES_ALINHAMENTO}
                          onChange={(v) => setEstiloProp(i.key, 'alinhamento', v as EstiloConfig['alinhamento'])}
                          selectClass={selectBase} />
                      </div>
                      {/* Preview ao vivo */}
                      <div className="bg-black/40 border border-white/8 rounded-lg p-3 mt-2">
                        <p className="text-[10px] text-white/35 uppercase tracking-wider mb-1.5">Preview</p>
                        <p className={previewClasses || 'text-white/70'}>
                          {valor.length > 120 ? valor.slice(0, 120) + '…' : valor || '(vazio)'}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
        )
      })}

      {/* Modal de confirmação de exclusão */}
      {excluindoSecao && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-[#111] border border-red-500/30 rounded-2xl p-6 w-full max-w-md">
            <h2 className="text-white font-bold text-lg mb-2">
              ⚠ Excluir seção &quot;{excluindoSecao}&quot;?
            </h2>
            <p className="text-white/60 text-sm mb-1">
              Esta ação <strong className="text-red-400">não pode ser desfeita</strong>. Todos os campos editáveis dessa seção serão removidos do banco.
            </p>
            <p className="text-white/60 text-sm mb-4">
              Pra confirmar, digite <code className="bg-white/10 px-1.5 py-0.5 rounded text-red-300 font-mono">{excluindoSecao}</code> abaixo:
            </p>
            <input
              type="text"
              value={confirmExclusao}
              onChange={(e) => setConfirmExclusao(e.target.value)}
              placeholder={excluindoSecao}
              autoFocus
              className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2.5 text-white placeholder-white/30 text-sm mb-4 focus:outline-none focus:border-red-500/50"
            />
            <div className="flex gap-2">
              <button
                onClick={() => { setExcluindoSecao(null); setConfirmExclusao('') }}
                className="flex-1 py-2.5 rounded-xl text-sm text-white/50 hover:text-white border border-white/10 hover:border-white/20 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={excluirSecao}
                disabled={processando || confirmExclusao !== excluindoSecao}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-red-600 hover:bg-red-500 disabled:bg-white/10 disabled:text-white/30 text-white transition-colors"
              >
                {processando ? 'Excluindo...' : 'Excluir definitivamente'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Barra fixa de salvar */}
      <div className="sticky bottom-4 z-10 flex items-center justify-between gap-4 bg-[#0a0a0a]/95 backdrop-blur-md border border-white/10 rounded-2xl p-4 shadow-xl">
        <div className="text-sm">
          {alterados.length > 0 ? (
            <span className="text-emerald-400 font-semibold">
              {alterados.length} {alterados.length === 1 ? 'alteração pendente' : 'alterações pendentes'}
            </span>
          ) : msg ? (
            <span className={msg.tipo === 'ok' ? 'text-emerald-400' : 'text-red-400'}>{msg.texto}</span>
          ) : (
            <span className="text-white/40">Sem alterações</span>
          )}
        </div>
        <button
          onClick={salvar}
          disabled={salvando || alterados.length === 0}
          className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-bold px-6 py-2.5 rounded-xl transition-colors cursor-pointer"
        >
          {salvando ? 'Salvando...' : 'Salvar alterações'}
        </button>
      </div>
    </div>
  )
}

function CampoSelect({
  label, value, opcoes, onChange, selectClass,
}: {
  label: string
  value: string
  opcoes: { v: string; l: string }[]
  onChange: (v: string) => void
  selectClass: string
}) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-[10px] text-white/50 uppercase tracking-wider font-semibold">{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)} className={selectClass}>
        {opcoes.map((o) => (
          <option key={o.v} value={o.v}>{o.l}</option>
        ))}
      </select>
    </label>
  )
}
