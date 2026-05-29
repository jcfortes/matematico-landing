import Link from "next/link";
import { Simulador } from "./Simulador";
import { NavClient } from "./NavClient";
import { FaqSection } from "./FaqSection";
import { ContatoSection } from "./ContatoSection";
import { supabase } from "@/lib/supabase";
import { getLandingContent } from "@/lib/landing-content";

const apps = [
  {
    slug: "atualizacao",
    url: "https://atualizacao.matematico.com.br",
    emoji: "📈",
    nome: "Sistema de Atualização Monetária",
    tagline: "Atualização de Valores",
    descricao: "Atualize valores pela inflação com IPCA, IGPM, INPC e outros índices. Calcule juros, multas e correções monetárias com precisão.",
    recursos: ["IPCA, IGPM, INPC", "Juros e multas", "Série histórica", "Exportar laudo"],
    status: "ativo",
    corBorda: "border-emerald-500/30",
    corGrad: "from-emerald-500/15 to-emerald-500/3",
    corCheck: "text-emerald-400",
    corBtn: "bg-emerald-600 hover:bg-emerald-500",
    corTag: "text-emerald-400",
  },
  {
    slug: "amortizacao",
    url: "https://amortizacao.matematico.com.br",
    emoji: "📊",
    nome: "Sistema de Amortização e Financiamento",
    tagline: "Sistema de Financiamentos",
    descricao: "Calcule cronogramas completos de amortização pelo sistema Price, SAC ou Variável. Simule carência, balões e veja o custo efetivo total.",
    recursos: ["Price, SAC e Variável", "Pagamentos balão", "Carência", "Exportar PDF e Excel"],
    status: "ativo",
    corBorda: "border-emerald-500/30",
    corGrad: "from-emerald-500/15 to-emerald-500/3",
    corCheck: "text-emerald-400",
    corBtn: "bg-emerald-600 hover:bg-emerald-500",
    corTag: "text-emerald-400",
  },
  {
    slug: "avaliacao",
    url: "#",
    emoji: "🏢",
    nome: "Avaliação",
    tagline: "Avaliação de Empresas",
    descricao: "Valuation completo pelo método do fluxo de caixa descontado, múltiplos de mercado e patrimônio líquido ajustado.",
    recursos: ["Fluxo de caixa descontado", "Múltiplos de mercado", "Relatório executivo", "Comparativo setorial"],
    status: "breve",
    corBorda: "border-white/10",
    corGrad: "from-white/3 to-white/1",
    corCheck: "text-white/40",
    corBtn: "",
    corTag: "text-white/40",
  },
];

const diferenciais = [
  { icone: "🎯", titulo: "Precisão", descricao: "Cálculos baseados em matemática financeira rigorosa, com resultados confiáveis para decisões importantes." },
  { icone: "⚡", titulo: "Velocidade", descricao: "Resultados instantâneos. Simule cenários em segundos e compare alternativas sem esperar." },
  { icone: "📋", titulo: "Relatórios", descricao: "Exporte cronogramas e análises em PDF e Excel, prontos para apresentação ou arquivo." },
  { icone: "🔒", titulo: "Segurança", descricao: "Seus dados ficam protegidos com autenticação segura e armazenamento criptografado." },
];

export const dynamic = 'force-dynamic'

