// src/utils/supabase/server.ts
import { createServerClient, type CookieOptions } from "@supabase/ssr"
import { cookies } from "next/headers"

export async function createServerSupabase() {
  // Next 15: cookies() dianggap async
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, // jangan pakai service role untuk baca session
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        // Server Components/Route Handlers biasanya tidak nulis cookie.
        // Refresh & set cookie akan ditangani oleh middleware (Step 3).
        set(_name: string, _value: string, _options: CookieOptions) {},
        remove(_name: string, _options: CookieOptions) {},
      },
    }
  )
}

