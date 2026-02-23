import { createBrowserClient } from "@supabase/ssr";

/**
 * Creates a Supabase client for use in Client Components.
 * This is ONLY for client-side operations like auth UI (login/signup forms).
 * Database queries should still go through Server Actions.
 * 
 * @returns Supabase client instance
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
