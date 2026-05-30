'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createSupabaseBrowser } from '@/lib/supabase-browser'

// Fallback caso o admin não envie a lista (acesso direto, banco offline, etc)
const APPS_FALLBACK = [
  { label: 'Sistema de Atualização Monetária', href: 'https://atualizacao.matematico.com.br' },
  { label: 'Sistema de Amortização e Financiamento', href: 'https://amortizacao.matematico.com.br' },
  { label: 'Valuation Empresarial', href: 'https://avaliacao.matematico.com.br' },
]

interface NavClientProps {
  /** Lista de apps a exibir no dropdown — geralmente vem do landing_apps via admin */
  apps?: { label: string; href: string }[]
  textoInicio?: string
  textoAplicativos?: string
  textoSimular?: string
  textoBaseConhecimento?: string
  textoFaq?: string
  textoContato?: string
  textoSair?: string
  textoLogin?: string
  textoCriarConta?: string
}

export function NavClient({
  apps: appsExternos,
  textoInicio = 'Início',
  textoAplicativos = 'Aplicativos',
  textoSimular = 'Simular',
  textoBaseConhecimento = 'Base de Conhecimento',
  textoFaq = 'FAQ',
  textoContato = 'Contato',
  textoSair = 'Sair →',
  textoLogin = 'Login',
  textoCriarConta = 'Criar conta',
}: NavClientProps = {}) {
  const apps = appsExternos && appsExternos.length > 0 ? appsExternos : APPS_FALLBACK
  const linksBefore = [
    { label: textoInicio, href: '#' },
  ]
  const linksAfter = [
    { label: textoSimular, href: '#simulador' },
    { label: textoBaseConhecimento, href: '#base-conhecimento' },
    { label: textoFaq, href: '#faq' },
    { label: textoContato, href: '#contato' },
  ]

  const links = [...linksBefore, ...linksAfter]
  const [mobileOpen, setMobileOpen] = useState(false)
  const [appsOpen, setAppsOpen] = useState(false)
  const [logado, setLogado] = useState(false)

  useEffect(() => {
    const sb = createSupabaseBrowser()
    sb.auth.getSession().then(({ data }) => {
      setLogado(!!data.session)
    })
    const { data: { subscription } } = sb.auth.onAuthStateChange((_event, session) => {
      setLogado(!!session)
    })
    return () => subscription.unsubscribe()
  }, [])

  async function handleSair() {
    const sb = createSupabaseBrowser()
    await sb.auth.signOut()
    setMobileOpen(false)
    window.location.href = '/'
  }

  return (
    <>
      {/* ── DESKTOP ── */}
      <div className="hidden sm:flex items-center gap-6">
        {linksBefore.map((l) => (
          <a key={l.href} href={l.href} className="text-base text-white/70 hover:text-emerald-400 transition-colors">
            {l.label}
          </a>
        ))}

        {/* Dropdown Aplicativos */}
        <div className="relative">
          <button
            onClick={() => setAppsOpen(!appsOpen)}
            className="text-base text-white/70 hover:text-emerald-400 transition-colors flex items-center gap-1"
          >
            {textoAplicativos}
            <svg className={`w-4 h-4 transition-transform ${appsOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {appsOpen && (
            <div className="absolute left-0 top-full mt-2 w-48 bg-[#1a1a1a] border border-white/10 rounded-xl overflow-hidden shadow-xl z-50">
              {apps.map((app) => (
                <Link
                  key={app.href}
                  href={app.href}
                  onClick={() => setAppsOpen(false)}
                  className="block px-4 py-3 text-sm text-white/70 hover:text-emerald-400 hover:bg-white/5 transition-colors"
                >
                  {app.label}
                </Link>
              ))}
            </div>
          )}
        </div>

        {linksAfter.map((l) => (
          <a key={l.href} href={l.href} className="text-base text-white/70 hover:text-emerald-400 transition-colors">
            {l.label}
          </a>
        ))}

        {/* Auth buttons */}
        <div className="flex items-center gap-2 ml-2">
          {logado ? (
            <button
              onClick={handleSair}
              className="text-sm font-semibold text-emerald-400 hover:text-emerald-300 transition-colors px-3 py-2 cursor-pointer"
            >
              {textoSair}
            </button>
          ) : (
            <>
              <Link
                href="/auth"
                className="text-sm font-semibold text-white/70 hover:text-emerald-400 transition-colors px-3 py-2"
              >
                {textoLogin}
              </Link>
              <Link
                href="/auth?aba=criar"
                className="text-sm font-bold bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-xl transition-all"
              >
                {textoCriarConta}
              </Link>
            </>
          )}
        </div>
      </div>

      {/* ── MOBILE: botão hambúrguer ── */}
      <div className="sm:hidden">
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 text-white/60 hover:text-emerald-400 transition-colors"
          aria-label="Menu"
        >
          {mobileOpen ? (
            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>

        {/* Dropdown mobile */}
        {mobileOpen && (
          <div className="absolute top-full left-0 right-0 bg-[#0f0f0f] border-b border-white/10 py-4 px-6 flex flex-col gap-1 z-50">
            {linksBefore.map((l) => (
              <a key={l.href} href={l.href} onClick={() => setMobileOpen(false)}
                className="text-base text-white/75 hover:text-emerald-400 transition-colors py-2.5 border-b border-white/5">
                {l.label}
              </a>
            ))}

            {/* Aplicativos */}
            <div className="py-1 border-b border-white/5">
              <p className="text-xs text-white/30 uppercase tracking-wider mb-2 pt-1">{textoAplicativos}</p>
              {apps.map((app) => (
                <Link key={app.href} href={app.href} onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 text-base text-emerald-400 hover:text-emerald-300 transition-colors py-2.5">
                  → {app.label}
                </Link>
              ))}
            </div>

            {linksAfter.map((l) => (
              <a key={l.href} href={l.href} onClick={() => setMobileOpen(false)}
                className="text-base text-white/75 hover:text-emerald-400 transition-colors py-2.5 border-b border-white/5">
                {l.label}
              </a>
            ))}

            {/* Auth mobile */}
            {logado ? (
              <button
                onClick={handleSair}
                className="text-base font-semibold text-emerald-400 hover:text-emerald-300 transition-colors py-2.5 text-left cursor-pointer mt-3 pt-4 border-t border-white/10"
              >
                {textoSair}
              </button>
            ) : (
              <div className="flex flex-col gap-2 pt-3">
                <Link href="/auth" onClick={() => setMobileOpen(false)}
                  className="text-base text-white/75 hover:text-emerald-400 transition-colors py-2.5 text-center border border-white/10 rounded-xl">
                  {textoLogin}
                </Link>
                <Link href="/auth?aba=criar" onClick={() => setMobileOpen(false)}
                  className="text-base font-bold bg-emerald-600 hover:bg-emerald-500 text-white py-3 rounded-xl text-center transition-all">
                  {textoCriarConta}
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  )
}
