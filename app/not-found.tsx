import Link from 'next/link'
import { Construction, ArrowLeft, MessageSquare } from 'lucide-react'

/**
 * Página 404 da landing (tema escuro).
 * Versão da padronização da plataforma — todos os apps mostram
 * "em desenvolvimento" em vez do 404 genérico do Next.js.
 */
export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#080808] px-4">
      <div className="max-w-md w-full bg-white/3 border border-white/10 rounded-2xl p-8 text-center space-y-5">
        <div className="mx-auto bg-amber-500/15 border border-amber-500/30 rounded-full p-4 w-20 h-20 flex items-center justify-center">
          <Construction className="h-10 w-10 text-amber-400" />
        </div>

        <div>
          <h1 className="text-2xl font-bold text-white">
            Em desenvolvimento
          </h1>
          <p className="text-sm text-white/65 mt-2 leading-relaxed">
            Este recurso ainda está sendo construído. Em breve ele estará disponível!
          </p>
          <p className="text-xs text-white/40 mt-3">
            Se você chegou aqui por um link específico que esperava funcionar,
            entre em contato pra avisar.
          </p>
        </div>

        <div className="space-y-2 pt-2">
          <Link
            href="/"
            className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-6 py-3 rounded-xl transition-all w-full"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar para a página inicial
          </Link>

          <Link
            href="/#contato"
            className="flex items-center justify-center gap-2 w-full text-sm text-white/50 hover:text-emerald-400 py-2 transition-colors"
          >
            <MessageSquare className="h-4 w-4" />
            Reportar ou sugerir
          </Link>
        </div>

        <p className="text-[10px] text-white/30 pt-2 border-t border-white/10">
          Matemático · Clareza Financeira em Cálculos Profissionais
        </p>
      </div>
    </div>
  )
}
