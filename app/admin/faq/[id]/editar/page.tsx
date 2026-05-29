import { supabaseAdmin } from '@/lib/supabase-admin'
import { FaqForm } from '../../FaqForm'
import { AdminLayout } from '../../../AdminLayout'
import { notFound } from 'next/navigation'

export default async function EditarFaqPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const { data: faq } = await supabaseAdmin.from('faq').select('*').eq('id', id).single()
  if (!faq) notFound()

  const tipo = (faq.tipo === 'base' ? 'base' : 'faq') as 'base' | 'faq'

  const { data: assuntos } = await supabaseAdmin
    .from('faq_assuntos')
    .select('id, nome')
    .eq('tipo', tipo)
    .order('nome')
  const titulo = tipo === 'base' ? 'Editar conteúdo' : 'Editar pergunta'
  const subtitulo = tipo === 'base' ? 'Atualizar conteúdo da Base de Conhecimento' : 'Atualizar conteúdo do FAQ'

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="mb-6">
          <h1 className="text-xl font-bold">{titulo}</h1>
          <p className="text-white/50 text-sm mt-1">{subtitulo}</p>
        </div>
        <div className="max-w-2xl">
          <FaqForm faq={faq} assuntos={assuntos ?? []} tipo={tipo} />
        </div>
      </div>
    </AdminLayout>
  )
}
