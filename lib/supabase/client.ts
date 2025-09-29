import { createBrowserClient } from "@supabase/ssr"

export function createClient() {
  console.log("[v0] createClient called")

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  console.log("[v0] Environment variables check:", {
    hasUrl: !!supabaseUrl,
    hasKey: !!supabaseAnonKey,
    url: supabaseUrl ? `${supabaseUrl.substring(0, 20)}...` : "missing",
  })

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("[v0] Missing Supabase environment variables!")
    throw new Error("Missing Supabase environment variables. Please check your environment configuration.")
  }

  console.log("[v0] Creating browser client...")
  const client = createBrowserClient(supabaseUrl, supabaseAnonKey)
  console.log("[v0] Browser client created successfully")
  return client
}
