import { supabaseAdmin } from '@/lib/supabase-admin'
import { AdminLayout } from '../AdminLayout'

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('pt-BR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

export default async function ContatosPage() {
  const { data: contatos } = await supabaseAdmin
    .from('contatos')
    .select('id, nome, email, assunto, mensagem, created_at')
    .order('created_at', { ascending: false })

  const lista = contatos ?? []

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="mb-6">
          <h1 className="text-xl font-bold">Contatos</h1>
          <p className="text-white/50 text-sm mt-1">
            {lista.length} {lista.length === 1 ? 'mensagem recebida' : 'mensagens recebidas'}
          </p>
        </div>

        {lista.length === 0 ? (
          <div className="text-center py-16 text-white/40">
            <p className="text-4xl mb-4">✉️</p>
            <p className="text-sm">Nenhuma mensagem recebida ainda.</p>
          </div>
        ) : (
          <div className="border border-white/10 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[520px]">
                <thead>
                  <tr className="border-b border-white/10 bg-white/3">
                    <th className="text-left px-5 py-3 text-white/50 font-semibold text-xs uppercase tracking-wider">Nome</th>
                    <th className="text-left px-5 py-3 text-white/50 font-semibold text-xs uppercase tracking-wider">Email</th>
                    <th className="text-left px-5 py-3 text-white/50 font-semibold text-xs uppercase tracking-wider">Assunto</th>
                    <th className="text-left px-5 py-3 text-white/50 font-semibold text-xs uppercase tracking-wider">Data</th>
                  </tr>
                </thead>
                <tbody>
                  {lista.map((c) => (
                    <tr key={c.id} className="border-b border-white/5 last:border-0 hover:bg-white/2 transition-colors group">
                      <td className="px-5 py-3.5 text-white font-medium">{c.nome}</td>
                      <td className="px-5 py-3.5">
                        <a href={`mailto:${c.email}`} className="text-white/60 hover:text-emerald-400 transition-colors">
                          {c.email}
                        </a>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="text-xs font-semibold px-2.5 py-1 rounded-full border bg-white/5 border-white/10 text-white/60">
                          {c.assunto}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-white/40 text-xs">{formatDate(c.created_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
