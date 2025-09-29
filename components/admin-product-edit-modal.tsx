"use client"

import { useState, useEffect } from "react"
import { Plus, Minus, X, Save, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import type { ProductWithSizes } from "@/lib/supabase/types"
import { updateProduct, updateProductSizeStock, addProductSize, removeProductSize } from "@/lib/supabase/products"

interface AdminProductEditModalProps {
  product: ProductWithSizes
  isOpen: boolean
  onClose: () => void
  onProductUpdated: () => void
}

export function AdminProductEditModal({ product, isOpen, onClose, onProductUpdated }: AdminProductEditModalProps) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [productData, setProductData] = useState({
    name: product.name,
    description: product.description || "",
    details: product.details || [],
    price: product.price,
    original_price: product.original_price || 0,
    is_on_sale: product.is_on_sale || false,
    stock: product.stock,
    category: product.category,
    material: product.material,
  })
  const [sizes, setSizes] = useState(product.product_sizes || [])
  const [newSize, setNewSize] = useState("")
  const [newSizeStock, setNewSizeStock] = useState(0)
  const [newDetail, setNewDetail] = useState("")

  useEffect(() => {
    if (product) {
      setProductData({
        name: product.name,
        description: product.description || "",
        details: product.details || [],
        price: product.price,
        original_price: product.original_price || 0,
        is_on_sale: product.is_on_sale || false,
        stock: product.stock,
        category: product.category,
        material: product.material,
      })
      setSizes(product.product_sizes || [])
    }
  }, [product])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price)
  }

  const handleSizeStockChange = async (size: string, change: number) => {
    const sizeIndex = sizes.findIndex((s) => s.size === size)
    if (sizeIndex === -1) return

    const currentStock = sizes[sizeIndex].stock
    const newStock = Math.max(0, currentStock + change)

    // Update local state immediately for better UX
    const updatedSizes = [...sizes]
    updatedSizes[sizeIndex] = { ...updatedSizes[sizeIndex], stock: newStock }
    setSizes(updatedSizes)

    // Update in database
    try {
      console.log("[v0] Updating size stock:", { productId: product.id, size, newStock })
      const success = await updateProductSizeStock(product.id, size, newStock)

      if (success) {
        toast({
          title: "Estoque atualizado",
          description: `Tamanho ${size} agora tem ${newStock} unidades`,
        })
      } else {
        throw new Error("Failed to update stock")
      }
    } catch (error) {
      console.error("Erro ao atualizar estoque:", error)
      toast({
        title: "Erro ao atualizar estoque",
        description: "Tente novamente ou verifique suas permissões",
        variant: "destructive",
      })
      // Revert local state on error
      setSizes(sizes)
    }
  }

  const handleAddSize = async () => {
    if (!newSize.trim() || newSizeStock < 0) return

    try {
      console.log("[v0] Adding new size:", { productId: product.id, size: newSize.trim(), stock: newSizeStock })
      const success = await addProductSize(product.id, newSize.trim(), newSizeStock)

      if (success) {
        setSizes([
          ...sizes,
          {
            id: crypto.randomUUID(),
            product_id: product.id,
            size: newSize.trim(),
            stock: newSizeStock,
            created_at: new Date().toISOString(),
          },
        ])
        setNewSize("")
        setNewSizeStock(0)
        toast({
          title: "Tamanho adicionado",
          description: `Tamanho ${newSize.trim()} foi adicionado com sucesso`,
        })
      } else {
        throw new Error("Failed to add size")
      }
    } catch (error) {
      console.error("Erro ao adicionar tamanho:", error)
      toast({
        title: "Erro ao adicionar tamanho",
        description: "Tente novamente ou verifique suas permissões",
        variant: "destructive",
      })
    }
  }

  const handleRemoveSize = async (size: string) => {
    try {
      console.log("[v0] Removing size:", { productId: product.id, size })
      const success = await removeProductSize(product.id, size)

      if (success) {
        setSizes(sizes.filter((s) => s.size !== size))
        toast({
          title: "Tamanho removido",
          description: `Tamanho ${size} foi removido com sucesso`,
        })
      } else {
        throw new Error("Failed to remove size")
      }
    } catch (error) {
      console.error("Erro ao remover tamanho:", error)
      toast({
        title: "Erro ao remover tamanho",
        description: "Tente novamente ou verifique suas permissões",
        variant: "destructive",
      })
    }
  }

  const handleAddDetail = () => {
    if (!newDetail.trim()) return
    setProductData({
      ...productData,
      details: [...productData.details, newDetail.trim()],
    })
    setNewDetail("")
  }

  const handleRemoveDetail = (index: number) => {
    setProductData({
      ...productData,
      details: productData.details.filter((_, i) => i !== index),
    })
  }

  const handleSaveProduct = async () => {
    setLoading(true)
    try {
      console.log("[v0] Updating product:", { productId: product.id, updates: productData })

      const success = await updateProduct(product.id, {
        name: productData.name,
        description: productData.description,
        details: productData.details,
        price: productData.price,
        original_price: productData.original_price || undefined,
        is_on_sale: productData.is_on_sale,
        stock: productData.stock,
        category: productData.category,
        material: productData.material,
      })

      console.log("[v0] Update result:", success)

      if (success) {
        toast({
          title: "Produto atualizado",
          description: "As alterações foram salvas com sucesso",
        })
        onProductUpdated()
        onClose()
      } else {
        toast({
          title: "Erro ao salvar produto",
          description: "Você precisa estar logado para editar produtos. Verifique o console para mais detalhes.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("[v0] Error in handleSaveProduct:", error)
      toast({
        title: "Erro ao salvar produto",
        description: "Ocorreu um erro inesperado. Verifique o console para detalhes.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="luxury-title text-xl">Editar Produto: {product.name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Product Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Nome do Produto</Label>
              <Input
                id="name"
                value={productData.name}
                onChange={(e) => setProductData({ ...productData, name: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="category">Categoria</Label>
              <Input
                id="category"
                value={productData.category}
                onChange={(e) => setProductData({ ...productData, category: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="material">Material</Label>
              <Input
                id="material"
                value={productData.material}
                onChange={(e) => setProductData({ ...productData, material: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="stock">Estoque Geral</Label>
              <Input
                id="stock"
                type="number"
                min="0"
                value={productData.stock}
                onChange={(e) => setProductData({ ...productData, stock: Number.parseInt(e.target.value) || 0 })}
              />
            </div>
          </div>

          {/* Pricing */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="price">Preço Atual</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                min="0"
                value={productData.price}
                onChange={(e) => setProductData({ ...productData, price: Number.parseFloat(e.target.value) || 0 })}
              />
            </div>
            <div>
              <Label htmlFor="original_price">Preço Original</Label>
              <Input
                id="original_price"
                type="number"
                step="0.01"
                min="0"
                value={productData.original_price}
                onChange={(e) =>
                  setProductData({ ...productData, original_price: Number.parseFloat(e.target.value) || 0 })
                }
              />
            </div>
            <div className="flex items-center space-x-2 pt-6">
              <input
                type="checkbox"
                id="is_on_sale"
                checked={productData.is_on_sale}
                onChange={(e) => setProductData({ ...productData, is_on_sale: e.target.checked })}
              />
              <Label htmlFor="is_on_sale">Em Promoção</Label>
            </div>
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={productData.description}
              onChange={(e) => setProductData({ ...productData, description: e.target.value })}
              rows={3}
            />
          </div>

          <Separator />

          {/* Size Management */}
          <div>
            <h3 className="luxury-subtitle text-sm text-foreground mb-4">GERENCIAR TAMANHOS E ESTOQUE</h3>

            {sizes.length > 0 && (
              <div className="space-y-3 mb-4">
                {sizes.map((sizeData) => (
                  <div key={sizeData.size} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Badge variant="outline">Tamanho {sizeData.size}</Badge>
                      <span className="text-sm text-muted-foreground">
                        {sizeData.stock} {sizeData.stock === 1 ? "unidade" : "unidades"}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSizeStockChange(sizeData.size, -1)}
                        disabled={sizeData.stock === 0}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-8 text-center text-sm font-medium">{sizeData.stock}</span>
                      <Button variant="outline" size="sm" onClick={() => handleSizeStockChange(sizeData.size, 1)}>
                        <Plus className="h-3 w-3" />
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleRemoveSize(sizeData.size)}>
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Add New Size */}
            <div className="flex items-end space-x-2">
              <div className="flex-1">
                <Label htmlFor="newSize">Novo Tamanho</Label>
                <Input
                  id="newSize"
                  placeholder="Ex: P, M, G, 16, 18..."
                  value={newSize}
                  onChange={(e) => setNewSize(e.target.value)}
                />
              </div>
              <div className="flex-1">
                <Label htmlFor="newSizeStock">Estoque</Label>
                <Input
                  id="newSizeStock"
                  type="number"
                  min="0"
                  value={newSizeStock}
                  onChange={(e) => setNewSizeStock(Number.parseInt(e.target.value) || 0)}
                />
              </div>
              <Button onClick={handleAddSize} disabled={!newSize.trim()}>
                <Plus className="h-4 w-4 mr-1" />
                Adicionar
              </Button>
            </div>
          </div>

          <Separator />

          {/* Product Details */}
          <div>
            <h3 className="luxury-subtitle text-sm text-foreground mb-4">DETALHES DO PRODUTO</h3>

            {productData.details.length > 0 && (
              <div className="space-y-2 mb-4">
                {productData.details.map((detail, index) => (
                  <div key={index} className="flex items-center justify-between p-2 border rounded">
                    <span className="text-sm">{detail}</span>
                    <Button variant="ghost" size="sm" onClick={() => handleRemoveDetail(index)}>
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {/* Add New Detail */}
            <div className="flex items-end space-x-2">
              <div className="flex-1">
                <Label htmlFor="newDetail">Novo Detalhe</Label>
                <Input
                  id="newDetail"
                  placeholder="Ex: Banhado a ouro, Hipoalergênico..."
                  value={newDetail}
                  onChange={(e) => setNewDetail(e.target.value)}
                />
              </div>
              <Button onClick={handleAddDetail} disabled={!newDetail.trim()}>
                <Plus className="h-4 w-4 mr-1" />
                Adicionar
              </Button>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSaveProduct} disabled={loading} className="btn-luxury">
            <Save className="h-4 w-4 mr-2" />
            {loading ? "Salvando..." : "Salvar Alterações"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
