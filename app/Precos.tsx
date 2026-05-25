import Link from 'next/link'

const FREE = [
  'Até 3 financiamentos',
  'Price, SAC e Variável',
  'Cronograma completo',
  'Exportar PDF e Excel',
  'Registrar pagamentos',
]

const PRO = [
  'Financiamentos ilimitados',
  'Price, SAC e Variável',
  'Cronograma completo',
  'Exportar PDF e Excel',
  'Registrar pagamentos',
  'Comparador de financiamentos',
  'Relatórios avançados',
  'Suporte prioritário',
]

export function Precos() {
  return (
    <section id="precos" className="py-24 px-6 border-t border-white/5">
      <div className="max-w-4xl mx-auto">

        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Planos simples e transparentes</h2>
          <p className="text-white/40 max-w-xl mx-auto">
            Comece grátis. Faça upgrade quando precisar de mais.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

          {/* Free */}
          <div className="bg-white/3 border border-white/8 rounded-2xl p-8 flex flex-col">
            <div className="mb-6">
              <p className="text-xs font-semibold uppercase tracking-wider text-white/40 mb-2">Gratuito</p>
              <div className="flex items-end gap-2 mb-1">
                <span className="text-5xl font-black text-white">R$ 0</span>
              </div>
              <p className="text-white/30 text-sm">para sempre</p>
            </div>

            <ul className="space-y-3 mb-8 flex-1">
              {FREE.map((item) => (
                <li key={item} className="flex items-center gap-3 text-sm text-white/60">
                  <span className="text-white/30 text-xs">✓</span>
                  {item}
                </li>
              ))}
            </ul>

            <Link
              href="https://amortizacao.matematico.com.br/cadastro"
              className="block text-center bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 font-semibold px-6 py-3 rounded-xl transition-all text-sm"
            >
              Começar grátis
            </Link>
          </div>

          {/* Pro */}
          <div className="relative bg-gradient-to-b from-emerald-500/15 to-emerald-500/3 border border-emerald-500/30 rounded-2xl p-8 flex flex-col">
            {/* Badge */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <span className="bg-emerald-500 text-white text-xs font-bold px-4 py-1 rounded-full">
                MAIS POPULAR
              </span>
            </div>

            <div className="mb-6">
              <p className="text-xs font-semibold uppercase tracking-wider text-emerald-400 mb-2">Pro</p>
              <div className="flex items-end gap-2 mb-1">
                <span className="text-5xl font-black text-white">R$ 29</span>
                <span className="text-white/40 text-sm mb-2">/mês</span>
              </div>
              <p className="text-white/30 text-sm">ou R$ 290/ano — economize 2 meses</p>
            </div>

            <ul className="space-y-3 mb-8 flex-1">
              {PRO.map((item, i) => (
                <li key={item} className="flex items-center gap-3 text-sm text-white/80">
                  <span className={`text-xs ${i >= FREE.length ? 'text-emerald-400' : 'text-emerald-400/50'}`}>✓</span>
                  {item}
                  {i >= FREE.length && (
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded font-medium">
                      Pro
                    </span>
                  )}
                </li>
              ))}
            </ul>

            <Link
              href="https://amortizacao.matematico.com.br/planos"
              className="block text-center bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-6 py-3 rounded-xl transition-all hover:scale-105 text-sm"
            >
              Assinar Pro →
            </Link>
          </div>

        </div>

        <p className="text-center text-xs text-white/20 mt-8">
          Cancele quando quiser · Sem fidelidade
        </p>
      </div>
    </section>
  )
}
