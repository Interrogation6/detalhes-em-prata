import { Star, Quote } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

const testimonials = [
  {
    id: 1,
    name: "Maria Silva",
    rating: 5,
    comment:
      "Produtos de excelente qualidade! Meu anel chegou perfeito e o acabamento é impecável. Superou minhas expectativas.",
    avatar: "/woman-profile-avatar.png",
    location: "São Paulo, SP",
  },
  {
    id: 2,
    name: "Ana Costa",
    rating: 5,
    comment:
      "Atendimento excepcional e entrega rápida. As peças são lindas e a qualidade é premium. Recomendo de olhos fechados!",
    avatar: "/woman-profile-avatar.png",
    location: "Rio de Janeiro, RJ",
  },
  {
    id: 3,
    name: "Juliana Santos",
    rating: 5,
    comment: "Apaixonada pelas peças! Qualidade premium e preço justo. Já fiz várias compras e sempre fico satisfeita.",
    avatar: "/woman-profile-avatar.png",
    location: "Belo Horizonte, MG",
  },
  {
    id: 4,
    name: "Carla Oliveira",
    rating: 4,
    comment: "Produtos lindos e bem embalados. Chegou antes do prazo previsto. A prata tem um brilho incrível!",
    avatar: "/woman-profile-avatar.png",
    location: "Brasília, DF",
  },
]

export function Testimonials() {
  return (
    <section className="py-16 md:py-20 bg-gradient-to-b from-background to-muted/20 fade-in">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="luxury-title text-2xl md:text-3xl lg:text-4xl text-foreground mb-4">
            O que dizem nossas clientes
          </h2>
          <div className="w-24 h-px bg-primary/20 mx-auto mb-2"></div>
          <div className="w-12 h-px bg-primary mx-auto mb-4"></div>
          <p className="luxury-subtitle text-sm text-muted-foreground max-w-2xl mx-auto">
            Depoimentos reais de quem confia na qualidade Detalhe Prata
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
          {testimonials.map((testimonial) => (
            <Card
              key={testimonial.id}
              className="product-card border-border/30 bg-card/50 backdrop-blur-sm hover:border-primary/20"
            >
              <CardContent className="p-6 lg:p-8">
                <Quote className="h-8 w-8 text-primary/20 mb-4" />

                <div className="flex items-start gap-4">
                  <img
                    src={testimonial.avatar || "/placeholder.svg?height=60&width=60&query=woman profile avatar"}
                    alt={testimonial.name}
                    className="w-14 h-14 rounded-full object-cover border-2 border-border/30"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-light text-foreground text-base">{testimonial.name}</h4>
                        <p className="text-xs text-muted-foreground font-light">{testimonial.location}</p>
                      </div>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < testimonial.rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground/30"
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    <p className="text-muted-foreground text-sm leading-relaxed font-light italic">
                      "{testimonial.comment}"
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
