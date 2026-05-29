import Link from 'next/link'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { FaqAdminClient } from '../faq/FaqAdminClient'
import { AdminLayout } from '../AdminLayout'

const categoriaLabel: Record<string, string> = {
  amortizacao: 'Amortização',
  atualizacao: 'Atualização Monetária',
  geral: 'Geral',
}

export default async function BaseConhecimentoAdminPage() {
  const { data: registros } = await supabaseAdmin
    .from('faq')
    .select('*')
    .eq('tipo', 'base')
    .order('categoria')
    .order('ordem')
    .order('created_at')

  const lista = registros ?? []

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold">Base de Conhecimento</h1>
            <p className="text-white/50 text-sm mt-1">
              {lista.length} {lista.length === 1 ? 'conteúdo cadastrado' : 'conteúdos cadastrados'} · Artigos sobre cálculos, finanças e tributação
            </p>
          </div>
          <Link
            href="/admin/base-conhecimento/nova"
            className="bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors"
          >
            + Novo conteúdo
          </Link>
        </div>

        {lista.length === 0 ? (
          <div className="text-center py-16 text-white/40">
            <p className="text-4xl mb-4">📚</p>
            <p className="text-sm">Nenhum conteúdo cadastrado ainda.</p>
            <Link href="/admin/base-conhecimento/nova" className="text-emerald-400 hover:text-emerald-300 text-sm mt-2 inline-block">
              Cadastrar primeiro conteúdo →
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {lista.map((reg: any) => (
              <div key={reg.id} className={`border rounded-2xl p-5 transition-colors ${reg.ativo ? 'border-white/10 bg-white/3' : 'border-white/5 bg-white/1 opacity-50'}`}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                        {categoriaLabel[reg.categoria] ?? reg.categoria}
                      </span>
                      {!reg.ativo && (
                        <span className="text-xs bg-white/5 text-white/40 border border-white/10 px-2 py-0.5 rounded-full">Inativo</span>
                      )}
                      <span className="text-xs text-white/30">ordem: {reg.ordem}</span>
                    </div>
                    <p className="font-semibold text-white text-sm mb-1">{reg.pergunta}</p>
                    <p className="text-white/55 text-sm leading-relaxed line-clamp-2">{reg.resposta}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <FaqAdminClient action="toggle" id={reg.id} ativo={reg.ativo} />
                    <Link href={`/admin/faq/${reg.id}/editar`} className="text-xs bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white px-3 py-1.5 rounded-lg transition-colors">
                      Editar
                    </Link>
                    <FaqAdminClient action="delete" id={reg.id} />
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
