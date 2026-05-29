import { supabaseAdmin } from '@/lib/supabase-admin'
import { AdminLayout } from '../AdminLayout'
import { EquipeTable } from './EquipeClient'

export default async function EquipePage() {
  const { data: profiles } = await supabaseAdmin
    .from('profiles')
    .select('id, nome, role, created_at')
    .in('role', ['administrador', 'gestor'])
    .order('role')
    .order('created_at')

  const lista = profiles ?? []

  const membros: Array<{
    id: string
    email: string
    nome: string
    role: string
    created_at: string
    last_sign_in_at: string | null
  }> = []

  for (const profile of lista) {
    const { data: { user } } = await supabaseAdmin.auth.admin.getUserById(profile.id)
    if (user) {
      membros.push({
        id: profile.id,
        email: user.email ?? '—',
        nome: (profile as any).nome ?? '',
        role: profile.role,
        created_at: profile.created_at,
        last_sign_in_at: user.last_sign_in_at ?? null,
      })
    }
  }

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="mb-6">
          <h1 className="text-xl font-bold">Equipe</h1>
          <p className="text-white/50 text-sm mt-1">
            {membros.length} {membros.length === 1 ? 'membro' : 'membros'} da equipe
          </p>
        </div>
        <EquipeTable membros={membros} />
      </div>
    </AdminLayout>
  )
}
