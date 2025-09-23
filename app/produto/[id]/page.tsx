import { notFound } from "next/navigation"
import { ProductPageClient } from "./product-page-client"
import { getProductById } from "@/lib/supabase/products"

interface ProductPageProps {
  params: Promise<{ id: string }>
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params

  const product = await getProductById(id)

  if (!product) {
    notFound()
  }

  return <ProductPageClient product={product} />
}
