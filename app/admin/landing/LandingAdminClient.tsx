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

export function LandingAdminClient({ itens }: { itens: Item[] }) {
  const router = useRouter()
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
      {[...porSecao.entries()].map(([secao, items]) => (
        <div key={secao} className="border border-white/10 rounded-2xl p-6 bg-white/3">
          <h2 className="text-base font-bold text-emerald-400 mb-4">{secao}</h2>
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
      ))}

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
