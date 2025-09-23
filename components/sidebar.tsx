"use client"
import { Menu, Sparkles, Syringe as Ring, Gem, Heart, Replace as Necklace, Users, Wrench } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { getCategoriesClient } from "@/lib/supabase/products"

interface SidebarProps {
  isOpen?: boolean
  onToggle?: () => void
}

const categoryIcons: Record<string, any> = {
  Anéis: Ring,
  Brincos: Gem,
  Colares: Necklace,
  Conjuntos: Heart,
  Pulseiras: Ring,
  Berloques: Sparkles,
  Masculino: Users,
  Suprimentos: Wrench,
}

export function Sidebar({ isOpen = false, onToggle }: SidebarProps) {
  const router = useRouter()
  const [categories, setCategories] = useState<string[]>([])
  const [isSidebarOpen, setIsSidebarOpen] = useState(isOpen)

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const cats = await getCategoriesClient()
        setCategories(cats)
      } catch (error) {
        console.error("Erro ao carregar categorias:", error)
      }
    }
    loadCategories()
  }, [])

  useEffect(() => {
    setIsSidebarOpen(isOpen)
  }, [isOpen])

  const handleToggle = () => {
    const newState = !isSidebarOpen
    setIsSidebarOpen(newState)
    onToggle?.()
  }

  const handleCategoryClick = (category: string) => {
    router.push(`/produtos?categoria=${encodeURIComponent(category)}`)
  }

  return (
    <>
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300"
          onClick={handleToggle}
        />
      )}

      <aside
        className={`
        fixed left-0 top-0 h-full bg-card/95 backdrop-blur-sm border-r border-border/50 z-50 transition-all duration-500 ease-out
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        ${isSidebarOpen ? "w-72" : "md:w-20"}
        shadow-xl md:shadow-none
      `}
      >
        <div className="flex flex-col h-full">
          <div className="flex justify-start p-6 border-b border-border/30">
            <Button
              variant="ghost"
              onClick={handleToggle}
              className="flex items-center gap-3 text-foreground hover:bg-accent/50 px-4 py-3 h-auto rounded-sm transition-all duration-300"
            >
              <Menu className="h-5 w-5" />
              {isSidebarOpen && <span className="luxury-subtitle text-xs">Categorias</span>}
            </Button>
          </div>

          <nav className="flex-1 p-6">
            <div className="space-y-1">
              <button
                onClick={() => router.push("/produtos")}
                className={`
                  group flex items-center gap-4 px-4 py-3 rounded-sm text-sm font-light transition-all duration-300
                  hover:bg-accent/50 hover:text-foreground text-muted-foreground
                  hover:translate-x-1 hover:shadow-sm w-full text-left
                  ${isSidebarOpen ? "justify-start" : "justify-center md:justify-center"}
                `}
                title={!isSidebarOpen ? "Todos os Produtos" : undefined}
              >
                <Sparkles className="h-5 w-5 flex-shrink-0 group-hover:scale-110 transition-transform duration-300" />
                {isSidebarOpen && (
                  <span className="tracking-wide group-hover:tracking-wider transition-all duration-300">
                    Todos os Produtos
                  </span>
                )}
              </button>

              {categories.map((category) => {
                const IconComponent = categoryIcons[category] || Gem
                return (
                  <button
                    key={category}
                    onClick={() => handleCategoryClick(category)}
                    className={`
                      group flex items-center gap-4 px-4 py-3 rounded-sm text-sm font-light transition-all duration-300
                      hover:bg-accent/50 hover:text-foreground text-muted-foreground
                      hover:translate-x-1 hover:shadow-sm w-full text-left
                      ${isSidebarOpen ? "justify-start" : "justify-center md:justify-center"}
                    `}
                    title={!isSidebarOpen ? category : undefined}
                  >
                    <IconComponent className="h-5 w-5 flex-shrink-0 group-hover:scale-110 transition-transform duration-300" />
                    {isSidebarOpen && (
                      <span className="tracking-wide group-hover:tracking-wider transition-all duration-300">
                        {category}
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          </nav>

          {isSidebarOpen && (
            <div className="p-6 border-t border-border/30">
              <div className="text-center">
                <p className="text-xs text-muted-foreground font-light tracking-wide">Detalhe Prata</p>
                <p className="text-xs text-muted-foreground/70 font-light mt-1">Elegância em cada detalhe</p>
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  )
}
