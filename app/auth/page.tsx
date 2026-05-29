'use client'

import { Suspense } from 'react'
import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { createSupabaseBrowser } from '@/lib/supabase-browser'

type Aba = 'login' | 'criar' | 'esqueci'

function AuthForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') ?? '/'

  const [aba, setAba] = useState<Aba>((searchParams.get('aba') as Aba) ?? 'login')

  // Campos
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [nome, setNome] = useState('')
  const [mostrarSenha, setMostrarSenha] = useState(false)

  // Estado
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState('')

  function resetar() {
    setErro('')
    setSucesso('')
  }

  function mudarAba(nova: Aba) {
    setAba(nova)
    resetar()
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    resetar()
    setLoading(true)
    const sb = createSupabaseBrowser()
    const { error } = await sb.auth.signInWithPassword({ email, password: senha })
    setLoading(false)
    if (error) { setErro('Email ou senha incorretos.'); return }
    router.push(redirect)
  }

  async function handleCriar(e: React.FormEvent) {
    e.preventDefault()
    resetar()
    if (!nome.trim()) { setErro('Informe seu nome.'); return }
    setLoading(true)
    const sb = createSupabaseBrowser()
    const { error } = await sb.auth.signUp({
      email,
      password: senha,
      options: { data: { full_name: nome } },
    })
    setLoading(false)
    if (error) {
      const msg = error.message.toLowerCase()
      if (msg.includes('already registered') || msg.includes('already exists') || msg.includes('user already')) {
        setErro('Este email já está cadastrado. Faça login ou use outro email.')
      } else if (msg.includes('invalid email')) {
        setErro('Email inválido.')
      } else if (msg.includes('password')) {
        setErro('A senha deve ter pelo menos 6 caracteres.')
      } else {
        setErro('Erro ao criar conta. Tente novamente.')
      }
      return
    }
    setSucesso('Conta criada com sucesso! Redirecionando para o login...')
    setTimeout(() => mudarAba('login'), 2000)
  }

  async function handleEsqueci(e: React.FormEvent) {
    e.preventDefault()
    resetar()
    setLoading(true)
    const sb = createSupabaseBrowser()
    const { error } = await sb.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/nova-senha`,
    })
    setLoading(false)
    if (error) { setErro('Erro ao enviar o email. Verifique o endereço e tente novamente.'); return }
    setSucesso('Email enviado! Verifique sua caixa de entrada para redefinir a senha.')
  }

  const inputClass = "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-emerald-500/50 transition-colors text-sm"
  const labelClass = "text-xs text-white/60 uppercase tracking-wider mb-2 block"

  return (
    <div className="min-h-screen bg-[#080808] flex flex-col items-center justify-center px-4">

      {/* Logo */}
      <Link href="/" className="mb-8">
        <img src="/logo-dark-v3.png" alt="Matemático" className="h-10 w-auto" />
      </Link>

      <div className="w-full max-w-sm">

        {/* Abas */}
        <div className="flex bg-white/5 border border-white/10 rounded-2xl p-1 mb-6">
          {([
            { key: 'login', label: 'Entrar' },
            { key: 'criar', label: 'Criar conta' },
          ] as { key: Aba; label: string }[]).map((item) => (
            <button
              key={item.key}
              onClick={() => mudarAba(item.key)}
              className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-all ${
                aba === item.key
                  ? 'bg-emerald-600 text-white'
                  : 'text-emerald-400 hover:text-emerald-300'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="bg-white/3 border border-white/10 rounded-2xl p-6">

          {/* ── LOGIN ── */}
          {aba === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className={labelClass}>Email</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com" required className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Senha</label>
                <div className="relative">
                  <input type={mostrarSenha ? 'text' : 'password'} value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    placeholder="••••••••" required className={`${inputClass} pr-12`} />
                  <button type="button" onClick={() => setMostrarSenha(!mostrarSenha)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/80 transition-colors p-1">
                    {mostrarSenha
                      ? <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                      : <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                    }
                  </button>
                </div>
              </div>
              {erro && <p className="text-red-400 text-sm">{erro}</p>}
              <button type="submit" disabled={loading}
                className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:bg-white/10 disabled:text-white/30 text-white font-bold py-3 rounded-xl transition-all text-sm cursor-pointer">
                {loading ? 'Entrando...' : 'Entrar →'}
              </button>
              <button type="button" onClick={() => mudarAba('esqueci')}
                className="w-full text-xs text-white/35 hover:text-white/70 transition-colors text-center pt-1">
                Esqueci minha senha
              </button>
            </form>
          )}

          {/* ── CRIAR CONTA ── */}
          {aba === 'criar' && (
            <form onSubmit={handleCriar} className="space-y-4">
              <div>
                <label className={labelClass}>Nome completo</label>
                <input type="text" value={nome} onChange={(e) => setNome(e.target.value)}
                  placeholder="Seu nome" required className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Email</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com" required className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Senha</label>
                <div className="relative">
                  <input type={mostrarSenha ? 'text' : 'password'} value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    placeholder="Mínimo 6 caracteres" required minLength={6}
                    className={`${inputClass} pr-12`} />
                  <button type="button" onClick={() => setMostrarSenha(!mostrarSenha)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/80 transition-colors p-1">
                    {mostrarSenha
                      ? <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                      : <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                    }
                  </button>
                </div>
              </div>
              {erro && <p className="text-red-400 text-sm">{erro}</p>}
              {sucesso && <p className="text-emerald-400 text-sm">{sucesso}</p>}
              {!sucesso && (
                <button type="submit" disabled={loading}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:bg-white/10 disabled:text-white/30 text-white font-bold py-3 rounded-xl transition-all text-sm cursor-pointer">
                  {loading ? 'Criando...' : 'Criar conta →'}
                </button>
              )}
            </form>
          )}

          {/* ── ESQUECI A SENHA ── */}
          {aba === 'esqueci' && (
            <form onSubmit={handleEsqueci} className="space-y-4">
              <p className="text-white/50 text-sm">Digite seu email e enviaremos um link para redefinir sua senha.</p>
              <div>
                <label className={labelClass}>Email</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com" required className={inputClass} />
              </div>
              {erro && <p className="text-red-400 text-sm">{erro}</p>}
              {sucesso && <p className="text-emerald-400 text-sm">{sucesso}</p>}
              {!sucesso && (
                <button type="submit" disabled={loading}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:bg-white/10 disabled:text-white/30 text-white font-bold py-3 rounded-xl transition-all text-sm cursor-pointer">
                  {loading ? 'Enviando...' : 'Enviar link →'}
                </button>
              )}
              <button type="button" onClick={() => mudarAba('login')}
                className="w-full text-xs text-white/35 hover:text-white/70 transition-colors text-center pt-1">
                ← Voltar ao login
              </button>
            </form>
          )}
        </div>

        <p className="text-center text-white/30 text-xs mt-6">
          <Link href="/" className="hover:text-white/60 transition-colors">← Voltar ao site</Link>
        </p>
      </div>
    </div>
  )
}

export default function AuthPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#080808] flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <AuthForm />
    </Suspense>
  )
}
