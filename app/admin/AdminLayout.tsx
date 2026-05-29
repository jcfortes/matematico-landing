import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { AdminNav } from './AdminNav'
import Link from 'next/link'

export async function AdminLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies()
  const token = cookieStore.get('admin_token')?.value

  if (!token) redirect('/admin')

  const { data: { user }, error } = await supabaseAdmin.auth.getUser(token)
  if (error || !user) redirect('/admin')

  const { data: profile } = await supabaseAdmin
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!profile || !['administrador', 'gestor'].includes(profile.role)) redirect('/admin')

  const { data: perfilData } = await supabaseAdmin
    .from('perfis')
    .select('id, permissoes(pagina)')
    .eq('nome', profile.role)
    .single()

  const paginas: string[] = perfilData?.permissoes?.map((p: any) => p.pagina) ?? []

  return (
    <div className="min-h-screen bg-[#080808] text-white flex flex-col">

      {/* Linha 1 — Logo full width */}
      <header className="flex items-center border-b border-white/8 h-20 px-6 shrink-0">
        <Link href="/">
          <img src="/logo-dark-v3.png" alt="Matemático" className="h-12 w-auto" />
        </Link>
      </header>

      {/* Linha 2 em diante — Sidebar + Conteúdo */}
      <div className="flex flex-1 overflow-hidden">
        <AdminNav role={profile.role} paginas={paginas} />
        <main className="flex-1 overflow-auto">
          {/* Linha 2 — Painel de Administração */}
          <div className="border-b border-white/8 py-3 text-center">
            <p className="text-lg sm:text-2xl text-white/50 uppercase tracking-widest font-semibold">Painel de Administração</p>
          </div>
          {children}
        </main>
      </div>

    </div>
  )
}
