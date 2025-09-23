import { Suspense } from "react"
import { ProductsPageClient } from "./products-page-client"
import { getAllProducts, getCategories } from "@/lib/supabase/products"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Sidebar } from "@/components/sidebar"
import { CartSidebar } from "@/components/cart-sidebar"

export default async function ProductsPage() {
  const [products, categories] = await Promise.all([getAllProducts(), getCategories()])

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Sidebar />
      <CartSidebar />

      <main className="transition-all duration-500 ease-out md:ml-20">
        <Suspense fallback={<div className="container mx-auto px-4 py-8">Carregando produtos...</div>}>
          <ProductsPageClient initialProducts={products} categories={categories} />
        </Suspense>
      </main>

      <Footer />
    </div>
  )
}
