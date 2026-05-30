import Link from 'next/link'
import type { SecaoCustom } from '@/lib/landing-secoes-custom'

/**
 * Renderiza uma seção customizada criada pelo admin via CMS.
 * Suporta 4 layouts via `imagem_posicao`:
 *   sem      → apenas texto centralizado
 *   topo     → imagem acima, texto abaixo
 *   esquerda → imagem à esquerda, texto à direita (grid 2 col)
 *   direita  → texto à esquerda, imagem à direita
 */
export function SecaoCustomizada({ secao }: { secao: SecaoCustom }) {
  const { titulo, subtitulo, descricao, imagem_url, imagem_posicao, cta_texto, cta_url, slug } = secao

  const Imagem = imagem_url ? (
    <img
      src={imagem_url}
      alt={titulo}
      className="rounded-2xl border border-white/10 w-full h-auto object-cover max-h-[420px]"
    />
  ) : null

  const Texto = (
    <div className={imagem_posicao === 'sem' || imagem_posicao === 'topo' ? 'text-center max-w-2xl mx-auto' : ''}>
      {subtitulo && (
        <p className="text-xs font-semibold uppercase tracking-wider text-emerald-400 mb-2">
          {subtitulo}
        </p>
      )}
      <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 leading-tight">{titulo}</h2>
      {descricao && (
        <p className="text-base text-white/65 leading-relaxed whitespace-pre-line mb-6">
          {descricao}
        </p>
      )}
      {cta_texto && cta_url && (
        <Link
          href={cta_url}
          className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-6 py-3 rounded-xl transition-all hover:scale-105"
        >
          {cta_texto}
        </Link>
      )}
    </div>
  )

  // Layout selector
  let conteudo: React.ReactNode
  if (imagem_posicao === 'sem' || !Imagem) {
    conteudo = Texto
  } else if (imagem_posicao === 'topo') {
    conteudo = (
      <div className="max-w-4xl mx-auto space-y-8">
        {Imagem}
        {Texto}
      </div>
    )
  } else if (imagem_posicao === 'esquerda') {
    conteudo = (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center max-w-6xl mx-auto">
        {Imagem}
        {Texto}
      </div>
    )
  } else if (imagem_posicao === 'direita') {
    conteudo = (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center max-w-6xl mx-auto">
        {Texto}
        {Imagem}
      </div>
    )
  }

  return (
    <section id={`secao-${slug}`} className="py-20 px-6 border-t border-white/5">
      <div className="max-w-6xl mx-auto">
        {conteudo}
      </div>
    </section>
  )
}
