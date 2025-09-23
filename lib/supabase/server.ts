import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

/**
 * Especialmente importante se usando Fluid compute: Não coloque este cliente em uma
 * variável global. Sempre crie um novo cliente dentro de cada função ao usá-lo.
 */
export async function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Missing Supabase environment variables. Please check your environment configuration.")
  }

  const cookieStore = await cookies()

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
        } catch {
          // O método "setAll" foi chamado de um Server Component.
          // Isso pode ser ignorado se você tiver middleware atualizando
          // sessões de usuário.
        }
      },
    },
  })
}
