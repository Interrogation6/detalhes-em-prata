import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

export async function updateSession(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // Se as variáveis de ambiente não estiverem disponíveis, apenas continue sem autenticação
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn("[v0] Supabase environment variables not found in middleware")
    return NextResponse.next({
      request,
    })
  }

  let supabaseResponse = NextResponse.next({
    request,
  })

  // Com Fluid compute, não coloque este cliente em uma variável de ambiente
  // global. Sempre crie um novo a cada requisição.
  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
        supabaseResponse = NextResponse.next({
          request,
        })
        cookiesToSet.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options))
      },
    },
  })

  // Não execute código entre createServerClient e
  // supabase.auth.getUser(). Um erro simples pode tornar muito difícil debugar
  // problemas com usuários sendo deslogados aleatoriamente.

  try {
    // IMPORTANTE: Se você remover getUser() e usar renderização server-side
    // com o cliente Supabase, seus usuários podem ser deslogados aleatoriamente.
    const {
      data: { user },
    } = await supabase.auth.getUser()
  } catch (error) {
    console.warn("[v0] Error getting user in middleware:", error)
  }

  // IMPORTANTE: Você *deve* retornar o objeto supabaseResponse como está.
  // Se você está criando um novo objeto de resposta com NextResponse.next() certifique-se de:
  // 1. Passar a requisição nele, assim:
  //    const myNewResponse = NextResponse.next({ request })
  // 2. Copiar os cookies, assim:
  //    myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
  // 3. Alterar o objeto myNewResponse para suas necessidades, mas evite alterar
  //    os cookies!
  // 4. Finalmente:
  //    return myNewResponse
  // Se isso não for feito, você pode estar causando o navegador e servidor a sair
  // de sincronia e terminar a sessão do usuário prematuramente!

  return supabaseResponse
}
