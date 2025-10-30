import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Singleton Supabase client for the renderer process.
// Reads Vite env variables (must be prefixed with VITE_ to be exposed to the client).
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as
  | string
  | undefined;

let supabase: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (!supabase) {
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
      // Create a soft-stub client that will error on usage with a friendly message.
      // This prevents hard crashes during web preview if envs are not yet configured.
      const message =
        "Supabase env vars missing. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env to enable login.";
      const stub: any = {
        auth: {
          getSession: async () => ({ data: { session: null }, error: null }),
          onAuthStateChange: () => ({ data: { subscription: { unsubscribe() {} } } }),
          signInWithPassword: async () => ({ error: new Error(message) }),
          signInWithOAuth: async () => ({ error: new Error(message) }),
          signUp: async () => ({ error: new Error(message) }),
          signOut: async () => ({ error: new Error(message) }),
        },
        from: () => ({ select: async () => ({ data: null, error: new Error(message) }) }),
        rpc: async () => ({ error: new Error(message) }),
      };
      supabase = stub as SupabaseClient;
    } else {
      supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
        },
      });
    }
  }
  return supabase;
}

export function isElectron(): boolean {
  const w = window as any;
  return Boolean(w?.electron?.ipcRenderer);
}

// Helper to determine a safe OAuth redirect target depending on environment.
// - In web & dev Electron, use the current origin with an auth callback path.
// - In packaged Electron (file:// origin), fall back to the deep link handler.
export function getOAuthRedirectTo(): string {
  try {
    // In Electron we always prefer deep link return, so the app isn't forced to
    // navigate inside the Electron window. This ensures the flow happens in the
    // user's default browser and returns to the app via dyad://.
    if (isElectron()) {
      return "dyad://supabase-oauth-return";
    }
    const origin = window.location.origin;
    const isHttp = origin.startsWith("http");
    return isHttp ? `${origin}/auth/callback` : "dyad://supabase-oauth-return";
  } catch {
    return "dyad://supabase-oauth-return";
  }
}