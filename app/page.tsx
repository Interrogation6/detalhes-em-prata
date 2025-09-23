import { Header } from "@/components/header"
import { Sidebar } from "@/components/sidebar"
import { HeroBanner } from "@/components/hero-banner"
import { ProductSection } from "@/components/product-section"
import { Testimonials } from "@/components/testimonials"
import { Footer } from "@/components/footer"
import { CartSidebar } from "@/components/cart-sidebar"
import { getAllProducts, getProductsOnSale } from "@/lib/supabase/products"

export default async function HomePage() {
  const allProducts = await getAllProducts()
  const productsOnSale = await getProductsOnSale()

  // Separar produtos por categoria para exibição
  const novidades = allProducts.slice(0, 4) // Primeiros 4 produtos como novidades
  const promocoes = productsOnSale.slice(0, 2) // Produtos em promoção
  const maisVendidos = allProducts.slice(4, 8) // Próximos 4 como mais vendidos

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Sidebar />
      <CartSidebar />

      <main className="transition-all duration-500 ease-out md:ml-20">
        <HeroBanner />
        <ProductSection title="NOVIDADES" products={novidades} />
        <ProductSection title="PROMOÇÕES" products={promocoes} />
        <ProductSection title="MAIS VENDIDOS" products={maisVendidos} />
        <Testimonials />
      </main>
      <Footer />
    </div>
  )
}
