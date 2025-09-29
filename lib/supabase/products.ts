import { createClient } from "./server"
import { createClient as createBrowserClient } from "./client"
import type { ProductWithSizes } from "./types"

// Buscar todos os produtos
export async function getAllProducts(): Promise<ProductWithSizes[]> {
  const supabase = createClient()

  const { data: products, error } = await supabase
    .from("products")
    .select(`
      *,
      product_sizes (*)
    `)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Erro ao buscar produtos:", error)
    return []
  }

  return products || []
}

// Versão client-side para buscar todos os produtos
export async function getAllProductsClient(): Promise<ProductWithSizes[]> {
  const supabase = createBrowserClient()

  const { data: products, error } = await supabase
    .from("products")
    .select(`
      *,
      product_sizes (*)
    `)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Erro ao buscar produtos:", error)
    return []
  }

  return products || []
}

// Buscar produto por ID
export async function getProductById(id: string): Promise<ProductWithSizes | null> {
  const supabase = createClient()

  const { data: product, error } = await supabase
    .from("products")
    .select(`
      *,
      product_sizes (*)
    `)
    .eq("id", id)
    .single()

  if (error) {
    console.error("Erro ao buscar produto:", error)
    return null
  }

  return product
}

// Buscar produto por SKU (para compatibilidade com código existente)
export async function getProductBySku(sku: string): Promise<ProductWithSizes | null> {
  const supabase = createClient()

  const { data: product, error } = await supabase
    .from("products")
    .select(`
      *,
      product_sizes (*)
    `)
    .eq("sku", sku)
    .single()

  if (error) {
    console.error("Erro ao buscar produto por SKU:", error)
    return null
  }

  return product
}

// Buscar produtos por categoria
export async function getProductsByCategory(category: string): Promise<ProductWithSizes[]> {
  const supabase = createClient()

  const { data: products, error } = await supabase
    .from("products")
    .select(`
      *,
      product_sizes (*)
    `)
    .eq("category", category)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Erro ao buscar produtos por categoria:", error)
    return []
  }

  return products || []
}

// Versão client-side para buscar produtos por categoria
export async function getProductsByCategoryClient(category: string): Promise<ProductWithSizes[]> {
  const supabase = createBrowserClient()

  const { data: products, error } = await supabase
    .from("products")
    .select(`
      *,
      product_sizes (*)
    `)
    .eq("category", category)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Erro ao buscar produtos por categoria:", error)
    return []
  }

  return products || []
}

// Buscar produtos em promoção
export async function getProductsOnSale(): Promise<ProductWithSizes[]> {
  const supabase = createClient()

  const { data: products, error } = await supabase
    .from("products")
    .select(`
      *,
      product_sizes (*)
    `)
    .eq("is_on_sale", true)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Erro ao buscar produtos em promoção:", error)
    return []
  }

  return products || []
}

// Buscar produtos por termo de pesquisa
export async function searchProducts(searchTerm: string): Promise<ProductWithSizes[]> {
  const supabase = createClient()

  const { data: products, error } = await supabase
    .from("products")
    .select(`
      *,
      product_sizes (*)
    `)
    .or(`name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,category.ilike.%${searchTerm}%`)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Erro ao pesquisar produtos:", error)
    return []
  }

  return products || []
}

// Versão client-side para pesquisar produtos
export async function searchProductsClient(searchTerm: string): Promise<ProductWithSizes[]> {
  const supabase = createBrowserClient()

  const { data: products, error } = await supabase
    .from("products")
    .select(`
      *,
      product_sizes (*)
    `)
    .or(`name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,category.ilike.%${searchTerm}%`)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Erro ao pesquisar produtos:", error)
    return []
  }

  return products || []
}

// Calcular estoque total de um produto
export function getTotalStock(product: ProductWithSizes): number {
  if (product.product_sizes && product.product_sizes.length > 0) {
    return product.product_sizes.reduce((total, size) => total + size.stock, 0)
  }
  return product.stock
}

// Obter estoque disponível para um tamanho específico
export function getStockForSize(product: ProductWithSizes, size: string): number {
  if (!product.product_sizes || product.product_sizes.length === 0) {
    return product.stock
  }

  const sizeData = product.product_sizes.find((s) => s.size === size)
  return sizeData?.stock || 0
}

// Verificar se produto tem tamanhos
export function hasProductSizes(product: ProductWithSizes): boolean {
  return product.product_sizes && product.product_sizes.length > 0
}

// Obter categorias únicas
export async function getCategories(): Promise<string[]> {
  const supabase = createClient()

  const { data: categories, error } = await supabase.from("products").select("category").order("category")

  if (error) {
    console.error("Erro ao buscar categorias:", error)
    return []
  }

  // Remover duplicatas
  const uniqueCategories = [...new Set(categories?.map((c) => c.category) || [])]
  return uniqueCategories
}

// Versão client-side para obter categorias únicas
export async function getCategoriesClient(): Promise<string[]> {
  const supabase = createBrowserClient()

  const { data: categories, error } = await supabase.from("products").select("category").order("category")

  if (error) {
    console.error("Erro ao buscar categorias:", error)
    return []
  }

  // Remover duplicatas
  const uniqueCategories = [...new Set(categories?.map((c) => c.category) || [])]
  return uniqueCategories
}

// Atualizar produto (apenas para admins)
export async function updateProduct(
  productId: string,
  updates: {
    name?: string
    description?: string
    details?: string[]
    price?: number
    original_price?: number
    is_on_sale?: boolean
    stock?: number
    category?: string
    material?: string
  },
): Promise<boolean> {
  const supabase = createBrowserClient()

  console.log("[v0] Starting product update with data:", { productId, updates })

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    console.error("[v0] Authentication error - user must be logged in to update products:", {
      authError: authError?.message,
      hasUser: !!user,
    })
    return false
  }

  console.log("[v0] User authenticated:", user.email)

  const { data, error } = await supabase
    .from("products")
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq("id", productId)
    .select()

  if (error) {
    console.error("[v0] Supabase error details:", {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
    })
    return false
  }

  console.log("[v0] Product updated successfully:", data)
  return data && data.length > 0
}

// Atualizar estoque de um tamanho específico
export async function updateProductSizeStock(productId: string, size: string, newStock: number): Promise<boolean> {
  const supabase = createBrowserClient()

  const { error } = await supabase
    .from("product_sizes")
    .update({ stock: newStock })
    .eq("product_id", productId)
    .eq("size", size)

  if (error) {
    console.error("Erro ao atualizar estoque do tamanho:", error)
    return false
  }

  return true
}

// Adicionar novo tamanho para um produto
export async function addProductSize(productId: string, size: string, stock: number): Promise<boolean> {
  const supabase = createBrowserClient()

  const { error } = await supabase.from("product_sizes").insert({
    product_id: productId,
    size,
    stock,
  })

  if (error) {
    console.error("Erro ao adicionar tamanho:", error)
    return false
  }

  return true
}

// Remover tamanho de um produto
export async function removeProductSize(productId: string, size: string): Promise<boolean> {
  const supabase = createBrowserClient()

  const { error } = await supabase.from("product_sizes").delete().eq("product_id", productId).eq("size", size)

  if (error) {
    console.error("Erro ao remover tamanho:", error)
    return false
  }

  return true
}
