'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'

interface Item {
  key: string
  secao: string
  ordem: number
  tipo: string
  valor: string
  valor_padrao: string
  descricao: string | null
}

export function LandingAdminClient({ itens }: { itens: Item[] }) {
  const router = useRouter()
  const [valores, setValores] = useState<Record<string, string>>(() => {
    const m: Record<string, string> = {}
    for (const i of itens) m[i.key] = i.valor
    return m
  })
  const [salvando, setSalvando] = useState(false)
  const [msg, setMsg] = useState<{ tipo: 'ok' | 'erro'; texto: string } | null>(null)

  // Agrupar por seção (preservando a ordem original via Map de inserção)
  const porSecao = useMemo(() => {
    const grupos = new Map<string, Item[]>()
    for (const i of itens) {
      const arr = grupos.get(i.secao) ?? []
      arr.push(i)
      grupos.set(i.secao, arr)
    }
    return grupos
  }, [itens])

  // Detectar quais campos foram alterados
  const alterados = useMemo(() => {
    return itens.filter((i) => valores[i.key] !== i.valor)
  }, [itens, valores])

  async function salvar() {
    if (alterados.length === 0) return
    setSalvando(true)
    setMsg(null)
    try {
      const res = await fetch('/api/admin/landing', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: alterados.map((i) => ({ key: i.key, valor: valores[i.key] })),
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error ?? 'Erro ao salvar')
      setMsg({ tipo: 'ok', texto: `${alterados.length} ${alterados.length === 1 ? 'texto atualizado' : 'textos atualizados'}.` })
      router.refresh()
    } catch (e) {
      setMsg({ tipo: 'erro', texto: e instanceof Error ? e.message : 'Erro ao salvar' })
    } finally {
      setSalvando(false)
    }
  }

  function restaurarPadrao(key: string, padrao: string) {
    setValores((prev) => ({ ...prev, [key]: padrao }))
  }

  const inputBase = 'w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-emerald-500/50 transition-colors'

  return (
    <div className="space-y-8">
      {[...porSecao.entries()].map(([secao, items]) => (
        <div key={secao} className="border border-white/10 rounded-2xl p-6 bg-white/3">
          <h2 className="text-base font-bold text-emerald-400 mb-4">{secao}</h2>
          <div className="space-y-5">
            {items.map((i) => {
              const valor = valores[i.key]
              const alterado = valor !== i.valor
              const desviaDoPadrao = valor !== i.valor_padrao
              return (
                <div key={i.key} className="space-y-2">
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <label className="text-xs text-white/60 uppercase tracking-wider font-semibold">
                      <code className="text-[10px] text-white/35 normal-case mr-2">{i.key}</code>
                      {alterado && <span className="ml-1 text-emerald-400">●</span>}
                    </label>
                    {desviaDoPadrao && (
                      <button
                        type="button"
                        onClick={() => restaurarPadrao(i.key, i.valor_padrao)}
                        className="text-xs text-white/40 hover:text-emerald-400 transition-colors"
                        title="Voltar ao valor padrão (cadastrado no código)"
                      >
                        Restaurar padrão
                      </button>
                    )}
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
