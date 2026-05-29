import Link from 'next/link'
import { NavClient } from '../NavClient'

export const metadata = {
  title: 'Termos de Uso · Matemático.com.br',
  description: 'Termos de Uso da plataforma Matemático.com.br — clareza financeira para profissionais e tomadores de crédito.',
}

export default function TermosPage() {
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
            <h1 className="text-3xl sm:text-4xl font-bold mb-3">Termos de Uso</h1>
            <p className="text-white/55 text-sm">
              Última atualização: 30 de maio de 2026 · Versão preliminar
            </p>
          </div>

          {/* Bloco de destaque — pontos-chave */}
          <div className="bg-amber-500/5 border border-amber-500/20 rounded-2xl p-6 mb-10">
            <p className="text-amber-300 text-sm font-semibold mb-3">⚠️ Em resumo</p>
            <ul className="text-amber-100/85 text-sm space-y-2 leading-relaxed">
              <li>• A plataforma é uma <strong>ferramenta de apoio</strong>; não substitui a análise profissional especializada.</li>
              <li>• <strong>Trata-se de obrigação de meio</strong> — entregamos as melhores ferramentas, mas não asseguramos plenamente os resultados.</li>
              <li>• Os cálculos dependem de <strong>fontes públicas</strong> (Banco Central, IBGE, FGV) e <strong>tecnologias de terceiros</strong> (incluindo IA), sujeitas a falhas, atualizações e indisponibilidades.</li>
              <li>• Antes de utilizar resultados em <strong>contratos, processos judiciais ou decisões comerciais</strong>, revise-os com um profissional qualificado.</li>
            </ul>
          </div>

          <article className="prose prose-invert max-w-none space-y-8 text-white/75 leading-relaxed">

            <section>
              <h2 className="text-xl font-bold text-white mb-3">1. Aceitação dos Termos</h2>
              <p>
                Ao acessar e utilizar a plataforma Matemático.com.br ("Plataforma"), o Usuário declara estar de acordo
                com estes Termos de Uso e com a Política de Privacidade. Caso não concorde, não deve utilizá-la.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3">2. Descrição do Serviço</h2>
              <p>
                A Plataforma oferece um conjunto de calculadoras financeiras (atualmente: Sistema de Atualização
                Monetária e Sistema de Amortização e Financiamento, entre outros que poderão ser lançados) destinadas
                a apoiar profissionais (advogados, contadores, consultores) e pessoas físicas em análises e simulações
                de natureza financeira.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3">3. Natureza da Obrigação — Meio, não Resultado</h2>
              <p>
                A Plataforma constitui uma <strong>obrigação de meio</strong> e não de resultado. Isso significa que
                nos comprometemos a fornecer ferramentas tecnologicamente adequadas e baseadas nas melhores práticas
                conhecidas, sem garantir que os resultados obtidos sejam livres de erros, divergências ou estejam
                permanentemente alinhados a interpretações futuras de normas, jurisprudência ou variações de
                metodologia de órgãos oficiais.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3">4. Necessidade de Revisão Profissional</h2>
              <p>
                Os resultados da Plataforma são <strong>auxiliares</strong> e <strong>não substituem</strong> a análise
                e a responsabilidade técnica de profissional habilitado (advogado, contador, perito judicial, consultor
                financeiro ou outro especialista). É <strong>obrigação do Usuário</strong> revisar os cálculos antes
                de utilizá-los para finalidades contratuais, judiciais, tributárias, comerciais ou regulatórias.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3">5. Fontes de Dados e Tecnologias de Terceiros</h2>
              <p>
                A Plataforma utiliza dados públicos disponibilizados por órgãos oficiais (Banco Central do Brasil,
                IBGE, Fundação Getulio Vargas, entre outros), bem como infraestrutura, APIs e tecnologias de
                terceiros — incluindo, sem limitação, ferramentas de <strong>Inteligência Artificial generativa</strong>
                no desenvolvimento e operação do produto.
              </p>
              <p>
                Tais fontes e tecnologias podem apresentar <strong>indisponibilidades, atrasos, atualizações
                metodológicas ou erros</strong>. A Plataforma não se responsabiliza por consequências decorrentes
                de tais ocorrências, ainda que adote esforços razoáveis para mitigá-las.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3">6. Limitação de Responsabilidade</h2>
              <p>
                Na máxima extensão permitida pela legislação aplicável, a Plataforma, seus operadores, sócios,
                colaboradores e prestadores de serviço <strong>não respondem por danos diretos, indiretos,
                lucros cessantes, perdas patrimoniais, judiciais, tributárias ou comerciais</strong> decorrentes
                do uso ou da impossibilidade de uso da Plataforma, da confiança em seus resultados ou de erros nos
                dados de origem.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3">7. Uso Adequado</h2>
              <p>
                O Usuário compromete-se a utilizar a Plataforma de boa-fé, respeitando a legislação vigente, os
                direitos de terceiros e as funcionalidades previstas. É vedada a engenharia reversa, automação de
                acesso fora dos limites razoáveis e qualquer uso que possa comprometer a estabilidade do serviço.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3">8. Conta do Usuário</h2>
              <p>
                Determinadas funcionalidades exigem cadastro. O Usuário é responsável por manter a confidencialidade
                das credenciais de acesso e por todas as atividades realizadas em sua conta.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3">9. Propriedade Intelectual</h2>
              <p>
                Todo o conteúdo, código, design, marcas, layouts, textos, banco de dados e materiais publicados na
                Plataforma são protegidos por direitos autorais e demais leis de propriedade intelectual. Seu uso
                não confere qualquer direito de reprodução, distribuição ou exploração comercial.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3">10. Alterações nos Termos</h2>
              <p>
                Estes Termos podem ser alterados a qualquer tempo. As versões anteriores ficarão disponíveis mediante
                solicitação. O uso continuado da Plataforma após alterações implica aceitação da versão atualizada.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3">11. Lei Aplicável e Foro</h2>
              <p>
                Estes Termos são regidos pela legislação brasileira. Fica eleito o foro da Comarca de Fortaleza/CE
                para dirimir quaisquer controvérsias, com renúncia a qualquer outro, por mais privilegiado que seja.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3">12. Contato</h2>
              <p>
                Em caso de dúvidas, sugestões ou solicitações relativas a estes Termos, utilize o{' '}
                <Link href="/#contato" className="text-emerald-400 hover:text-emerald-300 underline">formulário de contato</Link>{' '}
                na página inicial. Responderemos em até 2 dias úteis.
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
