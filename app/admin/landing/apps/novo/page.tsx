import { AdminLayout } from '../../../AdminLayout'
import { AppForm } from '../AppForm'
import Link from 'next/link'

export default function NovoAppPage() {
  return (
    <AdminLayout>
      <div className="p-8 max-w-3xl">
        <div className="mb-6">
          <h1 className="text-xl font-bold">Novo app</h1>
          <p className="text-white/50 text-sm mt-1">
            Cadastre um novo card na landing. <Link href="/admin/landing/apps" className="text-emerald-400 hover:text-emerald-300">← Voltar à lista</Link>
          </p>
        </div>
        <AppForm />
      </div>
    </AdminLayout>
  )
}
