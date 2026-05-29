import { FaqForm } from '../../faq/FaqForm'
import { AdminLayout } from '../../AdminLayout'
import { supabaseAdmin } from '@/lib/supabase-admin'

export default async function NovoBaseConhecimentoPage() {
  const { data: assuntos } = await supabaseAdmin
    .from('faq_assuntos')
    .select('id, nome')
    .eq('tipo', 'base')
    .order('nome')

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="mb-6">
          <h1 className="text-xl font-bold">Novo conteúdo (Base de Conhecimento)</h1>
          <p className="text-white/50 text-sm mt-1">Adicionar conteúdo educacional sobre cálculos, finanças, tributação etc.</p>
        </div>
        <div className="max-w-2xl">
          <FaqForm assuntos={assuntos ?? []} tipo="base" />
        </div>
      </div>
    </AdminLayout>
  )
}
