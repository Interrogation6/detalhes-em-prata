import { Instagram, Phone, Mail, MapPin, Clock, CreditCard, Shield, Truck } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="border-b border-primary-foreground/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="flex items-center justify-center gap-3">
              <Truck className="h-6 w-6 text-primary-foreground/80" />
              <div className="text-left">
                <p className="font-light text-sm">Frete Grátis</p>
                <p className="text-xs text-primary-foreground/70">Acima de R$ 199</p>
              </div>
            </div>
            <div className="flex items-center justify-center gap-3">
              <Shield className="h-6 w-6 text-primary-foreground/80" />
              <div className="text-left">
                <p className="font-light text-sm">Compra Segura</p>
                <p className="text-xs text-primary-foreground/70">SSL Certificado</p>
              </div>
            </div>
            <div className="flex items-center justify-center gap-3">
              <CreditCard className="h-6 w-6 text-primary-foreground/80" />
              <div className="text-left">
                <p className="font-light text-sm">Parcele sem Juros</p>
                <p className="text-xs text-primary-foreground/70">Em até 10x</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <h3 className="luxury-serif text-2xl mb-4">Detalhe Prata</h3>
            <p className="text-primary-foreground/80 text-sm leading-relaxed mb-6 max-w-md font-light">
              Especialistas em semijoias de prata com mais de 10 anos de experiência. Qualidade premium, designs únicos
              e atendimento personalizado.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-light text-lg mb-4 tracking-wide">Contato</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-primary-foreground/60" />
                <span className="text-sm font-light">(11) 99999-9999</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-primary-foreground/60" />
                <span className="text-sm font-light">contato@detalheprata.com</span>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-primary-foreground/60 mt-0.5" />
                <span className="text-sm font-light">
                  São Paulo, SP
                  <br />
                  Brasil
                </span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-light text-lg mb-4 tracking-wide">Atendimento</h4>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Clock className="h-4 w-4 text-primary-foreground/60 mt-0.5" />
                <div className="text-sm font-light">
                  <p>Segunda à Sexta</p>
                  <p className="text-primary-foreground/70">09h às 18h</p>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h5 className="font-light text-sm mb-3 tracking-wide">Formas de Pagamento</h5>
              <div className="flex gap-2 flex-wrap">
                <div className="px-2 py-1 bg-primary-foreground/10 rounded text-xs font-light">VISA</div>
                <div className="px-2 py-1 bg-primary-foreground/10 rounded text-xs font-light">MASTER</div>
                <div className="px-2 py-1 bg-primary-foreground/10 rounded text-xs font-light">PIX</div>
                <div className="px-2 py-1 bg-primary-foreground/10 rounded text-xs font-light">BOLETO</div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/10 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-primary-foreground/70 font-light">
              © 2024 Detalhe Prata. Todos os direitos reservados.
            </p>
            <div className="flex gap-6 text-xs text-primary-foreground/70">
              <a href="#" className="hover:text-primary-foreground transition-colors">
                Política de Privacidade
              </a>
              <a href="#" className="hover:text-primary-foreground transition-colors">
                Termos de Uso
              </a>
              <a href="#" className="hover:text-primary-foreground transition-colors">
                Trocas e Devoluções
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
