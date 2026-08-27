import { createClient } from "@supabase/supabase-js";

// Server-side Supabase client. Uses the SERVICE ROLE key so that these
// API routes (which already run their own auth checks in proxy.ts) can
// read/write freely. NEVER expose SUPABASE_SERVICE_ROLE_KEY to the browser —
// it must only ever be read here, on the server, from process.env.
const supabaseUrl = process.env.SUPABASE_URL || "https://placeholder.supabase.co";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "placeholder-key";

export const isSupabaseConfigured = Boolean(
  process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY
);

if (!isSupabaseConfigured) {
  console.warn(
    "Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables. " +
    "Falling back to local data/defaults."
  );
}

export const supabase = createClient(
  supabaseUrl,
  supabaseServiceKey,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  }
);
