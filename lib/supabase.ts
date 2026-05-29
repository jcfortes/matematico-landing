import { createClient } from '@supabase/supabase-js'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Cliente público para Server Components (leitura de dados públicos como FAQ)
export const supabase = createClient(url, anonKey)
