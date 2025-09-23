export interface Database {
  public: {
    Tables: {
      products: {
        Row: {
          id: string
          name: string
          price: number
          original_price: number | null
          image: string
          images: string[] | null
          is_on_sale: boolean | null
          description: string
          details: string[] | null
          category: string
          material: string
          stock: number
          sku: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          price: number
          original_price?: number | null
          image: string
          images?: string[] | null
          is_on_sale?: boolean | null
          description: string
          details?: string[] | null
          category: string
          material: string
          stock?: number
          sku: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          price?: number
          original_price?: number | null
          image?: string
          images?: string[] | null
          is_on_sale?: boolean | null
          description?: string
          details?: string[] | null
          category?: string
          material?: string
          stock?: number
          sku?: string
          created_at?: string
          updated_at?: string
        }
      }
      product_sizes: {
        Row: {
          id: string
          product_id: string
          size: string
          stock: number
          created_at: string
        }
        Insert: {
          id?: string
          product_id: string
          size: string
          stock?: number
          created_at?: string
        }
        Update: {
          id?: string
          product_id?: string
          size?: string
          stock?: number
          created_at?: string
        }
      }
    }
  }
}

export type Product = Database["public"]["Tables"]["products"]["Row"]
export type ProductInsert = Database["public"]["Tables"]["products"]["Insert"]
export type ProductUpdate = Database["public"]["Tables"]["products"]["Update"]

export type ProductSize = Database["public"]["Tables"]["product_sizes"]["Row"]
export type ProductSizeInsert = Database["public"]["Tables"]["product_sizes"]["Insert"]
export type ProductSizeUpdate = Database["public"]["Tables"]["product_sizes"]["Update"]

export interface ProductWithSizes extends Product {
  product_sizes: ProductSize[]
}

export interface CartItem {
  id: string
  name: string
  price: number
  originalPrice?: number
  image: string
  quantity: number
  size?: string
}
