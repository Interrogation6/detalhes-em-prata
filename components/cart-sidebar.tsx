"use client"

import { X, Minus, Plus, Trash2, ShoppingBag, Tag, Truck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useCart } from "@/contexts/cart-context"
import { useState } from "react"
import Link from "next/link"

export function CartSidebar() {
  const { state, dispatch } = useCart()
  const [couponInput, setCouponInput] = useState("")
  const [cepInput, setCepInput] = useState("")

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price)
  }

  const subtotal = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const discountAmount = (subtotal * state.discount) / 100
  const total = subtotal - discountAmount

  const handleApplyCoupon = () => {
    if (couponInput.toLowerCase() === "desconto10") {
      dispatch({ type: "APPLY_COUPON", payload: { code: couponInput, discount: 10 } })
    } else if (couponInput.toLowerCase() === "desconto20") {
      dispatch({ type: "APPLY_COUPON", payload: { code: couponInput, discount: 20 } })
    }
    setCouponInput("")
  }

  const handleQuantityChange = (id: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      dispatch({ type: "REMOVE_ITEM", payload: id })
    } else {
      dispatch({ type: "UPDATE_QUANTITY", payload: { id, quantity: newQuantity } })
    }
  }

  if (!state.isOpen) return null

  return (
    <>
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 transition-opacity duration-300"
        onClick={() => dispatch({ type: "TOGGLE_CART" })}
      />

      <div className="fixed right-0 top-0 h-full w-full sm:w-96 md:w-[420px] lg:w-[450px] max-w-[90vw] bg-card/95 backdrop-blur-sm z-50 shadow-2xl overflow-y-auto border-l border-border/50">
        <div className="flex items-center justify-between p-6 border-b border-border/30 bg-background/50">
          <div className="flex items-center gap-3">
            <ShoppingBag className="h-5 w-5 text-primary" />
            <h2 className="luxury-serif text-lg text-foreground">Minha Sacola</h2>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => dispatch({ type: "TOGGLE_CART" })}
            className="hover:bg-accent/50 rounded-full"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="flex-1 p-6">
          {state.items.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-muted/50 flex items-center justify-center">
                <ShoppingBag className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="luxury-serif text-xl text-foreground mb-3">Sua sacola está vazia</h3>
              <p className="text-sm text-muted-foreground mb-6 max-w-xs mx-auto leading-relaxed">
                Descubra nossa coleção exclusiva de semijoias em prata e adicione suas peças favoritas
              </p>
              <Button onClick={() => dispatch({ type: "TOGGLE_CART" })} className="btn-luxury px-6">
                Explorar Coleção
              </Button>
            </div>
          ) : (
            <>
              <div className="space-y-4 mb-8">
                {state.items.map((item) => (
                  <div
                    key={item.id}
                    className="product-card flex gap-4 p-4 border border-border/30 rounded-sm bg-background/30"
                  >
                    <img
                      src={item.image || "/placeholder.svg?height=80&width=80&query=silver jewelry product"}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-sm"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-light text-sm text-foreground mb-2 leading-relaxed">{item.name}</h3>
                      {item.size && <p className="text-xs text-muted-foreground mb-3">Tamanho: {item.size}</p>}

                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3 bg-muted/30 rounded-sm p-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 hover:bg-accent/50"
                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-8 text-center text-sm font-light">{item.quantity}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 hover:bg-accent/50"
                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>

                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                          onClick={() => dispatch({ type: "REMOVE_ITEM", payload: item.id })}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="flex items-center gap-2">
                        {item.originalPrice && (
                          <span className="text-xs text-muted-foreground line-through">
                            {formatPrice(item.originalPrice)}
                          </span>
                        )}
                        <span className="luxury-serif text-sm font-normal text-foreground">
                          {formatPrice(item.price)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mb-6 p-4 bg-accent/20 rounded-sm border border-border/30">
                <div className="flex items-center gap-2 mb-3">
                  <Tag className="h-4 w-4 text-primary" />
                  <h3 className="font-light text-sm text-foreground">Cupom de desconto</h3>
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Digite seu cupom"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    className="flex-1 text-sm bg-background/50 border-border/50"
                  />
                  <Button
                    onClick={handleApplyCoupon}
                    variant="outline"
                    className="text-sm px-4 hover:bg-primary hover:text-primary-foreground bg-transparent"
                  >
                    Aplicar
                  </Button>
                </div>
                {state.couponCode && (
                  <p className="text-xs text-green-600 mt-2 font-light">
                    Cupom "{state.couponCode}" aplicado com sucesso!
                  </p>
                )}
              </div>

              <div className="mb-8 p-4 bg-accent/20 rounded-sm border border-border/30">
                <div className="flex items-center gap-2 mb-3">
                  <Truck className="h-4 w-4 text-primary" />
                  <h3 className="font-light text-sm text-foreground">Calcular frete e prazo</h3>
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Digite seu CEP"
                    value={cepInput}
                    onChange={(e) => setCepInput(e.target.value)}
                    className="flex-1 text-sm bg-background/50 border-border/50"
                  />
                  <Button
                    variant="outline"
                    className="text-sm px-4 hover:bg-primary hover:text-primary-foreground bg-transparent"
                  >
                    Calcular
                  </Button>
                </div>
              </div>

              <div className="border-t border-border/30 pt-6 space-y-3 bg-background/30 -mx-6 px-6 pb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground font-light">Subtotal</span>
                  <span className="text-foreground">{formatPrice(subtotal)}</span>
                </div>

                {state.discount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground font-light">Descontos</span>
                    <span className="text-green-600">-{formatPrice(discountAmount)}</span>
                  </div>
                )}

                <div className="flex justify-between text-lg border-t border-border/30 pt-3">
                  <span className="luxury-serif text-foreground">Total</span>
                  <span className="luxury-serif text-foreground">{formatPrice(total)}</span>
                </div>

                <p className="text-xs text-muted-foreground text-center font-light">
                  Parcele em até 10x sem juros de {formatPrice(total / 10)}
                </p>
              </div>

              <Link href="/checkout">
                <Button className="w-full mt-6 btn-luxury h-12 text-sm tracking-wider">Finalizar Compra</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </>
  )
}
