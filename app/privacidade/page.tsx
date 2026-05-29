import Link from 'next/link'
import { NavClient } from '../NavClient'

export const metadata = {
  title: 'Política de Privacidade · Matemático.com.br',
  description: 'Política de Privacidade da plataforma Matemático.com.br.',
}

export default function PrivacidadePage() {
  return (
    <div className="min-h-screen bg-[#080808] text-white">
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#080808]/80 backdrop-blur-md">
        <div className="relative max-w-6xl mx-auto px-6 h-20 sm:h-24 flex items-center justify-between">
          <NavClient />
        </div>
      </nav>

      <main className="pt-32 pb-16 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="mb-10 text-center">
            <h1 className="text-3xl sm:text-4xl font-bold mb-3">Política de Privacidade</h1>
            <p className="text-white/55 text-sm">Última atualização: 30 de maio de 2026 · Versão preliminar</p>
          </div>

          <article className="prose prose-invert max-w-none space-y-8 text-white/75 leading-relaxed">
            <p className="text-amber-300/85 bg-amber-500/5 border border-amber-500/20 rounded-2xl p-5 text-sm">
              📋 Esta página está em fase de elaboração. A versão completa será publicada em breve, em conformidade
              com a Lei Geral de Proteção de Dados (Lei 13.709/2018 — LGPD).
            </p>

            <section>
              <h2 className="text-xl font-bold text-white mb-3">1. Dados coletados</h2>
              <p>
                Coletamos dados que você nos fornece voluntariamente ao se cadastrar (nome, e-mail) e ao utilizar as
                ferramentas (valores informados em simulações, clientes cadastrados, etc.). Coletamos também dados
                técnicos automáticos (IP, navegador, páginas visitadas) por meio de cookies essenciais ao funcionamento.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3">2. Como usamos seus dados</h2>
              <p>
                Os dados são usados exclusivamente para operar e melhorar a Plataforma. Cálculos e cadastros realizados
                pelo usuário ficam <strong>isolados em sua conta</strong> — outros usuários e a equipe da Plataforma não
                têm acesso aos seus dados pessoais inseridos nas ferramentas.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3">3. Compartilhamento</h2>
              <p>
                Não vendemos nem compartilhamos seus dados com terceiros para fins comerciais. Utilizamos serviços de
                terceiros para hospedagem e infraestrutura (Supabase, Vercel) que processam dados em nome da Plataforma,
                sob obrigações contratuais de confidencialidade.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3">4. Seus direitos (LGPD)</h2>
              <p>
                Você pode solicitar acesso, correção, portabilidade ou exclusão dos seus dados a qualquer momento,
                enviando solicitação para{' '}
                <a href="mailto:josecarlosfortes@gmail.com" className="text-emerald-400 hover:text-emerald-300 underline">
                  josecarlosfortes@gmail.com
                </a>.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3">5. Segurança</h2>
              <p>
                Adotamos medidas técnicas razoáveis (criptografia, autenticação, isolamento por linha em banco de dados)
                para proteger seus dados. Nenhum sistema, contudo, é 100% imune a falhas; recomendamos boas práticas de
                senha forte e única.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3">6. Contato</h2>
              <p>
                Para qualquer dúvida sobre privacidade, escreva para{' '}
                <a href="mailto:josecarlosfortes@gmail.com" className="text-emerald-400 hover:text-emerald-300 underline">
                  josecarlosfortes@gmail.com
                </a>.
              </p>
            </section>
          </article>

          <div className="mt-12 text-center">
            <Link href="/" className="text-emerald-400 hover:text-emerald-300 text-sm font-semibold transition-colors">
              ← Voltar à página inicial
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
