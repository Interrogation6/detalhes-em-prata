"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Heart, ShoppingCart, Edit } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useCart } from "@/contexts/cart-context"
import { useAdmin } from "@/contexts/admin-context"
import type { ProductWithSizes } from "@/lib/supabase/types"
import { getTotalStock, getStockForSize, hasProductSizes, getProductById } from "@/lib/supabase/products"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { AdminProductEditModal } from "@/components/admin-product-edit-modal"

interface ProductPageClientProps {
  product: ProductWithSizes
}

export function ProductPageClient({ product: initialProduct }: ProductPageClientProps) {
  const router = useRouter()
  const { dispatch } = useCart()
  const { isAdmin } = useAdmin()
  const [selectedSize, setSelectedSize] = useState<string>("")
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [product, setProduct] = useState(initialProduct)

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price)
  }

  const handleAddToCart = () => {
    if (!product) return

    if (hasProductSizes(product) && !selectedSize) {
      alert("Por favor, selecione um tamanho")
      return
    }

    dispatch({
      type: "ADD_ITEM",
      payload: {
        id: product.id,
        name: product.name,
        price: product.price,
        originalPrice: product.original_price || undefined,
        image: product.image,
        size: selectedSize || undefined,
      },
    })
    dispatch({ type: "TOGGLE_CART" })
  }

  const handleBuyNow = () => {
    handleAddToCart()
    alert("Redirecionando para o checkout...")
  }

  const getAvailableStock = () => {
    if (!product) return 0

    if (hasProductSizes(product) && selectedSize) {
      return getStockForSize(product, selectedSize)
    }

    return getTotalStock(product)
  }

  const handleEditProduct = () => {
    setIsEditModalOpen(true)
  }

  const handleProductUpdated = async () => {
    try {
      const updatedProduct = await getProductById(product.id)
      if (updatedProduct) {
        setProduct(updatedProduct)
      }
    } catch (error) {
      console.error("Erro ao recarregar produto:", error)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" onClick={() => router.back()} className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>

          {isAdmin && (
            <Button
              variant="outline"
              onClick={handleEditProduct}
              className="border-primary text-primary hover:bg-primary hover:text-primary-foreground bg-transparent"
            >
              <Edit className="h-4 w-4 mr-2" />
              Editar Produto
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Product Image */}
          <div className="space-y-4">
            <div className="aspect-square overflow-hidden rounded-lg bg-muted/30">
              <img
                src={product.image || "/placeholder.svg"}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <h1 className="luxury-title text-2xl lg:text-3xl text-foreground mb-2">{product.name}</h1>

              <div className="flex items-center gap-2 mb-4">
                <Badge variant="secondary" className="text-xs">
                  {product.category}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {product.material}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  SKU: {product.sku}
                </Badge>
              </div>

              <div className="flex items-baseline gap-3 mb-4">
                <span className="luxury-serif text-3xl font-normal text-foreground">{formatPrice(product.price)}</span>
                {product.original_price && (
                  <span className="text-lg text-muted-foreground line-through">
                    {formatPrice(product.original_price)}
                  </span>
                )}
                {product.is_on_sale && <Badge className="bg-primary text-primary-foreground">OFERTA</Badge>}
              </div>

              <p className="text-sm text-muted-foreground mb-6">ou 3x de {formatPrice(product.price / 3)} sem juros</p>
            </div>

            {/* Description */}
            <div>
              <h3 className="luxury-subtitle text-sm text-foreground mb-3">DESCRIÇÃO</h3>
              <p className="text-muted-foreground leading-relaxed">{product.description}</p>
            </div>

            {/* Size Selection */}
            {hasProductSizes(product) && (
              <div>
                <h3 className="luxury-subtitle text-sm text-foreground mb-3">TAMANHOS</h3>
                <Select value={selectedSize} onValueChange={setSelectedSize}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione o tamanho" />
                  </SelectTrigger>
                  <SelectContent>
                    {product.product_sizes.map((sizeData) => (
                      <SelectItem key={sizeData.size} value={sizeData.size} disabled={sizeData.stock === 0}>
                        Tamanho {sizeData.size}{" "}
                        {sizeData.stock === 0 ? "(Esgotado)" : `(${sizeData.stock} disponíveis)`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Stock Info */}
            <div>
              <p className="text-sm text-muted-foreground">
                {getAvailableStock() > 0 ? (
                  <>
                    <span className="text-green-600 font-medium">✓ Em estoque</span> ({getAvailableStock()}{" "}
                    {getAvailableStock() === 1 ? "unidade disponível" : "unidades disponíveis"})
                  </>
                ) : (
                  <span className="text-red-600 font-medium">✗ Produto esgotado</span>
                )}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button onClick={handleAddToCart} className="w-full btn-luxury h-12" disabled={getAvailableStock() === 0}>
                <ShoppingCart className="h-4 w-4 mr-2" />
                Adicionar ao Carrinho
              </Button>

              <Button
                onClick={handleBuyNow}
                variant="outline"
                className="w-full h-12 border-primary text-primary hover:bg-primary hover:text-primary-foreground bg-transparent"
                disabled={getAvailableStock() === 0}
              >
                Comprar Agora
              </Button>

              <Button variant="ghost" className="w-full text-muted-foreground hover:text-foreground">
                <Heart className="h-4 w-4 mr-2" />
                Adicionar aos Favoritos
              </Button>
            </div>

            {/* Product Details */}
            <Card>
              <CardContent className="p-6">
                <h3 className="luxury-subtitle text-sm text-foreground mb-4">DETALHES DO PRODUTO</h3>
                <ul className="space-y-2">
                  {product.details?.map((detail, index) => (
                    <li key={index} className="text-sm text-muted-foreground flex items-start">
                      <span className="text-primary mr-2">•</span>
                      {detail}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />

      {isAdmin && (
        <AdminProductEditModal
          product={product}
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onProductUpdated={handleProductUpdated}
        />
      )}
    </div>
  )
}
