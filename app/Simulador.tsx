'use client'

import { useState } from 'react'
import Link from 'next/link'

// ── Cálculos ────────────────────────────────────────────────────────────────

function calcPrice(pv: number, taxa: number, n: number) {
  if (!pv || !taxa || !n) return null
  const i = taxa / 100
  const pmt = pv * (i * Math.pow(1 + i, n)) / (Math.pow(1 + i, n) - 1)
  const totalPago = pmt * n
  const totalJuros = totalPago - pv
  return { parcela: pmt, totalPago, totalJuros }
}

function calcSAC(pv: number, taxa: number, n: number) {
  if (!pv || !taxa || !n) return null
  const i = taxa / 100
  const amort = pv / n
  const primeiraParcela = amort + pv * i
  const ultimaParcela = amort + amort * i
  // Soma dos juros = i * pv * (n+1) / 2
  const totalJuros = i * pv * (n + 1) / 2
  const totalPago = pv + totalJuros
  return { parcela: primeiraParcela, ultimaParcela, totalPago, totalJuros }
}

function moeda(v: number) {
  return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

// ── Componente ──────────────────────────────────────────────────────────────

export function Simulador() {
  const [valor, setValor] = useState('')
  const [prazo, setPrazo] = useState('')
  const [taxa, setTaxa] = useState('')
  const [sistema, setSistema] = useState<'price' | 'sac' | 'variavel'>('price')

  const pv = parseFloat(valor.replace(/\./g, '').replace(',', '.')) || 0
  const n = parseInt(prazo) || 0
  const t = parseFloat(taxa.replace(',', '.')) || 0

  const resultado = sistema === 'sac' ? calcSAC(pv, t, n) : calcPrice(pv, t, n)
  const pronto = pv > 0 && n > 0 && t > 0

  // Máscara simples de número brasileiro para o campo valor
  function handleValor(e: React.ChangeEvent<HTMLInputElement>) {
    const digits = e.target.value.replace(/\D/g, '')
    if (!digits) { setValor(''); return }
    const num = parseInt(digits, 10) / 100
    setValor(num.toLocaleString('pt-BR', { minimumFractionDigits: 2 }))
  }

  const params = new URLSearchParams({
    valor: String(pv),
    prazo: String(n),
    taxa: String(t),
    sistema,
  }).toString()
  const urlCadastro = `https://amortizacao.matematico.com.br/cadastro?${params}`

  return (
    <section id="simulador" className="py-24 px-6 border-t border-white/5">
      <div className="max-w-4xl mx-auto">

        {/* Título */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Simule agora, grátis</h2>
          <p className="text-white/40 max-w-xl mx-auto">
            Sem cadastro. Calcule sua parcela e custo total em segundos.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Formulário */}
          <div className="bg-white/3 border border-white/8 rounded-2xl p-6 space-y-5">

            {/* Sistema */}
            <div>
              <label className="text-xs text-white/50 uppercase tracking-wider mb-2 block">Sistema</label>
              <div className="grid grid-cols-3 gap-2">
                {([
                  { key: 'price',   label: 'Price' },
                  { key: 'sac',     label: 'SAC' },
                  { key: 'variavel',label: 'Variável' },
                ] as const).map(({ key, label }) => (
                  <button
                    key={key}
                    onClick={() => setSistema(key)}
                    className={`py-2.5 rounded-xl text-sm font-semibold transition-all border ${
                      sistema === key
                        ? 'bg-emerald-600 border-emerald-500 text-white'
                        : 'bg-white/5 border-white/10 text-white/50 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
              {sistema === 'variavel' && (
                <p className="text-xs text-white/30 mt-2">
                  Base Price com pagamentos balão — configure no app completo.
                </p>
              )}
            </div>

            {/* Valor */}
            <div>
              <label className="text-xs text-white/50 uppercase tracking-wider mb-2 block">
                Valor do financiamento (R$)
              </label>
              <input
                type="text"
                inputMode="numeric"
                placeholder="0,00"
                value={valor}
                onChange={handleValor}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 text-lg font-mono focus:outline-none focus:border-emerald-500/50 transition-colors"
              />
            </div>

            {/* Prazo e Taxa */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-white/50 uppercase tracking-wider mb-2 block">
                  Prazo (meses)
                </label>
                <input
                  type="number"
                  min={1}
                  max={600}
                  placeholder="12"
                  value={prazo}
                  onChange={(e) => setPrazo(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 text-lg font-mono focus:outline-none focus:border-emerald-500/50 transition-colors"
                />
              </div>
              <div>
                <label className="text-xs text-white/50 uppercase tracking-wider mb-2 block">
                  Taxa mensal (%)
                </label>
                <input
                  type="text"
                  inputMode="decimal"
                  placeholder="1,00"
                  value={taxa}
                  onChange={(e) => setTaxa(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 text-lg font-mono focus:outline-none focus:border-emerald-500/50 transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Resultado */}
          <div className={`rounded-2xl p-6 border flex flex-col justify-between transition-all ${
            pronto && resultado
              ? 'bg-gradient-to-b from-emerald-500/10 to-transparent border-emerald-500/20'
              : 'bg-white/3 border-white/8'
          }`}>
            {!pronto ? (
              <div className="flex items-center justify-center h-full text-white/20 text-sm">
                Preencha os campos ao lado →
              </div>
            ) : resultado ? (
              <>
                <div className="space-y-5">
                  {/* Parcela principal */}
                  <div>
                    <p className="text-xs text-white/40 uppercase tracking-wider mb-1">
                      {sistema === 'price' || sistema === 'variavel' ? 'Parcela base (Price)' : '1ª Parcela'}
                    </p>
                    <p className="text-4xl font-black text-emerald-400">
                      {moeda(resultado.parcela)}
                    </p>
                    {sistema === 'sac' && 'ultimaParcela' in resultado && (
                      <p className="text-sm text-white/40 mt-1">
                        Última parcela: <span className="text-white/70">{moeda((resultado as any).ultimaParcela)}</span>
                      </p>
                    )}
                    {sistema === 'variavel' && (
                      <p className="text-sm text-white/40 mt-1">
                        Configure os balões no app completo
                      </p>
                    )}
                  </div>

                  {/* KPIs */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white/5 rounded-xl p-3">
                      <p className="text-xs text-white/40 mb-1">Total de Juros</p>
                      <p className="font-bold text-orange-400">{moeda(resultado.totalJuros)}</p>
                    </div>
                    <div className="bg-white/5 rounded-xl p-3">
                      <p className="text-xs text-white/40 mb-1">Total a Pagar</p>
                      <p className="font-bold text-white">{moeda(resultado.totalPago)}</p>
                    </div>
                    <div className="bg-white/5 rounded-xl p-3">
                      <p className="text-xs text-white/40 mb-1">Prazo</p>
                      <p className="font-bold text-white">{n} meses</p>
                    </div>
                    <div className="bg-white/5 rounded-xl p-3">
                      <p className="text-xs text-white/40 mb-1">Sistema</p>
                      <p className="font-bold text-white">{sistema === 'price' ? 'Price' : 'SAC'}</p>
                    </div>
                  </div>
                </div>

                {/* CTA */}
                <div className="mt-6 space-y-2">
                  <Link
                    href={urlCadastro}
                    className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-6 py-3 rounded-xl transition-all hover:scale-105 text-sm w-full"
                  >
                    Salvar e ver cronograma completo →
                  </Link>
                  <p className="text-center text-xs text-white/25">
                    Grátis · Sem cartão de crédito
                  </p>
                </div>
              </>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  )
}
