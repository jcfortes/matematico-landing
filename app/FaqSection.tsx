'use client'

import { useState } from 'react'

interface Assunto {
  id: string
  nome: string
}

interface Faq {
  id: string
  categoria: string
  pergunta: string
  resposta: string
  ordem: number
  assunto_id: string | null
  faq_assuntos: { id: string; nome: string }[] | null
}

interface Props {
  baseRegistros: Faq[]
  baseAssuntos: Assunto[]
  faqRegistros: Faq[]
  faqAssuntos: Assunto[]
}

const POR_PAGINA = 5

export function FaqSection({ baseRegistros, baseAssuntos, faqRegistros, faqAssuntos }: Props) {
  // Se ambos estão vazios, nem renderiza
  if (baseRegistros.length === 0 && faqRegistros.length === 0) return null

  return (
    <section id="faq" className="py-24 px-6 border-t border-white/5">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-3">Conteúdos e Dúvidas</h2>
          <p className="text-white/60 max-w-2xl mx-auto">
            Aprenda mais sobre os temas da plataforma e tire dúvidas sobre o uso do sistema.
          </p>
        </div>

        {/* Grid 2 colunas — lado a lado em desktop, empilhado em mobile */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <BlocoAcordeao
            id="base-conhecimento"
            titulo="Base de Conhecimento"
            subtitulo="Conteúdos sobre cálculos, finanças, tributação e índices financeiros."
            registros={baseRegistros}
            assuntos={baseAssuntos}
            placeholder="Em breve cadastraremos conteúdos aqui."
          />
          <BlocoAcordeao
            id="faq"
            titulo="FAQ"
            subtitulo="Perguntas frequentes sobre o uso das ferramentas e do sistema."
            registros={faqRegistros}
            assuntos={faqAssuntos}
            placeholder="Em breve cadastraremos perguntas aqui."
          />
        </div>
      </div>
    </section>
  )
}

// ── Bloco reutilizável (acordeão + paginação + filtro de assunto) ────────────

function BlocoAcordeao({
  id,
  titulo,
  subtitulo,
  registros,
  assuntos,
  placeholder,
}: {
  id: string
  titulo: string
  subtitulo: string
  registros: Faq[]
  assuntos: Assunto[]
  placeholder: string
}) {
  const [assuntoAtivo, setAssuntoAtivo] = useState<string | null>(null)
  const [aberto, setAberto] = useState<string | null>(null)
  const [mostrar, setMostrar] = useState<number>(POR_PAGINA)

  const filtradas = assuntoAtivo === null
    ? registros
    : registros.filter((r) => r.assunto_id === assuntoAtivo)

  const visiveis = filtradas.slice(0, mostrar)
  const temMais = filtradas.length > visiveis.length

  // Só mostra assuntos que têm pelo menos 1 registro
  const assuntosComItens = assuntos.filter((a) => registros.some((r) => r.assunto_id === a.id))

  return (
    <div id={id}>
      <div className="text-center lg:text-left mb-6">
        <h3 className="text-xl font-bold mb-1">{titulo}</h3>
        <p className="text-white/55 text-sm">{subtitulo}</p>
      </div>

      {/* Seletor de assunto */}
      {assuntosComItens.length > 0 && (
        <div className="mb-5">
          <div className="relative">
            <select
              value={assuntoAtivo ?? ''}
              onChange={(e) => { setAssuntoAtivo(e.target.value || null); setAberto(null); setMostrar(POR_PAGINA) }}
              className="appearance-none w-full bg-[#1a1a1a] border border-white/20 rounded-xl pl-5 pr-12 py-3 text-white text-sm font-semibold focus:outline-none focus:border-emerald-500 transition-colors cursor-pointer"
              style={{ colorScheme: 'dark' }}
            >
              <option value="">Todos os assuntos</option>
              {assuntosComItens.map((a) => (
                <option key={a.id} value={a.id}>{a.nome}</option>
              ))}
            </select>
            <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-emerald-400">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
      )}

      {/* Estado vazio */}
      {registros.length === 0 && (
        <p className="text-center text-white/40 text-sm py-12 border border-dashed border-white/10 rounded-2xl">
          {placeholder}
        </p>
      )}

      {/* Acordeão */}
      <div className="space-y-2">
        {visiveis.map((r) => (
          <div key={r.id} className="border border-white/10 rounded-2xl overflow-hidden">
            <button
              onClick={() => setAberto(aberto === r.id ? null : r.id)}
              className="w-full flex items-center justify-between px-5 py-4 text-left text-white hover:bg-white/3 transition-colors cursor-pointer gap-4"
            >
              <span className="font-medium text-sm leading-snug">{r.pergunta}</span>
              <svg
                className={`w-4 h-4 shrink-0 text-emerald-400 transition-transform ${aberto === r.id ? 'rotate-180' : ''}`}
                fill="none" viewBox="0 0 24 24" stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {aberto === r.id && (
              <div className="px-5 pb-5 text-sm text-white/65 leading-relaxed border-t border-white/8 pt-4 bg-white/2">
                {r.resposta}
              </div>
            )}
          </div>
        ))}
      </div>

      {filtradas.length === 0 && registros.length > 0 && (
        <p className="text-center text-white/40 text-sm py-8">Nenhum item neste assunto ainda.</p>
      )}

      {/* Paginação — Ver mais (texto discreto, não botão) */}
      {temMais && (
        <div className="text-center mt-6">
          <button
            type="button"
            onClick={() => setMostrar((n) => n + POR_PAGINA)}
            className="text-emerald-400 hover:text-emerald-300 font-semibold text-sm transition-colors cursor-pointer"
          >
            Ver mais
          </button>
        </div>
      )}

      {/* Ver menos */}
      {!temMais && filtradas.length > POR_PAGINA && (
        <div className="text-center mt-6">
          <button
            type="button"
            onClick={() => { setMostrar(POR_PAGINA); setAberto(null) }}
            className="text-emerald-400 hover:text-emerald-300 font-semibold text-sm transition-colors cursor-pointer"
          >
            Ver menos
          </button>
        </div>
      )}
    </div>
  )
}
