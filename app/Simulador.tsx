'use client'

import { useState } from 'react'
import Link from 'next/link'

// ── Amortização: Cálculos ────────────────────────────────────────────────────

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
  const totalJuros = i * pv * (n + 1) / 2
  const totalPago = pv + totalJuros
  return { parcela: primeiraParcela, ultimaParcela, totalPago, totalJuros }
}

function moeda(v: number) {
  return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

// ── Atualização: BCB ─────────────────────────────────────────────────────────

const SERIES: Record<string, number> = {
  IPCA:     433,
  IGPM:     189,
  IGPDI:    190,
  INPC:     188,
  INCC:     192,
  CDI:      4391,
  SELIC:    4390,
  TR:       7811,
  POUPANCA: 196,
  FGTS:     -1,    // sentinel — calculado a partir da TR
  USD:      3698,
  SM:       1619,
}

// Tipo de índice: taxa_mensal multiplica fatores, valor_absoluto usa fim/início
const TIPO: Record<string, 'taxa_mensal' | 'valor_absoluto'> = {
  IPCA:     'taxa_mensal',
  IGPM:     'taxa_mensal',
  IGPDI:    'taxa_mensal',
  INPC:     'taxa_mensal',
  INCC:     'taxa_mensal',
  CDI:      'taxa_mensal',
  SELIC:    'taxa_mensal',
  TR:       'taxa_mensal',
  POUPANCA: 'taxa_mensal',
  FGTS:     'taxa_mensal',
  USD:      'valor_absoluto',
  SM:       'valor_absoluto',
}

const INDICE_LABEL: Record<string, string> = {
  IPCA:     'IPCA — Inflação oficial',
  IGPM:     'IGP-M — FGV',
  IGPDI:    'IGP-DI — FGV',
  INPC:     'INPC — Inflação popular',
  INCC:     'INCC-M — Construção',
  CDI:      'CDI — Taxa interbancária',
  SELIC:    'SELIC — Taxa básica',
  TR:       'TR — Taxa Referencial',
  POUPANCA: 'Poupança — Nova (pós-2012)',
  FGTS:     'FGTS — TR + 3% a.a.',
  USD:      'Dólar — PTAX (R$)',
  SM:       'Salário Mínimo (R$)',
}

// FGTS = TR + 0,2466% a.m. (3% a.a. capitalizado mensalmente)
const FGTS_BONUS_MENSAL = 0.246627

interface ResultadoAtualizacao {
  valorOriginal: number
  valorCorrigido: number
  fator: number
  variacaoPct: number
  periodos: number
}

function mesParaBCB(mes: string, ultimo = false) {
  const [ano, m] = mes.split('-')
  if (ultimo) {
    const ultimoDia = new Date(parseInt(ano), parseInt(m), 0).getDate()
    return `${String(ultimoDia).padStart(2, '0')}/${m}/${ano}`
  }
  return `01/${m}/${ano}`
}

async function calcularAtualizacao(
  valorStr: string,
  inicio: string,
  fim: string,
  indice: string
): Promise<ResultadoAtualizacao> {
  const valor = parseFloat(valorStr.replace(/\./g, '').replace(',', '.'))
  // FGTS é derivado da TR (BCB não tem série direta)
  const codigoReal = indice === 'FGTS' ? SERIES.TR : SERIES[indice]
  const params = new URLSearchParams({
    codigo: String(codigoReal),
    dataInicial: mesParaBCB(inicio),
    dataFinal: mesParaBCB(fim, true),
  })
  const res = await fetch(`/api/bcb?${params}`)
  if (!res.ok) throw new Error('Erro ao buscar dados do Banco Central')
  let dados: { data: string; valor: string }[] = await res.json()
  if (!dados.length) throw new Error('Nenhum dado encontrado para o período')

  // Para FGTS, soma 0,2466% a.m. (= 3% a.a.) à TR
  if (indice === 'FGTS') {
    dados = dados.map((d) => ({
      data: d.data,
      valor: (parseFloat(d.valor.replace(',', '.')) + FGTS_BONUS_MENSAL).toFixed(6).replace('.', ','),
    }))
  }

  // Cálculo do fator depende do tipo do índice
  let fator: number
  if (TIPO[indice] === 'valor_absoluto') {
    // Dólar, Salário Mínimo: fator = valor final / valor inicial
    const primeiro = parseFloat(dados[0].valor.replace(',', '.'))
    const ultimo = parseFloat(dados[dados.length - 1].valor.replace(',', '.'))
    fator = primeiro ? ultimo / primeiro : 1
  } else {
    // IPCA, CDI, etc.: multiplica os fatores mensais
    fator = dados.reduce((f, d) => {
      const taxa = parseFloat(d.valor.replace(',', '.')) / 100
      return f * (1 + taxa)
    }, 1)
  }
  const valorCorrigido = valor * fator
  return {
    valorOriginal: valor,
    valorCorrigido,
    fator,
    variacaoPct: (fator - 1) * 100,
    periodos: dados.length,
  }
}

// ── Painel "Entenda o cálculo" — Amortização ─────────────────────────────────

const AMORT_INFO: Record<string, {
  formula: string | null
  variaveis: { sigla: string; def: string }[]
  conceito: string
}> = {
  price: {
    formula: 'PMT = PV · [ i · (1 + i)ⁿ ] / [ (1 + i)ⁿ − 1 ]',
    variaveis: [
      { sigla: 'PMT', def: 'Prestação (parcela) — valor fixo pago em cada período' },
      { sigla: 'PV', def: 'Valor presente — capital financiado (Present Value)' },
      { sigla: 'i', def: 'Taxa de juros mensal (ex: 1% = 0,01)' },
      { sigla: 'n', def: 'Número de períodos — prazo total em meses' },
    ],
    conceito: 'No Sistema Price todas as parcelas são iguais. A cada mês, a proporção de juros diminui e a de amortização aumenta — mas a soma permanece constante.',
  },
  sac: {
    formula: 'A = PV / n   ·   Jₜ = Sdₜ · i   ·   PMTₜ = A + Jₜ',
    variaveis: [
      { sigla: 'A', def: 'Amortização constante — igual em todas as parcelas' },
      { sigla: 'PV', def: 'Valor presente — capital financiado' },
      { sigla: 'n', def: 'Número de períodos — prazo total em meses' },
      { sigla: 'Jₜ', def: 'Juros do período t' },
      { sigla: 'Sdₜ', def: 'Saldo devedor no início do período t' },
      { sigla: 'i', def: 'Taxa de juros mensal (ex: 1% = 0,01)' },
      { sigla: 'PMTₜ', def: 'Parcela do período t — decrescente ao longo do contrato' },
    ],
    conceito: 'No SAC a amortização é constante. Como o saldo devedor cai a cada mês, os juros — e portanto as parcelas — diminuem progressivamente. O total pago em juros é menor que no Price.',
  },
  variavel: {
    formula: null,
    variaveis: [],
    conceito: 'No sistema Variável é possível inserir pagamentos extraordinários (balões) em datas específicas. O simulador recalcula o cronograma completo, mostrando o impacto na redução do prazo ou do valor das parcelas e o custo efetivo total.',
  },
}

function PainelEntendaAmortizacao({ sistema }: { sistema: 'price' | 'sac' | 'variavel' }) {
  const [aberto, setAberto] = useState(false)
  const info = AMORT_INFO[sistema]

  return (
    <div className="mt-4 border border-white/8 rounded-2xl overflow-hidden">
      <button
        onClick={() => setAberto(!aberto)}
        className="w-full flex items-center justify-between px-5 py-3.5 text-sm text-emerald-400 hover:text-emerald-300 hover:bg-white/3 transition-colors cursor-pointer"
      >
        <span className="flex items-center gap-2">
          <span>📐</span>
          <span className="font-medium">Entenda o cálculo</span>
        </span>
        <svg
          className={`w-4 h-4 transition-transform ${aberto ? 'rotate-180' : ''}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {aberto && (
        <div className="px-5 pb-5 pt-1 space-y-4 border-t border-white/8 bg-white/2">
          {info.formula && (
            <div>
              <p className="text-xs text-white/45 uppercase tracking-wider mb-2">Fórmula</p>
              <p className="font-mono text-sm text-emerald-300 leading-relaxed">
                {info.formula}
              </p>
            </div>
          )}

          {info.variaveis.length > 0 && (
            <div>
              <p className="text-xs text-white/45 uppercase tracking-wider mb-2">Variáveis</p>
              <div className="space-y-1.5">
                {info.variaveis.map(({ sigla, def }) => (
                  <div key={sigla} className="flex gap-3 text-sm">
                    <span className="font-mono text-emerald-400 min-w-[3rem] shrink-0">{sigla}</span>
                    <span className="text-white/65">{def}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <p className="text-xs text-white/45 uppercase tracking-wider mb-2">Conceito</p>
            <p className="text-sm text-white/65 leading-relaxed">{info.conceito}</p>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Painel "Entenda o cálculo" — Atualização ─────────────────────────────────

const INDICE_INFO: Record<string, string> = {
  IPCA: 'Índice Nacional de Preços ao Consumidor Amplo, medido pelo IBGE. É o indicador oficial de inflação do Brasil, utilizado pelo Banco Central como meta de política monetária.',
  IGPM: 'Índice Geral de Preços do Mercado, calculado pela FGV. Reflete variações nos preços do atacado, construção civil e consumidor. Amplamente usado em contratos de locação.',
  IGPDI: 'Índice Geral de Preços — Disponibilidade Interna (FGV). Mede a inflação considerando produtos do mercado interno. Difere do IGP-M apenas no período de coleta dos preços.',
  INPC: 'Índice Nacional de Preços ao Consumidor, medido pelo IBGE. Mede a inflação para famílias com renda entre 1 e 5 salários mínimos.',
  INCC: 'Índice Nacional de Custo da Construção — Mercado (FGV). Mede a variação dos custos da construção civil. Usado em contratos de incorporação imobiliária na fase de obra.',
  CDI: 'Certificado de Depósito Interbancário. Representa a taxa média das operações entre bancos. Referência para aplicações de renda fixa e correção de contratos financeiros.',
  SELIC: 'Taxa básica de juros da economia brasileira, definida pelo Banco Central (COPOM). Balizadora de todos os demais juros do mercado e instrumento de controle da inflação.',
  TR: 'Taxa Referencial, calculada pelo Banco Central a partir das taxas dos CDBs prefixados. Usada na correção da poupança, FGTS e financiamentos imobiliários do SFH.',
  POUPANCA: 'Rendimento mensal da Poupança nova (depósitos pós 04/05/2012). Quando SELIC ≤ 8,5%: 70% da SELIC + TR; acima disso: 0,5% a.m. + TR. Referência popular de rentabilidade.',
  FGTS: 'Rendimento do FGTS (Fundo de Garantia por Tempo de Serviço): TR + 3% ao ano, ou seja, TR + 0,2466% ao mês. Usado em correção de valores em ações trabalhistas.',
  USD: 'Cotação do Dólar Americano (PTAX venda) — taxa média diária calculada pelo Banco Central. A correção é feita pela razão entre o valor final e o inicial do período, refletindo a desvalorização do Real.',
  SM: 'Salário Mínimo nominal mensal vigente no Brasil. Atualizado anualmente pelo governo federal. Usado em contratos, pensões alimentícias e indexações sociais. A correção é feita pela razão entre o valor final e o inicial.',
}

function nomeIndice(indice: string): string {
  if (indice === 'IGPM') return 'IGP-M'
  if (indice === 'IGPDI') return 'IGP-DI'
  if (indice === 'INCC') return 'INCC-M'
  if (indice === 'POUPANCA') return 'Poupança'
  if (indice === 'USD') return 'Dólar'
  if (indice === 'SM') return 'Salário Mínimo'
  return indice
}

function PainelEntendaAtualizacao({ indice }: { indice: string }) {
  const [aberto, setAberto] = useState(false)
  const tipoIndice = TIPO[indice]

  // Conteúdo varia conforme o tipo do índice
  const formula = tipoIndice === 'valor_absoluto'
    ? <>F = V<sub>final</sub> ÷ V<sub>inicial</sub><br />VC = V₀ × F</>
    : <>F = (1 + i₁) × (1 + i₂) × … × (1 + iₙ)<br />VC = V₀ × F</>

  const variaveis = tipoIndice === 'valor_absoluto'
    ? [
        { sigla: 'F', def: 'Fator de correção (razão entre valor final e inicial)' },
        { sigla: 'V_final', def: `Valor do ${nomeIndice(indice)} no último mês do período` },
        { sigla: 'V_inicial', def: `Valor do ${nomeIndice(indice)} no primeiro mês do período` },
        { sigla: 'V₀', def: 'Valor original a ser corrigido' },
        { sigla: 'VC', def: 'Valor corrigido após aplicação do índice' },
      ]
    : [
        { sigla: 'F', def: 'Fator de correção acumulado no período' },
        { sigla: 'i₁…iₙ', def: 'Taxa mensal de cada período (em decimal, ex: 0,5% = 0,005)' },
        { sigla: 'V₀', def: 'Valor original a ser corrigido' },
        { sigla: 'VC', def: 'Valor corrigido após aplicação do índice' },
      ]

  const metodo = tipoIndice === 'valor_absoluto'
    ? `A correção é calculada pela razão entre o valor do ${nomeIndice(indice)} no fim e no início do período, usando dados oficiais do Banco Central do Brasil.`
    : 'A correção é calculada pelo produto encadeado das taxas mensais divulgadas pelo Banco Central do Brasil — o mesmo critério utilizado em laudos judiciais e contratos de atualização monetária.'

  return (
    <div className="mt-4 border border-white/8 rounded-2xl overflow-hidden">
      <button
        onClick={() => setAberto(!aberto)}
        className="w-full flex items-center justify-between px-5 py-3.5 text-sm text-emerald-400 hover:text-emerald-300 hover:bg-white/3 transition-colors cursor-pointer"
      >
        <span className="flex items-center gap-2">
          <span>📐</span>
          <span className="font-medium">Entenda o cálculo</span>
        </span>
        <svg
          className={`w-4 h-4 transition-transform ${aberto ? 'rotate-180' : ''}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {aberto && (
        <div className="px-5 pb-5 pt-1 space-y-4 border-t border-white/8 bg-white/2">
          <div>
            <p className="text-xs text-white/45 uppercase tracking-wider mb-2">Fórmula</p>
            <p className="font-mono text-sm text-emerald-300 leading-relaxed">{formula}</p>
          </div>

          <div>
            <p className="text-xs text-white/45 uppercase tracking-wider mb-2">Variáveis</p>
            <div className="space-y-1.5">
              {variaveis.map(({ sigla, def }) => (
                <div key={sigla} className="flex gap-3 text-sm">
                  <span className="font-mono text-emerald-400 min-w-[3.5rem] shrink-0">{sigla}</span>
                  <span className="text-white/65">{def}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs text-white/45 uppercase tracking-wider mb-2">
              Sobre o {nomeIndice(indice)}
            </p>
            <p className="text-sm text-white/65 leading-relaxed">{INDICE_INFO[indice]}</p>
          </div>

          <div>
            <p className="text-xs text-white/45 uppercase tracking-wider mb-2">Método</p>
            <p className="text-sm text-white/65 leading-relaxed">{metodo}</p>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Simulador Amortização ────────────────────────────────────────────────────

interface SimuladorAmortizacaoProps {
  textoBotaoCalcular: string
  textoBotaoCriarConta: string
  textoBotaoLogin: string
  textoBotaoCronograma: string
}

function SimuladorAmortizacao({
  textoBotaoCalcular,
  textoBotaoCriarConta,
  textoBotaoLogin,
  textoBotaoCronograma,
}: SimuladorAmortizacaoProps) {
  const [valor, setValor] = useState('')
  const [prazo, setPrazo] = useState('')
  const [taxa, setTaxa] = useState('')
  const [sistema, setSistema] = useState<'price' | 'sac' | 'variavel'>('price')
  const [calculado, setCalculado] = useState(false)

  const pv = parseFloat(valor.replace(/\./g, '').replace(',', '.')) || 0
  const n = parseInt(prazo) || 0
  const t = parseFloat(taxa.replace(',', '.')) || 0

  const resultado = calculado && sistema !== 'variavel'
    ? (sistema === 'sac' ? calcSAC(pv, t, n) : calcPrice(pv, t, n))
    : null
  const pronto = pv > 0 && n > 0 && t > 0

  function handleValor(e: React.ChangeEvent<HTMLInputElement>) {
    const digits = e.target.value.replace(/\D/g, '')
    if (!digits) { setValor(''); setCalculado(false); return }
    const num = parseInt(digits, 10) / 100
    setValor(num.toLocaleString('pt-BR', { minimumFractionDigits: 2 }))
    setCalculado(false)
  }

  function calcular() {
    if (!pronto && sistema !== 'variavel') return
    setCalculado(true)
  }

  const params = new URLSearchParams({ valor: String(pv), prazo: String(n), taxa: String(t), sistema }).toString()
  const urlCadastro = `https://amortizacao.matematico.com.br/cadastro?${params}`

  return (
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Formulário */}
        <div className="bg-white/3 border border-white/8 rounded-2xl p-6 space-y-5">
          <div>
            <label className="text-xs text-white/70 uppercase tracking-wider mb-2 block">Sistema</label>
            <div className="grid grid-cols-3 gap-2">
              {([
                { key: 'price', label: 'Price' },
                { key: 'sac', label: 'SAC' },
                { key: 'variavel', label: 'Variável' },
              ] as const).map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setSistema(key)}
                  className={`py-2.5 rounded-xl text-sm font-semibold cursor-pointer transition-all border ${
                    sistema === key
                      ? 'bg-emerald-600 border-emerald-500 text-white'
                      : 'bg-white/5 border-emerald-500/40 text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10 hover:border-emerald-400'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs text-white/70 uppercase tracking-wider mb-2 block">Valor do financiamento (R$)</label>
            <input
              type="text" inputMode="numeric" placeholder="0,00" value={valor} onChange={handleValor}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/35 text-lg font-mono focus:outline-none focus:border-emerald-500/50 transition-colors"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-white/70 uppercase tracking-wider mb-2 block">Prazo (meses)</label>
              <input
                type="number" min={1} max={600} placeholder="12" value={prazo} onChange={(e) => setPrazo(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/35 text-lg font-mono focus:outline-none focus:border-emerald-500/50 transition-colors"
              />
            </div>
            <div>
              <label className="text-xs text-white/70 uppercase tracking-wider mb-2 block">Taxa mensal (%)</label>
              <input
                type="text" inputMode="decimal" placeholder="1,00" value={taxa} onChange={(e) => { setTaxa(e.target.value); setCalculado(false) }}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/35 text-lg font-mono focus:outline-none focus:border-emerald-500/50 transition-colors"
              />
            </div>
          </div>

          <button
            onClick={calcular}
            disabled={!pronto && sistema !== 'variavel'}
            className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:bg-white/10 disabled:text-white/30 text-white font-bold py-3 rounded-xl transition-all text-sm cursor-pointer"
          >
            {textoBotaoCalcular}
          </button>
        </div>

        {/* Resultado */}
        <div className={`rounded-2xl p-6 border flex flex-col transition-all ${
          (sistema === 'variavel' && calculado) || resultado
            ? 'bg-gradient-to-b from-emerald-500/10 to-transparent border-emerald-500/20'
            : 'bg-white/3 border-white/8'
        }`}>
          {sistema === 'variavel' && calculado ? (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-6 py-4">
              <div className="text-5xl">🎯</div>
              <div>
                <p className="text-lg font-bold text-white mb-2">Amortização Variável</p>
                <p className="text-white/65 text-sm leading-relaxed">Configure pagamentos balão em parcelas específicas, reduza prazo ou parcela e veja o cronograma completo com custo efetivo total.</p>
              </div>
              <div className="w-full space-y-2">
                <Link href="https://amortizacao.matematico.com.br/cadastro" className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-6 py-3 rounded-xl cursor-pointer transition-all hover:scale-105 text-sm w-full">
                  {textoBotaoCriarConta}
                </Link>
                <Link href="https://amortizacao.matematico.com.br/login" className="flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/15 text-white/75 font-medium px-6 py-3 rounded-xl cursor-pointer transition-all text-sm w-full">
                  {textoBotaoLogin}
                </Link>
                <p className="text-center text-xs text-white/45">Grátis · Sem cartão de crédito</p>
              </div>
            </div>
          ) : !calculado ? (
            <div className="flex items-center justify-center h-full text-white/45 text-sm">
              Preencha os campos e clique em Calcular →
            </div>
          ) : resultado ? (
            <div className="flex flex-col h-full">
              <div className="space-y-5">
                <div>
                  <p className="text-xs text-white/60 uppercase tracking-wider mb-1">
                    {sistema === 'price' ? 'Parcela fixa' : '1ª Parcela'}
                  </p>
                  <p className="text-4xl font-black text-emerald-400">{moeda(resultado.parcela)}</p>
                  {sistema === 'sac' && 'ultimaParcela' in resultado && (
                    <p className="text-sm text-white/55 mt-1">
                      Última parcela: <span className="text-white/80">{moeda((resultado as any).ultimaParcela)}</span>
                    </p>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white/5 rounded-xl p-3">
                    <p className="text-xs text-white/60 mb-1">Total de Juros</p>
                    <p className="font-bold text-emerald-400">{moeda(resultado.totalJuros)}</p>
                  </div>
                  <div className="bg-white/5 rounded-xl p-3">
                    <p className="text-xs text-white/60 mb-1">Total a Pagar</p>
                    <p className="font-bold text-white">{moeda(resultado.totalPago)}</p>
                  </div>
                  <div className="bg-white/5 rounded-xl p-3">
                    <p className="text-xs text-white/60 mb-1">Prazo</p>
                    <p className="font-bold text-white">{n} meses</p>
                  </div>
                  <div className="bg-white/5 rounded-xl p-3">
                    <p className="text-xs text-white/60 mb-1">Sistema</p>
                    <p className="font-bold text-white">{sistema === 'price' ? 'Price' : 'SAC'}</p>
                  </div>
                </div>
              </div>
              <div className="mt-auto pt-6 space-y-2">
                <Link href={urlCadastro} className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-6 py-3 rounded-xl cursor-pointer transition-all hover:scale-105 text-sm w-full">
                  {textoBotaoCronograma}
                </Link>
                <p className="text-center text-xs text-white/45">Grátis · Sem cartão de crédito</p>
              </div>
            </div>
          ) : null}
        </div>
      </div>

      {/* Painel Entenda o Cálculo */}
      <PainelEntendaAmortizacao sistema={sistema} />
    </div>
  )
}

// ── Simulador Atualização ────────────────────────────────────────────────────

interface SimuladorAtualizacaoProps {
  textoBotaoLaudo: string
}

function SimuladorAtualizacao({ textoBotaoLaudo }: SimuladorAtualizacaoProps) {
  const [valor, setValor] = useState('')
  const [inicio, setInicio] = useState('')
  const [fim, setFim] = useState('')
  const [indice, setIndice] = useState('IPCA')
  const [resultado, setResultado] = useState<ResultadoAtualizacao | null>(null)
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState('')

  function handleValor(e: React.ChangeEvent<HTMLInputElement>) {
    const digits = e.target.value.replace(/\D/g, '')
    if (!digits) { setValor(''); return }
    const num = parseInt(digits, 10) / 100
    setValor(num.toLocaleString('pt-BR', { minimumFractionDigits: 2 }))
  }

  async function calcular(indiceParam?: string) {
    const indiceUsar = indiceParam ?? indice
    const num = parseFloat(valor.replace(/\./g, '').replace(',', '.'))
    if (!num || !inicio || !fim) { setErro('Preencha todos os campos.'); return }
    if (inicio >= fim) { setErro('A data inicial deve ser anterior à data final.'); return }
    setErro('')
    setLoading(true)
    setResultado(null)
    try {
      const r = await calcularAtualizacao(valor, inicio, fim, indiceUsar)
      setResultado(r)
    } catch (e: any) {
      setErro(e.message || 'Erro ao buscar dados. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  function selecionarIndice(novoIndice: string) {
    setIndice(novoIndice)
    // Se já há resultado calculado, recalcula automaticamente com o novo índice
    if (resultado) {
      calcular(novoIndice)
    }
  }

  const pronto = !!resultado

  return (
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Formulário */}
        <div className="bg-white/3 border border-white/8 rounded-2xl p-6 space-y-5">
          {/* Índice */}
          <div>
            <label className="text-xs text-white/70 uppercase tracking-wider mb-2 block">Índice</label>
            <div className="relative">
              <select
                value={indice}
                onChange={(e) => selecionarIndice(e.target.value)}
                className="w-full appearance-none bg-white/5 border border-white/10 rounded-xl pl-4 pr-10 py-3 text-white text-sm font-semibold focus:outline-none focus:border-emerald-500/50 transition-colors cursor-pointer"
                style={{ colorScheme: 'dark' }}
              >
                {Object.entries(INDICE_LABEL).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
              <div className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-emerald-400">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Valor */}
          <div>
            <label className="text-xs text-white/70 uppercase tracking-wider mb-2 block">Valor original (R$)</label>
            <input
              type="text" inputMode="numeric" placeholder="0,00" value={valor} onChange={handleValor}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/35 text-lg font-mono focus:outline-none focus:border-emerald-500/50 transition-colors"
            />
          </div>

          {/* Datas */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-white/70 uppercase tracking-wider mb-2 block">Data inicial</label>
              <input
                type="month" value={inicio} onChange={(e) => setInicio(e.target.value)}
                max={new Date().toISOString().slice(0, 7)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white/80 text-sm focus:outline-none focus:border-emerald-500/50 transition-colors [color-scheme:dark]"
              />
            </div>
            <div>
              <label className="text-xs text-white/70 uppercase tracking-wider mb-2 block">Data final</label>
              <input
                type="month" value={fim} onChange={(e) => setFim(e.target.value)}
                max={new Date().toISOString().slice(0, 7)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white/80 text-sm focus:outline-none focus:border-emerald-500/50 transition-colors [color-scheme:dark]"
              />
            </div>
          </div>

          {erro && <p className="text-red-400 text-sm">{erro}</p>}

          <button
            onClick={() => calcular()}
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:bg-white/10 disabled:text-white/30 text-white font-bold py-3 rounded-xl transition-all text-sm"
          >
            {loading ? '⏳ Buscando dados do Banco Central...' : 'Calcular correção →'}
          </button>
        </div>

        {/* Resultado */}
        <div className={`rounded-2xl p-6 border flex flex-col justify-between transition-all ${
          pronto
            ? 'bg-gradient-to-b from-emerald-500/10 to-transparent border-emerald-500/20'
            : 'bg-white/3 border-white/8'
        }`}>
          {loading ? (
            <div className="flex flex-col items-center justify-center h-full gap-3 text-white/45 text-sm">
              <div className="w-8 h-8 border-2 border-emerald-500/40 border-t-emerald-400 rounded-full animate-spin" />
              Consultando API do Banco Central...
            </div>
          ) : !pronto ? (
            <div className="flex items-center justify-center h-full text-white/45 text-sm">
              Preencha os campos e clique em calcular →
            </div>
          ) : (
            <>
              <div className="space-y-5">
                <div>
                  <p className="text-xs text-white/60 uppercase tracking-wider mb-1">Valor corrigido</p>
                  <p className="text-4xl font-black text-emerald-400">{moeda(resultado!.valorCorrigido)}</p>
                  <p className="text-sm text-white/55 mt-1">
                    Original: <span className="text-white/80">{moeda(resultado!.valorOriginal)}</span>
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white/5 rounded-xl p-3">
                    <p className="text-xs text-white/60 mb-1">Variação</p>
                    <p className="font-bold text-emerald-400">+{resultado!.variacaoPct.toFixed(2).replace('.', ',')}%</p>
                  </div>
                  <div className="bg-white/5 rounded-xl p-3">
                    <p className="text-xs text-white/60 mb-1">Correção</p>
                    <p className="font-bold text-white">{moeda(resultado!.valorCorrigido - resultado!.valorOriginal)}</p>
                  </div>
                  <div className="bg-white/5 rounded-xl p-3">
                    <p className="text-xs text-white/60 mb-1">Fator</p>
                    <p className="font-bold text-white">{resultado!.fator.toFixed(6).replace('.', ',')}</p>
                  </div>
                  <div className="bg-white/5 rounded-xl p-3">
                    <p className="text-xs text-white/60 mb-1">Período</p>
                    <p className="font-bold text-white">{resultado!.periodos} {resultado!.periodos === 1 ? 'mês' : 'meses'}</p>
                  </div>
                </div>
              </div>
              <div className="mt-6 space-y-2">
                <Link href="https://atualizacao.matematico.com.br" className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-6 py-3 rounded-xl cursor-pointer transition-all hover:scale-105 text-sm w-full">
                  {textoBotaoLaudo}
                </Link>
                <p className="text-center text-xs text-white/45">Grátis · Dados oficiais do Banco Central</p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Painel Entenda o Cálculo */}
      <PainelEntendaAtualizacao indice={indice} />
    </div>
  )
}

// ── Componente principal ─────────────────────────────────────────────────────

interface SimuladorProps {
  textoBotaoCalcular?: string
  textoBotaoCriarConta?: string
  textoBotaoLogin?: string
  textoBotaoCronograma?: string
  textoBotaoLaudo?: string
}

export function Simulador({
  textoBotaoCalcular = 'Calcular →',
  textoBotaoCriarConta = 'Criar conta grátis e simular →',
  textoBotaoLogin = 'Já tenho conta → Entrar',
  textoBotaoCronograma = 'Salvar e ver cronograma completo →',
  textoBotaoLaudo = 'Ver laudo completo com exportação →',
}: SimuladorProps = {}) {
  const [aba, setAba] = useState<'amortizacao' | 'atualizacao'>('amortizacao')

  return (
    <section id="simulador" className="py-24 px-6 border-t border-white/5">
      <div className="max-w-4xl mx-auto">

        {/* Título */}
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Simule agora, grátis</h2>
          <p className="text-white/65 max-w-xl mx-auto">
            Sem cadastro. Calcule sua parcela e custo total em segundos.
          </p>
        </div>

        {/* Abas */}
        <div className="flex gap-2 mb-8 justify-center">
          <button
            onClick={() => setAba('amortizacao')}
            className={`px-6 py-2.5 rounded-xl text-sm font-semibold border transition-all ${
              aba === 'amortizacao'
                ? 'bg-emerald-600 border-emerald-500 text-white'
                : 'bg-white/5 border-emerald-500/40 text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10 hover:border-emerald-400'
            }`}
          >
            📊 Amortização
          </button>
          <button
            onClick={() => setAba('atualizacao')}
            className={`px-6 py-2.5 rounded-xl text-sm font-semibold border transition-all ${
              aba === 'atualizacao'
                ? 'bg-emerald-600 border-emerald-500 text-white'
                : 'bg-white/5 border-emerald-500/40 text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10 hover:border-emerald-400'
            }`}
          >
            📈 Atualização Monetária
          </button>
        </div>

        {/* Conteúdo da aba */}
        {aba === 'amortizacao' ? (
          <SimuladorAmortizacao
            textoBotaoCalcular={textoBotaoCalcular}
            textoBotaoCriarConta={textoBotaoCriarConta}
            textoBotaoLogin={textoBotaoLogin}
            textoBotaoCronograma={textoBotaoCronograma}
          />
        ) : (
          <SimuladorAtualizacao textoBotaoLaudo={textoBotaoLaudo} />
        )}

      </div>
    </section>
  )
}
