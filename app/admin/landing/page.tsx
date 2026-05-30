import { supabaseAdmin } from '@/lib/supabase-admin'
import { AdminLayout } from '../AdminLayout'
import { LandingAdminClient } from './LandingAdminClient'

export const dynamic = 'force-dynamic'

export default async function LandingAdminPage() {
  const [{ data: itens }, { data: secoesConfig }] = await Promise.all([
    supabaseAdmin
      .from('landing_content')
      .select('key, secao, ordem, tipo, valor, valor_padrao, estilo, descricao')
      .order('secao')
      .order('ordem')
      .order('key'),
    supabaseAdmin
      .from('landing_secoes_config')
      .select('secao')
      .eq('oculta', true),
  ])

  const secoesOcultas = (secoesConfig ?? []).map((s: { secao: string }) => s.secao)

  return (
    <AdminLayout>
      <div className="p-8 max-w-4xl">
        <div className="mb-6">
          <h1 className="text-xl font-bold">Textos da Landing</h1>
          <p className="text-white/50 text-sm mt-1">
            Edite os textos da página inicial. Use <strong className="text-emerald-400">🎨 Estilo</strong> em cada texto para personalizar tamanho, peso, cor, estilo e alinhamento. As alterações aparecem imediatamente após salvar.
          </p>
        </div>
        <LandingAdminClient
          itens={(itens ?? []) as unknown as Parameters<typeof LandingAdminClient>[0]['itens']}
          secoesOcultasIniciais={secoesOcultas}
        />
      </div>
    </AdminLayout>
  )
}
