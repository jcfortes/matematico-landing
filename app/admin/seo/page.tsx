import Link from 'next/link'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { AdminLayout } from '../AdminLayout'
import { SEO_KEYWORDS_POR_CATEGORIA } from '@/lib/seo-keywords'
import { SeoConfigForm } from './SeoConfigForm'

export const dynamic = 'force-dynamic'

const SITE_URL = 'https://matematico.com.br'

export default async function SeoAdminPage() {
  const { data: itens } = await supabaseAdmin
    .from('landing_content')
    .select('key, valor, descricao')
    .eq('secao', 'SEO')
    .order('ordem')

  const seo: Record<string, { valor: string; descricao: string | null }> = {}
  for (const i of itens ?? []) {
    seo[i.key] = { valor: i.valor, descricao: i.descricao }
  }

  const titulo = seo['seo.titulo']?.valor ?? ''
  const descricao = seo['seo.descricao']?.valor ?? ''
  const googleVerif = seo['seo.google_verification']?.valor ?? ''

  return (
    <AdminLayout>
      <div className="p-8 max-w-5xl">
        <div className="mb-6">
          <h1 className="text-xl font-bold">SEO da Landing</h1>
          <p className="text-white/50 text-sm mt-1">
            Configurações de SEO (Otimização para Buscadores). O que você ajusta aqui afeta como o Matemático.com.br aparece no Google, WhatsApp, LinkedIn e outras plataformas.
          </p>
        </div>

        {/* ── BLOCO 1: Edição de campos críticos ── */}
        <SeoConfigForm
          tituloInicial={titulo}
          descricaoInicial={descricao}
          googleVerifInicial={googleVerif}
        />

        {/* ── BLOCO 2: Diagnóstico / arquivos automáticos ── */}
        <div className="mt-8 border border-white/10 rounded-2xl p-6 bg-white/3">
          <h2 className="text-base font-bold text-emerald-400 mb-4">📡 Arquivos automáticos do site</h2>
          <p className="text-sm text-white/55 mb-4">
            Esses arquivos são gerados automaticamente pelo sistema. Clique para visualizar:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <CardLink
              titulo="sitemap.xml"
              descricao="Lista de páginas que o Google deve indexar"
              href={`${SITE_URL}/sitemap.xml`}
            />
            <CardLink
              titulo="robots.txt"
              descricao="Instruções para os robôs dos buscadores"
              href={`${SITE_URL}/robots.txt`}
            />
            <CardLink
              titulo="Imagem Open Graph"
              descricao="Preview que aparece ao compartilhar o link"
              href={`${SITE_URL}/opengraph-image`}
            />
            <CardLink
              titulo="Página inicial"
              descricao="Inspecionar o HTML com todos os meta tags"
              href={SITE_URL}
            />
          </div>
        </div>

        {/* ── BLOCO 3: Ferramentas de validação ── */}
        <div className="mt-8 border border-white/10 rounded-2xl p-6 bg-white/3">
          <h2 className="text-base font-bold text-emerald-400 mb-4">🔍 Ferramentas para testar</h2>
          <p className="text-sm text-white/55 mb-4">
            Sites externos que validam se o SEO do Matemático está bem configurado:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <CardLink
              titulo="Preview de compartilhamento"
              descricao="Como o link aparece em WhatsApp/LinkedIn"
              href={`https://www.opengraph.xyz/?url=${encodeURIComponent(SITE_URL)}`}
            />
            <CardLink
              titulo="Google — Rich Results Test"
              descricao="Valida os dados estruturados (JSON-LD)"
              href={`https://search.google.com/test/rich-results?url=${encodeURIComponent(SITE_URL)}`}
            />
            <CardLink
              titulo="Google PageSpeed Insights"
              descricao="Velocidade + SEO + acessibilidade"
              href={`https://pagespeed.web.dev/analysis?url=${encodeURIComponent(SITE_URL)}`}
            />
            <CardLink
              titulo="Google Search Console"
              descricao="Painel oficial — exige cadastro e verificação"
              href="https://search.google.com/search-console"
            />
          </div>
        </div>

        {/* ── BLOCO 4: Keywords (read-only) ── */}
        <div className="mt-8 border border-white/10 rounded-2xl p-6 bg-white/3">
          <h2 className="text-base font-bold text-emerald-400 mb-2">🔑 Palavras-chave configuradas</h2>
          <p className="text-sm text-white/55 mb-4">
            Termos pelos quais o Google pode encontrar a plataforma. Cadastrados no código (não editáveis no admin para preservar consistência).
            <span className="text-white/40"> Total: <strong className="text-white/65">{Object.values(SEO_KEYWORDS_POR_CATEGORIA).flat().length} palavras-chave</strong></span>
          </p>
          {Object.entries(SEO_KEYWORDS_POR_CATEGORIA).map(([categoria, palavras]) => (
            <div key={categoria} className="mb-5 last:mb-0">
              <p className="text-xs font-bold text-white/60 uppercase tracking-wider mb-2">{categoria}</p>
              <div className="flex flex-wrap gap-2">
                {palavras.map((p) => (
                  <span key={p} className="text-xs bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 px-2.5 py-1 rounded-full">
                    {p}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* ── BLOCO 5: Como verificar no Google Search Console ── */}
        <div className="mt-8 border border-amber-500/20 rounded-2xl p-6 bg-amber-500/5">
          <h2 className="text-base font-bold text-amber-400 mb-3">📌 Passo a passo — Google Search Console</h2>
          <p className="text-sm text-white/75 mb-3">
            Para o Google indexar oficialmente o site e mostrar relatórios:
          </p>
          <ol className="text-sm text-white/70 space-y-2 list-decimal pl-5 leading-relaxed">
            <li>Acesse <Link href="https://search.google.com/search-console" target="_blank" className="text-emerald-400 hover:text-emerald-300 underline">search.google.com/search-console</Link></li>
            <li>Em "Add property", escolha <strong>URL prefix</strong> e digite <code className="bg-white/10 px-1.5 py-0.5 rounded text-white/90">https://matematico.com.br</code></li>
            <li>Em métodos de verificação, escolha <strong>HTML tag</strong></li>
            <li>O Google mostrará algo como <code className="bg-white/10 px-1.5 py-0.5 rounded text-white/90">&lt;meta name=&quot;google-site-verification&quot; content=&quot;ABC123...&quot; /&gt;</code></li>
            <li>Copie apenas o valor de <code className="bg-white/10 px-1.5 py-0.5 rounded text-white/90">content=&quot;...&quot;</code> (ex: <code className="bg-white/10 px-1.5 py-0.5 rounded text-white/90">ABC123...</code>)</li>
            <li>Cole no campo <strong>&quot;Código de verificação do Google&quot;</strong> mais acima nessa página e salve</li>
            <li>Volte ao Search Console e clique em <strong>Verify</strong></li>
            <li>Pronto! O Google passa a indexar oficialmente</li>
          </ol>
        </div>
      </div>
    </AdminLayout>
  )
}

function CardLink({ titulo, descricao, href }: { titulo: string; descricao: string; href: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group block border border-white/10 hover:border-emerald-500/40 bg-white/3 hover:bg-emerald-500/5 rounded-xl p-4 transition-all"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-white group-hover:text-emerald-400 transition-colors">{titulo}</p>
          <p className="text-xs text-white/50 mt-1">{descricao}</p>
        </div>
        <svg className="w-4 h-4 text-white/30 group-hover:text-emerald-400 transition-colors shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
        </svg>
      </div>
    </a>
  )
}