export default async function Home() {
  // Conteúdo editável da LP (CMS leve) — busca com fallback hardcoded
  const c = await getLandingContent()

  const [{ data: registros }, { data: assuntos }] = await Promise.all([
    supabase
      .from('faq')
      .select('id, categoria, pergunta, resposta, ordem, assunto_id, tipo, faq_assuntos(id, nome)')
      .eq('ativo', true)
      .order('ordem')
      .order('created_at'),
    supabase
      .from('faq_assuntos')
      .select('id, nome, tipo')
      .order('nome'),
  ])

  // Separa por tipo (default 'base' caso a coluna ainda não esteja presente em registros antigos)
  type Reg = { id: string; categoria: string; pergunta: string; resposta: string; ordem: number; assunto_id: string | null; tipo?: string | null; faq_assuntos: { id: string; nome: string }[] | null }
  type Ass = { id: string; nome: string; tipo?: string | null }
  const todos: Reg[] = registros ?? []
  const todasAssuntos: Ass[] = assuntos ?? []
  const baseRegistros = todos.filter((r) => (r.tipo ?? 'base') === 'base')
  const faqRegistros = todos.filter((r) => r.tipo === 'faq')
  const baseAssuntos = todasAssuntos.filter((a) => (a.tipo ?? 'base') === 'base')
  const faqAssuntos = todasAssuntos.filter((a) => a.tipo === 'faq')

  return (
    <div className="min-h-screen bg-[#080808] text-white">

      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#080808]/80 backdrop-blur-md">
        <div className="relative max-w-6xl mx-auto px-6 h-20 sm:h-24 flex items-center justify-between">
          <div>
            <a href="#">
              <img src="/logo-dark-v3.png" alt="Matemático" className="h-12 sm:h-16 w-auto" />
            </a>
          </div>
          <NavClient />
        </div>
      </nav>

      {/* HERO */}
      <section className="pt-48 sm:pt-52 pb-24 px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-emerald-500/5 rounded-full blur-[120px]" />
        </div>
        <div className="relative max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 text-sm text-white/70 mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className={c.classes('hero.badge')}>{c('hero.badge', 'Plataforma de ferramentas matemáticas e financeiras')}</span>
          </div>
          <h1 className="text-6xl sm:text-7xl md:text-8xl font-black tracking-tight mb-6 leading-none">
            <span className="text-white">matem</span><span className="text-emerald-400">á</span><span className="text-white">tico</span><span className="text-emerald-400">.</span>
          </h1>
          <p className="text-xl sm:text-2xl text-white/60 font-light mb-4 tracking-wide">
            <span className={`text-white/90 font-medium ${c.classes('hero.tagline')}`}>{c('hero.tagline', 'Clareza Financeira.')}</span>
          </p>
          <p className={`text-base text-white/55 max-w-xl mx-auto mb-12 ${c.classes('hero.descricao')}`}>
            {c('hero.descricao', 'Um ecossistema de ferramentas especializadas em matemática financeira, desenvolvidas para profissionais que precisam de resultados confiáveis.')}
          </p>
          <a href="#simulador" className={`inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-8 py-4 rounded-xl transition-all hover:scale-105 ${c.classes('hero.cta')}`}>
            {c('hero.cta', 'Simular agora ↓')}
          </a>
        </div>
      </section>

      {/* SIMULADOR */}
      <Simulador />

      {/* APPS */}
      <section id="apps" className="py-24 px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className={`text-3xl sm:text-4xl font-bold mb-4 ${c.classes('apps.titulo')}`}>{c('apps.titulo', 'Ferramentas especializadas')}</h2>
            <p className={`text-white/60 max-w-xl mx-auto ${c.classes('apps.descricao')}`}>{c('apps.descricao', 'Cada app é focado em um domínio específico da matemática financeira, com a profundidade que profissionais exigem.')}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {apps.map((app) => (
              <div key={app.slug} className={`relative rounded-2xl border ${app.corBorda} bg-gradient-to-b ${app.corGrad} p-6 flex flex-col`}>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-4xl">{app.emoji}</span>
                  {app.status === "ativo" ? (
                    <span className="text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 px-2.5 py-1 rounded-full">● Disponível</span>
                  ) : (
                    <span className="text-xs font-semibold bg-white/5 text-white/30 border border-white/10 px-2.5 py-1 rounded-full">Em breve</span>
                  )}
                </div>
                <p className={`text-xs font-semibold uppercase tracking-wider mb-1 ${app.corTag}`}>{app.tagline}</p>
                <h3 className="text-xl font-bold mb-3">{app.nome}</h3>
                <p className="text-sm text-white/65 mb-5 flex-1 leading-relaxed">{app.descricao}</p>
                <ul className="space-y-1.5 mb-6">
                  {app.recursos.map((r) => (
                    <li key={r} className="flex items-center gap-2 text-sm text-white/75">
                      <span className={`text-xs ${app.corCheck}`}>✓</span>{r}
                    </li>
                  ))}
                  <li className={`flex items-center gap-2 text-sm font-semibold italic pl-5 ${app.corTag}`}>
                    e muito mais…
                  </li>
                </ul>
                {app.status === "ativo" ? (
                  <Link href={app.url} className={`${app.corBtn} text-white text-sm font-semibold px-4 py-3 rounded-xl text-center transition-colors`}>
                    Acessar {app.nome} →
                  </Link>
                ) : (
                  <button disabled className="bg-white/5 text-white/25 text-sm font-semibold px-4 py-3 rounded-xl text-center cursor-not-allowed border border-white/5">
                    Em desenvolvimento
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DIFERENCIAIS */}
      <section id="diferenciais" className="py-24 px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className={`text-3xl sm:text-4xl font-bold mb-4 ${c.classes('diferenciais.titulo')}`}>{c('diferenciais.titulo', 'Por que o Matemático?')}</h2>
            <p className={`text-white/60 max-w-xl mx-auto ${c.classes('diferenciais.descricao')}`}>{c('diferenciais.descricao', 'Desenvolvido para quem precisa de resultados confiáveis, não de aproximações.')}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="bg-white/3 border border-white/8 rounded-2xl p-6 hover:bg-white/5 transition-colors">
                <div className={`text-3xl mb-4 ${c.classes(`diferenciais.${n}.icone`)}`}>{c(`diferenciais.${n}.icone`, diferenciais[n - 1].icone)}</div>
                <h3 className={`font-bold text-lg mb-2 ${c.classes(`diferenciais.${n}.titulo`)}`}>{c(`diferenciais.${n}.titulo`, diferenciais[n - 1].titulo)}</h3>
                <p className={`text-sm text-white/65 leading-relaxed ${c.classes(`diferenciais.${n}.descricao`)}`}>{c(`diferenciais.${n}.descricao`, diferenciais[n - 1].descricao)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 border-t border-white/5">
        <div className="max-w-3xl mx-auto text-center">
          <div className="bg-gradient-to-b from-emerald-500/10 to-transparent border border-emerald-500/20 rounded-3xl p-12">
            <h2 className={`text-3xl sm:text-4xl font-bold mb-4 ${c.classes('cta.titulo')}`}>{c('cta.titulo', 'Comece agora, gratuitamente')}</h2>
            <p className={`text-white/65 mb-8 text-lg ${c.classes('cta.descricao')}`}>{c('cta.descricao', 'Calcule seu primeiro financiamento em menos de 2 minutos. Sem cartão de crédito.')}</p>
            <Link href="https://amortizacao.matematico.com.br/cadastro" className={`inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-10 py-4 rounded-xl text-lg transition-all hover:scale-105 ${c.classes('cta.botao')}`}>
              {c('cta.botao', 'Criar conta grátis →')}
            </Link>
          </div>
        </div>
      </section>

      {/* Base de Conhecimento + FAQ (lado a lado) */}
      <FaqSection
        baseRegistros={baseRegistros}
        baseAssuntos={baseAssuntos}
        faqRegistros={faqRegistros}
        faqAssuntos={faqAssuntos}
      />

      {/* CONTATO */}
      <ContatoSection />

      {/* RODAPÉ */}
      <footer className="border-t border-white/5 py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col items-center gap-3 w-full">
            <div className="flex gap-6 text-sm text-white/55 flex-wrap justify-center">
              <Link href="https://atualizacao.matematico.com.br" className="hover:text-emerald-400 transition-colors">Sistema de Atualização Monetária</Link>
              <Link href="https://amortizacao.matematico.com.br" className="hover:text-emerald-400 transition-colors">Sistema de Amortização e Financiamento</Link>
              <span className="text-white/30">Avaliação (breve)</span>
            </div>
            <Link href="/#contato" className="text-sm text-white/55 hover:text-emerald-400 transition-colors">
              Contato
            </Link>
            <div className="flex gap-5 text-xs text-white/40 mt-2">
              <Link href="/termos" className="hover:text-emerald-400 transition-colors">Termos de Uso</Link>
              <Link href="/privacidade" className="hover:text-emerald-400 transition-colors">Política de Privacidade</Link>
            </div>
          </div>

          {/* Aviso técnico/jurídico */}
          <div className="border-t border-white/5 mt-8 pt-6 max-w-3xl mx-auto">
            <p className={`text-[11px] text-white/40 leading-relaxed text-center ${c.classes('rodape.aviso')}`}>
              <span className="font-semibold text-white/55">⚠️ Aviso importante:</span>{' '}
              {c('rodape.aviso', 'A plataforma é uma ferramenta de apoio ao trabalho profissional e não substitui a revisão por contador, advogado ou especialista qualificado.')}{' '}
              Ver <Link href="/termos" className="text-emerald-400/80 hover:text-emerald-400 underline">Termos de Uso completos</Link>.
            </p>
          </div>

          <div className={`border-t border-white/5 mt-6 pt-6 text-center text-xs text-white/40 ${c.classes('rodape.copyright')}`}>
            {c('rodape.copyright', '© 2026 Matemático.com.br · Todos os direitos reservados')}
          </div>
        </div>
      </footer>

    </div>
  );
}
