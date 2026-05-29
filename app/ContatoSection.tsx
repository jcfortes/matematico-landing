'use client'

import { useState } from 'react'

export function ContatoSection() {
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [assunto, setAssunto] = useState('Suporte técnico')
  const [mensagem, setMensagem] = useState('')
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setErro('')

    try {
      const res = await fetch('/api/contato', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, email, assunto, mensagem }),
      })

      if (res.ok) {
        setSucesso(true)
      } else {
        const data = await res.json().catch(() => ({}))
        setErro(data.error || 'Erro ao enviar mensagem. Tente novamente.')
      }
    } catch {
      setErro('Erro ao enviar mensagem. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  const inputClass =
    'w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 text-sm focus:outline-none focus:border-emerald-500/50 transition-colors'
  const labelClass = 'text-xs text-white/60 uppercase tracking-wider mb-2 block'

  return (
    <section id="contato" className="py-24 px-6 border-t border-white/5">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Fale conosco</h2>
          <p className="text-white/60">Envie sua mensagem e respondemos em breve.</p>
        </div>

        {sucesso ? (
          <div className="max-w-lg mx-auto text-center py-12">
            <div className="text-5xl mb-4">✅</div>
            <p className="text-white font-semibold text-lg">Mensagem enviada!</p>
            <p className="text-white/60 text-sm mt-2">Retornaremos em breve.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="max-w-lg mx-auto space-y-5">
            <div>
              <label className={labelClass}>Nome</label>
              <input
                type="text"
                required
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Seu nome"
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Assunto</label>
              <div className="relative">
                <select
                  value={assunto}
                  onChange={(e) => setAssunto(e.target.value)}
                  className="appearance-none bg-white/5 border border-white/10 rounded-xl pl-4 pr-10 py-3 text-white text-sm w-full focus:outline-none focus:border-emerald-500/50 transition-colors cursor-pointer"
                  style={{ colorScheme: 'dark' }}
                >
                  <option value="Suporte técnico">Suporte técnico</option>
                  <option value="Dúvida sobre planos">Dúvida sobre planos</option>
                  <option value="Parceria">Parceria</option>
                  <option value="Imprensa">Imprensa</option>
                  <option value="Outro">Outro</option>
                </select>
                <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-emerald-400">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            <div>
              <label className={labelClass}>Mensagem</label>
              <textarea
                rows={4}
                value={mensagem}
                onChange={(e) => setMensagem(e.target.value)}
                placeholder="Escreva sua mensagem..."
                className={inputClass}
              />
            </div>

            {erro && (
              <p className="text-red-400 text-sm">{erro}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold px-6 py-3 rounded-xl transition-colors text-sm"
            >
              {loading ? 'Enviando...' : 'Enviar mensagem →'}
            </button>
          </form>
        )}
      </div>
    </section>
  )
}
