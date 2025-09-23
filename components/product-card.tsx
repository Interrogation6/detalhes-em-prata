"use client"

import type React from "react"

import { Heart, ShoppingCart, Edit } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useCart } from "@/contexts/cart-context"
import { useAdmin } from "@/contexts/admin-context"
import { useRouter } from "next/navigation"

interface ProductCardProps {
  id: string
  name: string
  price: number
  originalPrice?: number | null
  image: string
  isOnSale?: boolean | null
}

export function ProductCard({ id, name, price, originalPrice, image, isOnSale }: ProductCardProps) {
  const { dispatch } = useCart()
  const { isAdmin } = useAdmin()
  const router = useRouter()

  const formatPrice = (price: number) => {
    if (typeof price !== "number" || isNaN(price)) {
      return "R$ 0,00"
    }
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price)
  }

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation()

    if (!id || !name || typeof price !== "number") {
      console.error("[v0] Invalid product data:", { id, name, price })
      return
    }

    dispatch({
      type: "ADD_ITEM",
      payload: {
        id: id,
        name,
        price,
        originalPrice: originalPrice || undefined,
        image: image || "/placeholder.svg",
      },
    })
    dispatch({ type: "TOGGLE_CART" })
  }

  const handleCardClick = () => {
    router.push(`/produto/${id}`)
  }

  const handleEditProduct = (e: React.MouseEvent) => {
    e.stopPropagation()
    // Por enquanto, vamos mostrar um alert com as informações do produto
    // Em uma implementação real, isso abriria um modal ou redirecionaria para uma página de edição
    alert(
      `Editar Produto:\nID: ${id}\nNome: ${name}\nPreço: ${formatPrice(price)}\n\nEsta funcionalidade será implementada em breve.`,
    )
  }

  if (!id || !name || typeof price !== "number") {
    return null
  }

  return (
    <Card
      className="product-card group overflow-hidden border-border/50 bg-card hover:border-primary/20 transition-all duration-500 cursor-pointer"
      onClick={handleCardClick}
    >
      <div className="relative aspect-square overflow-hidden bg-muted/30">
        <img
          src={image || "/placeholder.svg?height=400&width=400&query=elegant silver jewelry product"}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
        />
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-3 right-3 text-muted-foreground hover:text-primary bg-white/90 hover:bg-white backdrop-blur-sm h-9 w-9 rounded-full border border-border/20 opacity-0 group-hover:opacity-100 transition-all duration-300"
          onClick={(e) => e.stopPropagation()}
        >
          <Heart className="h-4 w-4" />
        </Button>

        {isAdmin && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-3 left-3 text-white hover:text-primary bg-primary/90 hover:bg-primary backdrop-blur-sm h-9 w-9 rounded-full border border-border/20 opacity-0 group-hover:opacity-100 transition-all duration-300"
            onClick={handleEditProduct}
            title="Editar Produto"
          >
            <Edit className="h-4 w-4" />
          </Button>
        )}

        {isOnSale && (
          <div className="absolute top-3 left-3 bg-primary text-primary-foreground px-3 py-1 text-xs font-light tracking-wide rounded-sm">
            OFERTA
          </div>
        )}
      </div>

      <CardContent className="p-4 md:p-5">
        <h3 className="font-light text-foreground mb-3 line-clamp-2 text-sm md:text-base leading-relaxed tracking-wide hover:text-primary transition-colors duration-200">
          {name}
        </h3>

        <div className="flex items-baseline gap-2 mb-2">
          <span className="luxury-serif text-lg md:text-xl font-normal text-foreground">{formatPrice(price)}</span>
          {originalPrice && (
            <span className="text-sm text-muted-foreground line-through font-light">{formatPrice(originalPrice)}</span>
          )}
        </div>

        <p className="text-xs text-muted-foreground mb-4 font-light tracking-wide">
          ou 3x de {formatPrice(price / 3)} sem juros
        </p>

        <Button
          className="w-full btn-luxury text-xs md:text-sm font-light tracking-wider h-10"
          onClick={handleAddToCart}
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          Adicionar ao Carrinho
        </Button>
      </CardContent>
    </Card>
  )
}
