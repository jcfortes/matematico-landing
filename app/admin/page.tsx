'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLogin() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [mostrar, setMostrar] = useState(false)
  const [erro, setErro] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setErro('')
    setLoading(true)
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password: senha }),
    })
    setLoading(false)
    if (res.ok) {
      router.push('/admin/faq')
    } else {
      const data = await res.json()
      setErro(data.error ?? 'Erro ao fazer login.')
    }
  }

  return (
    <div className="min-h-screen bg-[#080808] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <p className="text-emerald-400 font-mono text-sm uppercase tracking-widest mb-2">Painel Admin</p>
          <h1 className="text-2xl font-bold text-white">matemático<span className="text-emerald-400">.</span></h1>
        </div>
        <form onSubmit={handleLogin} className="bg-white/3 border border-white/10 rounded-2xl p-6 space-y-4">
          <div>
            <label className="text-xs text-white/60 uppercase tracking-wider mb-2 block">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              required
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-emerald-500/50 transition-colors"
            />
          </div>
          <div>
            <label className="text-xs text-white/60 uppercase tracking-wider mb-2 block">Senha</label>
            <div className="relative">
              <input
                type={mostrar ? 'text' : 'password'}
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pr-12 text-white placeholder-white/30 focus:outline-none focus:border-emerald-500/50 transition-colors"
              />
              <button
                type="button"
                onClick={() => setMostrar(!mostrar)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/80 transition-colors cursor-pointer p-1"
              >
                {mostrar ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
          </div>
          {erro && <p className="text-red-400 text-sm">{erro}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:bg-white/10 disabled:text-white/30 text-white font-bold py-3 rounded-xl transition-all text-sm cursor-pointer"
          >
            {loading ? 'Entrando...' : 'Entrar →'}
          </button>
        </form>
      </div>
    </div>
  )
}
