import { supabaseAdmin } from '@/lib/supabase-admin'
import { AdminLayout } from '../../AdminLayout'
import { SecoesCustomClient } from './SecoesCustomClient'

export const dynamic = 'force-dynamic'

export default async function SecoesCustomPage() {
  const { data: secoes } = await supabaseAdmin
    .from('landing_secoes_custom')
    .select('*')
    .order('posicao_apos')
    .order('ordem')

  return (
    <AdminLayout>
      <div className="p-8 max-w-5xl">
        <div className="mb-6">
          <h1 className="text-xl font-bold">Seções customizadas da LP</h1>
          <p className="text-white/50 text-sm mt-1">
            Crie blocos extras (promoções, depoimentos, cases, novidades) que aparecem na landing
            entre as seções fixas. Define posição, imagem, texto e CTA.
          </p>
        </div>
        <SecoesCustomClient secoes={secoes ?? []} />
      </div>
    </AdminLayout>
  )
}
