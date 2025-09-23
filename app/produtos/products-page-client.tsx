"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Search, Filter, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ProductCard } from "@/components/product-card"
import type { ProductWithSizes } from "@/lib/supabase/types"
import { searchProductsClient, getProductsByCategoryClient } from "@/lib/supabase/products"

interface ProductsPageClientProps {
  initialProducts: ProductWithSizes[]
  categories: string[]
}

export function ProductsPageClient({ initialProducts, categories }: ProductsPageClientProps) {
  const searchParams = useSearchParams()
  const [products, setProducts] = useState<ProductWithSizes[]>(initialProducts)
  const [filteredProducts, setFilteredProducts] = useState<ProductWithSizes[]>(initialProducts)
  const [searchTerm, setSearchTerm] = useState(searchParams.get("busca") || "")
  const [selectedCategory, setSelectedCategory] = useState<string>(searchParams.get("categoria") || "all")
  const [sortBy, setSortBy] = useState<string>("newest")
  const [priceRange, setPriceRange] = useState<string>("all")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const loadInitialData = async () => {
      const searchQuery = searchParams.get("busca")
      const categoryQuery = searchParams.get("categoria")

      if (searchQuery) {
        setIsLoading(true)
        try {
          const results = await searchProductsClient(searchQuery)
          setProducts(results)
        } catch (error) {
          console.error("Erro na busca:", error)
        } finally {
          setIsLoading(false)
        }
      } else if (categoryQuery && categoryQuery !== "all") {
        setIsLoading(true)
        try {
          const results = await getProductsByCategoryClient(categoryQuery)
          setProducts(results)
        } catch (error) {
          console.error("Erro ao filtrar por categoria:", error)
        } finally {
          setIsLoading(false)
        }
      }
    }

    loadInitialData()
  }, [searchParams])

  // Aplicar filtros
  useEffect(() => {
    let filtered = [...products]

    // Filtro por categoria
    if (selectedCategory !== "all") {
      filtered = filtered.filter((product) => product.category === selectedCategory)
    }

    // Filtro por faixa de preço
    if (priceRange !== "all") {
      switch (priceRange) {
        case "0-100":
          filtered = filtered.filter((product) => product.price <= 100)
          break
        case "100-200":
          filtered = filtered.filter((product) => product.price > 100 && product.price <= 200)
          break
        case "200+":
          filtered = filtered.filter((product) => product.price > 200)
          break
      }
    }

    // Ordenação
    switch (sortBy) {
      case "price-asc":
        filtered.sort((a, b) => a.price - b.price)
        break
      case "price-desc":
        filtered.sort((a, b) => b.price - a.price)
        break
      case "name":
        filtered.sort((a, b) => a.name.localeCompare(b.name))
        break
      case "newest":
      default:
        filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        break
    }

    setFilteredProducts(filtered)
  }, [products, selectedCategory, sortBy, priceRange])

  // Busca por termo
  const handleSearch = async (term: string) => {
    setSearchTerm(term)
    if (term.trim() === "") {
      setProducts(initialProducts)
      return
    }

    setIsLoading(true)
    try {
      const results = await searchProductsClient(term)
      setProducts(results)
    } catch (error) {
      console.error("Erro na busca:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Filtrar por categoria
  const handleCategoryFilter = async (category: string) => {
    setSelectedCategory(category)
    if (category === "all") {
      setProducts(initialProducts)
      return
    }

    setIsLoading(true)
    try {
      const results = await getProductsByCategoryClient(category)
      setProducts(results)
    } catch (error) {
      console.error("Erro ao filtrar por categoria:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Limpar filtros
  const clearFilters = () => {
    setSearchTerm("")
    setSelectedCategory("all")
    setSortBy("newest")
    setPriceRange("all")
    setProducts(initialProducts)
  }

  const hasActiveFilters = searchTerm !== "" || selectedCategory !== "all" || priceRange !== "all"

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="luxury-title text-3xl lg:text-4xl text-foreground mb-4">NOSSOS PRODUTOS</h1>
        <div className="w-24 h-px bg-primary/20 mx-auto mb-2"></div>
        <div className="w-12 h-px bg-primary mx-auto"></div>
      </div>

      {/* Filtros e Busca */}
      <div className="bg-card/50 backdrop-blur-sm border border-border/30 rounded-lg p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          {/* Busca */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Buscar produtos..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Categoria */}
          <Select value={selectedCategory} onValueChange={handleCategoryFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Categoria" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as categorias</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Faixa de Preço */}
          <Select value={priceRange} onValueChange={setPriceRange}>
            <SelectTrigger>
              <SelectValue placeholder="Preço" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os preços</SelectItem>
              <SelectItem value="0-100">Até R$ 100</SelectItem>
              <SelectItem value="100-200">R$ 100 - R$ 200</SelectItem>
              <SelectItem value="200+">Acima de R$ 200</SelectItem>
            </SelectContent>
          </Select>

          {/* Ordenação */}
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger>
              <SelectValue placeholder="Ordenar por" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Mais recentes</SelectItem>
              <SelectItem value="price-asc">Menor preço</SelectItem>
              <SelectItem value="price-desc">Maior preço</SelectItem>
              <SelectItem value="name">Nome A-Z</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Filtros ativos */}
        {hasActiveFilters && (
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm text-muted-foreground">Filtros ativos:</span>
            {searchTerm && (
              <Badge variant="secondary" className="gap-1">
                Busca: {searchTerm}
                <X className="h-3 w-3 cursor-pointer" onClick={() => handleSearch("")} />
              </Badge>
            )}
            {selectedCategory !== "all" && (
              <Badge variant="secondary" className="gap-1">
                {selectedCategory}
                <X className="h-3 w-3 cursor-pointer" onClick={() => handleCategoryFilter("all")} />
              </Badge>
            )}
            {priceRange !== "all" && (
              <Badge variant="secondary" className="gap-1">
                {priceRange === "0-100" && "Até R$ 100"}
                {priceRange === "100-200" && "R$ 100-200"}
                {priceRange === "200+" && "Acima de R$ 200"}
                <X className="h-3 w-3 cursor-pointer" onClick={() => setPriceRange("all")} />
              </Badge>
            )}
            <Button variant="ghost" size="sm" onClick={clearFilters} className="text-xs">
              Limpar todos
            </Button>
          </div>
        )}
      </div>

      {/* Resultados */}
      <div className="mb-6">
        <p className="text-muted-foreground">
          {isLoading ? "Carregando..." : `${filteredProducts.length} produto(s) encontrado(s)`}
        </p>
      </div>

      {/* Grid de Produtos */}
      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-square bg-muted rounded-lg mb-4"></div>
              <div className="h-4 bg-muted rounded mb-2"></div>
              <div className="h-4 bg-muted rounded w-2/3"></div>
            </div>
          ))}
        </div>
      ) : filteredProducts.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8 lg:gap-10">
          {filteredProducts.map((product) => (
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
      ) : (
        <div className="text-center py-12">
          <div className="text-muted-foreground mb-4">
            <Filter className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg">Nenhum produto encontrado</p>
            <p className="text-sm">Tente ajustar os filtros ou termo de busca</p>
          </div>
          <Button variant="outline" onClick={clearFilters}>
            Limpar filtros
          </Button>
        </div>
      )}
    </div>
  )
}
