import { supabaseAdmin } from '@/lib/supabase-admin'
import { AdminLayout } from '../AdminLayout'
import { ContratantesClient } from './ContratantesClient'

export default async function ContratantesPage() {
  // Busca todos os usuários com role = contratante junto com dados de auth
  const { data: profiles } = await supabaseAdmin
    .from('profiles')
    .select('id, nome, role, status, created_at')
    .eq('role', 'contratante')
    .order('created_at', { ascending: false })

  const lista = profiles ?? []

  // Busca emails dos usuários via auth admin
  const usersWithEmail: Array<{
    id: string
    email: string
    nome: string
    role: string
    status: string
    created_at: string
    last_sign_in_at: string | null
  }> = []

  for (const profile of lista) {
    const { data: { user } } = await supabaseAdmin.auth.admin.getUserById(profile.id)
    if (user) {
      usersWithEmail.push({
        id: profile.id,
        email: user.email ?? '—',
        nome: (profile as any).nome ?? '',
        role: profile.role,
        status: (profile as any).status ?? 'cliente',
        created_at: profile.created_at,
        last_sign_in_at: user.last_sign_in_at ?? null,
      })
    }
  }

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold">Contratantes</h1>
            <p className="text-white/50 text-sm mt-1">
              {usersWithEmail.length} {usersWithEmail.length === 1 ? 'usuário cadastrado' : 'usuários cadastrados'}
            </p>
          </div>
        </div>

        {usersWithEmail.length === 0 ? (
          <div className="text-center py-16 text-white/40">
            <p className="text-4xl mb-4">👥</p>
            <p className="text-sm">Nenhum contratante cadastrado ainda.</p>
          </div>
        ) : (
          <ContratantesClient users={usersWithEmail} />
        )}
      </div>
    </AdminLayout>
  )
}
