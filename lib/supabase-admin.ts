import { createClient } from '@supabase/supabase-js'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Cliente admin — bypassa RLS. NUNCA importar em client components!
// Usar apenas em: /app/admin/**, /app/api/admin/**
export const supabaseAdmin = createClient(url, serviceKey)
