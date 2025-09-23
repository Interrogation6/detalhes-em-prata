"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

const banners = [
  {
    id: 1,
    title: "Elegância Atemporal",
    subtitle: "Descubra nossa coleção exclusiva de semijoias em prata",
    image: "/elegant-silver-jewelry-collection-banner.jpg",
  },
  {
    id: 2,
    title: "Peças Únicas",
    subtitle: "Designs sofisticados para momentos especiais",
    image: "/exclusive-silver-jewelry-pieces-banner.jpg",
  },
  {
    id: 3,
    title: "Qualidade Premium",
    subtitle: "Acabamento impecável em cada detalhe",
    image: "/premium-silver-jewelry-quality-banner.jpg",
  },
]

export function HeroBanner() {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length)
    }, 6000) // Increased interval for more elegant pacing
    return () => clearInterval(timer)
  }, [])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % banners.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length)
  }

  return (
    <section className="relative h-[400px] md:h-[500px] lg:h-[600px] xl:h-[650px] overflow-hidden bg-muted fade-in">
      <div className="relative w-full h-full">
        {banners.map((banner, index) => (
          <div
            key={banner.id}
            className={`absolute inset-0 transition-all duration-1000 ease-out ${
              index === currentSlide ? "opacity-100 scale-100" : "opacity-0 scale-105"
            }`}
          >
            <img
              src={banner.image || "/placeholder.svg?height=650&width=1200&query=luxury silver jewelry elegant banner"}
              alt={banner.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/40 flex items-center justify-center">
              <div className="text-center text-white px-6 lg:px-8 max-w-4xl">
                <h2 className="luxury-title text-3xl md:text-5xl lg:text-6xl xl:text-7xl text-white mb-4 lg:mb-6 text-balance">
                  {banner.title}
                </h2>
                <p className="luxury-subtitle text-sm md:text-base lg:text-lg mb-6 lg:mb-8 text-balance opacity-90 max-w-2xl mx-auto">
                  {banner.subtitle}
                </p>
                <Button size="lg" className="btn-luxury px-8 py-3 text-sm md:text-base tracking-wider">
                  Explorar Coleção
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Button
        variant="ghost"
        size="icon"
        onClick={prevSlide}
        className="absolute left-4 lg:left-8 top-1/2 transform -translate-y-1/2 text-white hover:bg-white/10 h-12 w-12 backdrop-blur-sm border border-white/20 transition-all duration-300"
      >
        <ChevronLeft className="h-5 w-5" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={nextSlide}
        className="absolute right-4 lg:right-8 top-1/2 transform -translate-y-1/2 text-white hover:bg-white/10 h-12 w-12 backdrop-blur-sm border border-white/20 transition-all duration-300"
      >
        <ChevronRight className="h-5 w-5" />
      </Button>

      <div className="absolute bottom-6 lg:bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentSlide ? "bg-white w-8" : "bg-white/50 hover:bg-white/70"
            }`}
          />
        ))}
      </div>
    </section>
  )
}
