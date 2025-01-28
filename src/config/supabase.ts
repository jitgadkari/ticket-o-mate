// src/config/supabase.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY

if(!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Supabase URL or anon key not found');
  process.exit(1);
}
export const supabase = createClient(supabaseUrl, supabaseAnonKey)