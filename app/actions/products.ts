"use server"

import { createClient } from "@supabase/supabase-js"
import { revalidatePath } from "next/cache"

// Create admin client with service role key for bypassing RLS
function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error("Missing Supabase environment variables")
  }

  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}

export async function updateProductAction(
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
    images?: string[]
  },
) {
  try {
    console.log("[v0] Server action: Updating product", { productId, updates })

    const supabase = createAdminClient()

    // Update the product
    const { data, error } = await supabase
      .from("products")
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq("id", productId)
      .select()
      .single()

    if (error) {
      console.error("[v0] Server action: Update error", error)
      throw error
    }

    console.log("[v0] Server action: Product updated successfully", data)

    // Revalidate the product page
    revalidatePath(`/produto/${productId}`)
    revalidatePath("/")

    return { success: true, data }
  } catch (error) {
    console.error("[v0] Server action: Failed to update product", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update product",
    }
  }
}

export async function updateProductSizeStockAction(productId: string, size: string, stock: number) {
  try {
    console.log("[v0] Server action: Updating size stock", { productId, size, stock })

    const supabase = createAdminClient()

    const { data, error } = await supabase
      .from("product_sizes")
      .update({ stock })
      .eq("product_id", productId)
      .eq("size", size)
      .select()
      .single()

    if (error) {
      console.error("[v0] Server action: Size stock update error", error)
      throw error
    }

    console.log("[v0] Server action: Size stock updated successfully", data)

    // Revalidate the product page
    revalidatePath(`/produto/${productId}`)

    return { success: true, data }
  } catch (error) {
    console.error("[v0] Server action: Failed to update size stock", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update size stock",
    }
  }
}

export async function addProductSizeAction(productId: string, size: string, stock: number) {
  try {
    console.log("[v0] Server action: Adding product size", { productId, size, stock })

    const supabase = createAdminClient()

    const { data, error } = await supabase
      .from("product_sizes")
      .insert({
        product_id: productId,
        size,
        stock,
      })
      .select()
      .single()

    if (error) {
      console.error("[v0] Server action: Add size error", error)
      throw error
    }

    console.log("[v0] Server action: Size added successfully", data)

    // Revalidate the product page
    revalidatePath(`/produto/${productId}`)

    return { success: true, data }
  } catch (error) {
    console.error("[v0] Server action: Failed to add size", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to add size",
    }
  }
}

export async function removeProductSizeAction(productId: string, size: string) {
  try {
    console.log("[v0] Server action: Removing product size", { productId, size })

    const supabase = createAdminClient()

    const { error } = await supabase.from("product_sizes").delete().eq("product_id", productId).eq("size", size)

    if (error) {
      console.error("[v0] Server action: Remove size error", error)
      throw error
    }

    console.log("[v0] Server action: Size removed successfully")

    // Revalidate the product page
    revalidatePath(`/produto/${productId}`)

    return { success: true }
  } catch (error) {
    console.error("[v0] Server action: Failed to remove size", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to remove size",
    }
  }
}
