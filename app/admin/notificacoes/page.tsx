import { supabaseAdmin } from '@/lib/supabase-admin'
import { AdminLayout } from '../AdminLayout'
import { NotificacoesClient } from './NotificacoesClient'

export default async function NotificacoesPage() {
  const { data: emails } = await supabaseAdmin
    .from('admin_notificacoes')
    .select('id, email, nome, notif_prazo_expirado, notif_novo_cadastro, notif_erros, created_at')
    .order('created_at', { ascending: true })

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="mb-6">
          <h1 className="text-xl font-bold">Notificações por email</h1>
          <p className="text-white/50 text-sm mt-1">
            Pessoas que recebem alertas automáticos da plataforma (prazo expirado, novos cadastros, erros).
            Cadastre administradores e gestores.
          </p>
        </div>

        <NotificacoesClient emails={emails ?? []} />
      </div>
    </AdminLayout>
  )
}
