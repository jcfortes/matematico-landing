import { createBrowserClient } from '@supabase/ssr'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Cliente para Client Components com auth — cookies compartilhados em *.matematico.com.br
export function createSupabaseBrowser() {
  return createBrowserClient(url, anonKey, {
    cookieOptions: {
      domain: '.matematico.com.br',
      path: '/',
      sameSite: 'lax',
      secure: true,
    },
  })
}
