import { FaqForm } from '../FaqForm'
import { AdminLayout } from '../../AdminLayout'
import { supabaseAdmin } from '@/lib/supabase-admin'

export default async function NovaFaqPage() {
  const { data: assuntos } = await supabaseAdmin
    .from('faq_assuntos')
    .select('id, nome')
    .eq('tipo', 'faq')
    .order('nome')

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="mb-6">
          <h1 className="text-xl font-bold">Nova pergunta (FAQ)</h1>
          <p className="text-white/50 text-sm mt-1">Adicionar pergunta ao FAQ público</p>
        </div>
        <div className="max-w-2xl">
          <FaqForm assuntos={assuntos ?? []} tipo="faq" />
        </div>
      </div>
    </AdminLayout>
  )
}
