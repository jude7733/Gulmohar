import { createClient } from '@supabase/supabase-js'

const url = process.env.EXPO_PUBLIC_SUPABASE_URL as string
const key = process.env.EXPO_PUBLIC_SUPABASE_API as string
export const supabase = createClient(url, key,)
