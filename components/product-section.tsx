import { ProductCard } from "./product-card"
import type { ProductWithSizes } from "@/lib/supabase/types"

interface ProductSectionProps {
  title: string
  products: ProductWithSizes[]
}

export function ProductSection({ title, products }: ProductSectionProps) {
  return (
    <section className="py-12 md:py-16 lg:py-20 fade-in">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="luxury-title text-2xl md:text-3xl lg:text-4xl text-foreground mb-4">{title}</h2>
          <div className="w-24 h-px bg-primary/20 mx-auto mb-2"></div>
          <div className="w-12 h-px bg-primary mx-auto"></div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8 lg:gap-10">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              price={product.price}
              originalPrice={product.original_price}
              image={product.image}
              isOnSale={product.is_on_sale}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
