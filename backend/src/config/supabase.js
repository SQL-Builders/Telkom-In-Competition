import { createClient } from '@supabase/supabase-js';
import env from './env.js';

/**
 * Supabase client for server-side use.
 * Uses SERVICE ROLE KEY to bypass RLS — safe because this runs only on the backend.
 * Falls back to anon key if service role key is not set.
 */
const supabaseKey = env.supabaseServiceRoleKey || env.supabaseAnonKey;

export const supabase = createClient(env.supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});
export default supabase;
