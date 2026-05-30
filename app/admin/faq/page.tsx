import Link from 'next/link'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { FaqAdminClient } from './FaqAdminClient'
import { AdminLayout } from '../AdminLayout'

const categoriaLabel: Record<string, string> = {
  amortizacao: 'Amortização',
  atualizacao: 'Atualização Monetária',
  avaliacao: 'Valuation Empresarial',
  geral: 'Geral',
}

export default async function FaqAdminPage() {
  const { data: faqs } = await supabaseAdmin
    .from('faq')
    .select('*')
    .eq('tipo', 'faq')
    .order('categoria')
    .order('ordem')
    .order('created_at')

  const lista = faqs ?? []

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold">FAQ — Perguntas Frequentes</h1>
            <p className="text-white/50 text-sm mt-1">{lista.length} {lista.length === 1 ? 'pergunta cadastrada' : 'perguntas cadastradas'} · Dúvidas sobre o uso do sistema</p>
          </div>
          <Link
            href="/admin/faq/nova"
            className="bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors"
          >
            + Nova pergunta
          </Link>
        </div>

        {lista.length === 0 ? (
          <div className="text-center py-16 text-white/40">
            <p className="text-4xl mb-4">❓</p>
            <p className="text-sm">Nenhuma pergunta cadastrada ainda.</p>
            <Link href="/admin/faq/nova" className="text-emerald-400 hover:text-emerald-300 text-sm mt-2 inline-block">
              Cadastrar primeira pergunta →
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {lista.map((faq: any) => (
              <div key={faq.id} className={`border rounded-2xl p-5 transition-colors ${faq.ativo ? 'border-white/10 bg-white/3' : 'border-white/5 bg-white/1 opacity-50'}`}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                        {categoriaLabel[faq.categoria] ?? faq.categoria}
                      </span>
                      {!faq.ativo && (
                        <span className="text-xs bg-white/5 text-white/40 border border-white/10 px-2 py-0.5 rounded-full">Inativo</span>
                      )}
                      <span className="text-xs text-white/30">ordem: {faq.ordem}</span>
                    </div>
                    <p className="font-semibold text-white text-sm mb-1">{faq.pergunta}</p>
                    <p className="text-white/55 text-sm leading-relaxed line-clamp-2">{faq.resposta}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <FaqAdminClient action="toggle" id={faq.id} ativo={faq.ativo} />
                    <Link href={`/admin/faq/${faq.id}/editar`} className="text-xs bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white px-3 py-1.5 rounded-lg transition-colors">
                      Editar
                    </Link>
                    <FaqAdminClient action="delete" id={faq.id} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
