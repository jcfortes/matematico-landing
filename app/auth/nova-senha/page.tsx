'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createSupabaseBrowser } from '@/lib/supabase-browser'

export default function NovaSenhaPage() {
  const router = useRouter()
  const [senha, setSenha] = useState('')
  const [confirmar, setConfirmar] = useState('')
  const [mostrarSenha, setMostrarSenha] = useState(false)
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState('')
  const [pronto, setPronto] = useState(false)

  useEffect(() => {
    const sb = createSupabaseBrowser()
    sb.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        setPronto(true)
      }
    })
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErro('')
    if (senha !== confirmar) { setErro('As senhas não coincidem.'); return }
    if (senha.length < 6) { setErro('A senha deve ter pelo menos 6 caracteres.'); return }
    setLoading(true)
    const { error } = await createSupabaseBrowser().auth.updateUser({ password: senha })
    setLoading(false)
    if (error) { setErro(error.message); return }
    setSucesso('Senha redefinida com sucesso! Redirecionando...')
    setTimeout(() => router.push('/auth'), 2500)
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
        <div className="bg-white/3 border border-white/10 rounded-2xl p-6">

          <h2 className="text-lg font-bold text-white mb-1">Redefinir senha</h2>
          <p className="text-sm text-white/50 mb-6">Digite sua nova senha abaixo.</p>

          {!pronto && !sucesso && (
            <div className="text-center py-4">
              <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-white/50 text-sm">Verificando link...</p>
            </div>
          )}

          {pronto && !sucesso && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className={labelClass}>Nova senha</label>
                <div className="relative">
                  <input
                    type={mostrarSenha ? 'text' : 'password'}
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    placeholder="Mínimo 6 caracteres"
                    required
                    minLength={6}
                    className={`${inputClass} pr-12`}
                  />
                  <button type="button" onClick={() => setMostrarSenha(!mostrarSenha)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/80 transition-colors p-1">
                    {mostrarSenha
                      ? <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                      : <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                    }
                  </button>
                </div>
              </div>
              <div>
                <label className={labelClass}>Confirmar senha</label>
                <input
                  type={mostrarSenha ? 'text' : 'password'}
                  value={confirmar}
                  onChange={(e) => setConfirmar(e.target.value)}
                  placeholder="Repita a nova senha"
                  required
                  className={inputClass}
                />
              </div>
              {erro && <p className="text-red-400 text-sm">{erro}</p>}
              <button type="submit" disabled={loading}
                className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:bg-white/10 disabled:text-white/30 text-white font-bold py-3 rounded-xl transition-all text-sm cursor-pointer">
                {loading ? 'Salvando...' : 'Salvar nova senha →'}
              </button>
            </form>
          )}

          {sucesso && (
            <div className="text-center py-4">
              <div className="text-4xl mb-3">✅</div>
              <p className="text-emerald-400 text-sm font-semibold">{sucesso}</p>
            </div>
          )}
        </div>

        <p className="text-center text-white/30 text-xs mt-6">
          <Link href="/auth" className="hover:text-emerald-400 transition-colors">← Voltar ao login</Link>
        </p>
      </div>
    </div>
  )
}
