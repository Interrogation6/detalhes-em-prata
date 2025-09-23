"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, User, Building } from "lucide-react"
import Link from "next/link"
import { useSearchParams, useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

export default function CadastroPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [activeTab, setActiveTab] = useState("cpf")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Estados para CPF
  const [nome, setNome] = useState("")
  const [sobrenome, setSobrenome] = useState("")
  const [dataNascimento, setDataNascimento] = useState("")
  const [cpf, setCpf] = useState("")
  const [telefone, setTelefone] = useState("")
  const [preferenciaContato, setPreferenciaContato] = useState("")

  // Estados para CNPJ
  const [cnpj, setCnpj] = useState("")
  const [inscricaoEstadual, setInscricaoEstadual] = useState("")
  const [nomeFantasia, setNomeFantasia] = useState("")
  const [nomeCnpj, setNomeCnpj] = useState("")
  const [sobrenomeCnpj, setSobrenomeCnpj] = useState("")
  const [telefoneCnpj, setTelefoneCnpj] = useState("")
  const [comoConheceu, setComoConheceu] = useState("")

  // Estados para endereços
  const [endereco, setEndereco] = useState({
    rua: "",
    numero: "",
    complemento: "",
    bairro: "",
    cidade: "",
    estado: "",
    cep: "",
    pontoReferencia: "",
  })

  useEffect(() => {
    const emailParam = searchParams.get("email")
    if (emailParam) {
      setEmail(emailParam)
    }
  }, [searchParams])

  const handleCPFSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      setError("As senhas não coincidem")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const supabase = createClient()

      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || `${window.location.origin}/`,
          data: {
            first_name: nome,
            last_name: sobrenome,
          },
        },
      })

      if (signUpError) throw signUpError

      if (data.user && !data.user.email_confirmed_at) {
        router.push("/auth/check-email")
        return
      }

      // Se o email foi confirmado imediatamente, criar perfil
      if (data.user) {
        const { error: profileError } = await supabase.from("profiles").insert({
          id: data.user.id,
          first_name: nome,
          last_name: sobrenome,
          phone: telefone,
          document_type: "cpf",
          document_number: cpf,
          birth_date: dataNascimento,
          contact_preference: preferenciaContato,
        })

        if (profileError) throw profileError

        // Criar endereço de entrega
        const { error: addressError } = await supabase.from("addresses").insert({
          user_id: data.user.id,
          type: "delivery",
          street: endereco.rua,
          number: endereco.numero,
          complement: endereco.complemento,
          neighborhood: endereco.bairro,
          city: endereco.cidade,
          state: endereco.estado,
          zip_code: endereco.cep,
          reference_point: endereco.pontoReferencia,
        })

        if (addressError) throw addressError
      }

      router.push("/")
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Erro ao criar conta")
    } finally {
      setIsLoading(false)
    }
  }

  const handleCNPJSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      setError("As senhas não coincidem")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const supabase = createClient()

      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || `${window.location.origin}/`,
          data: {
            first_name: nomeCnpj,
            last_name: sobrenomeCnpj,
          },
        },
      })

      if (signUpError) throw signUpError

      if (data.user && !data.user.email_confirmed_at) {
        router.push("/auth/check-email")
        return
      }

      // Se o email foi confirmado imediatamente, criar perfil
      if (data.user) {
        const { error: profileError } = await supabase.from("profiles").insert({
          id: data.user.id,
          first_name: nomeCnpj,
          last_name: sobrenomeCnpj,
          phone: telefoneCnpj,
          document_type: "cnpj",
          document_number: cnpj,
          company_name: nomeFantasia,
          state_registration: inscricaoEstadual,
          how_found_us: comoConheceu,
        })

        if (profileError) throw profileError

        // Criar endereço de entrega
        const { error: addressError } = await supabase.from("addresses").insert({
          user_id: data.user.id,
          type: "delivery",
          street: endereco.rua,
          number: endereco.numero,
          complement: endereco.complemento,
          neighborhood: endereco.bairro,
          city: endereco.cidade,
          state: endereco.estado,
          zip_code: endereco.cep,
          reference_point: endereco.pontoReferencia,
        })

        if (addressError) throw addressError
      }

      router.push("/")
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Erro ao criar conta")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="container mx-auto max-w-2xl">
        <div className="mb-6">
          <Link
            href="/login"
            className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Link>
        </div>

        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-serif">Criar Conta</CardTitle>
            <CardDescription>Complete seu cadastro para continuar</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="cpf" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Pessoa Física
                </TabsTrigger>
                <TabsTrigger value="cnpj" className="flex items-center gap-2">
                  <Building className="h-4 w-4" />
                  Pessoa Jurídica
                </TabsTrigger>
              </TabsList>

              <TabsContent value="cpf" className="mt-6">
                <form onSubmit={handleCPFSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email-cpf">E-mail *</Label>
                      <Input
                        id="email-cpf"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password-cpf">Senha *</Label>
                      <Input
                        id="password-cpf"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength={6}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirm-password-cpf">Confirmar Senha *</Label>
                    <Input
                      id="confirm-password-cpf"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      minLength={6}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="nome">Nome *</Label>
                      <Input id="nome" value={nome} onChange={(e) => setNome(e.target.value)} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="sobrenome">Sobrenome *</Label>
                      <Input id="sobrenome" value={sobrenome} onChange={(e) => setSobrenome(e.target.value)} required />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="dataNascimento">Data de Nascimento *</Label>
                      <Input
                        id="dataNascimento"
                        type="date"
                        value={dataNascimento}
                        onChange={(e) => setDataNascimento(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cpf">CPF *</Label>
                      <Input
                        id="cpf"
                        placeholder="000.000.000-00"
                        value={cpf}
                        onChange={(e) => setCpf(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="telefone">Telefone *</Label>
                    <Input
                      id="telefone"
                      placeholder="(00) 00000-0000"
                      value={telefone}
                      onChange={(e) => setTelefone(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-medium text-foreground">Endereço de Entrega</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="rua">Rua *</Label>
                        <Input
                          id="rua"
                          value={endereco.rua}
                          onChange={(e) => setEndereco({ ...endereco, rua: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="numero">Número *</Label>
                        <Input
                          id="numero"
                          value={endereco.numero}
                          onChange={(e) => setEndereco({ ...endereco, numero: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="complemento">Complemento</Label>
                        <Input
                          id="complemento"
                          value={endereco.complemento}
                          onChange={(e) => setEndereco({ ...endereco, complemento: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="bairro">Bairro *</Label>
                        <Input
                          id="bairro"
                          value={endereco.bairro}
                          onChange={(e) => setEndereco({ ...endereco, bairro: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="cidade">Cidade *</Label>
                        <Input
                          id="cidade"
                          value={endereco.cidade}
                          onChange={(e) => setEndereco({ ...endereco, cidade: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="estado">Estado *</Label>
                        <Select
                          value={endereco.estado}
                          onValueChange={(value) => setEndereco({ ...endereco, estado: value })}
                          required
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="SP">São Paulo</SelectItem>
                            <SelectItem value="RJ">Rio de Janeiro</SelectItem>
                            <SelectItem value="MG">Minas Gerais</SelectItem>
                            {/* Add more states */}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cep">CEP *</Label>
                        <Input
                          id="cep"
                          placeholder="00000-000"
                          value={endereco.cep}
                          onChange={(e) => setEndereco({ ...endereco, cep: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="pontoReferencia">Ponto de Referência</Label>
                      <Input
                        id="pontoReferencia"
                        value={endereco.pontoReferencia}
                        onChange={(e) => setEndereco({ ...endereco, pontoReferencia: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="preferenciaContato">Preferência de Contato *</Label>
                    <Select value={preferenciaContato} onValueChange={setPreferenciaContato} required>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="whatsapp">WhatsApp</SelectItem>
                        <SelectItem value="email">E-mail</SelectItem>
                        <SelectItem value="ligacao">Ligação</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {error && <div className="text-sm text-red-500 text-center">{error}</div>}

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Criando conta..." : "Criar Conta"}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="cnpj" className="mt-6">
                <form onSubmit={handleCNPJSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email-cnpj">E-mail *</Label>
                      <Input
                        id="email-cnpj"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password-cnpj">Senha *</Label>
                      <Input
                        id="password-cnpj"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength={6}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirm-password-cnpj">Confirmar Senha *</Label>
                    <Input
                      id="confirm-password-cnpj"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      minLength={6}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="cnpj">CNPJ *</Label>
                      <Input id="cnpj" placeholder="00.000.000/0000-00" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="inscricaoEstadual">Inscrição Estadual</Label>
                      <Input id="inscricaoEstadual" placeholder="Se aplicável" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="nomeFantasia">Nome Fantasia *</Label>
                    <Input id="nomeFantasia" required />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="nome-cnpj">Nome *</Label>
                      <Input id="nome-cnpj" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="sobrenome-cnpj">Sobrenome *</Label>
                      <Input id="sobrenome-cnpj" required />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="telefone-cnpj">Telefone/WhatsApp *</Label>
                    <Input id="telefone-cnpj" placeholder="(00) 00000-0000" required />
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-medium text-foreground">Endereço da Empresa</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="rua-empresa">Rua *</Label>
                        <Input id="rua-empresa" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="numero-empresa">Número *</Label>
                        <Input id="numero-empresa" required />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="complemento-empresa">Complemento</Label>
                        <Input id="complemento-empresa" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="bairro-empresa">Bairro *</Label>
                        <Input id="bairro-empresa" required />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="cidade-empresa">Cidade *</Label>
                        <Input id="cidade-empresa" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="estado-empresa">Estado *</Label>
                        <Select required>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="SP">São Paulo</SelectItem>
                            <SelectItem value="RJ">Rio de Janeiro</SelectItem>
                            <SelectItem value="MG">Minas Gerais</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cep-empresa">CEP *</Label>
                        <Input id="cep-empresa" placeholder="00000-000" required />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-medium text-foreground">Endereço de Entrega</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="rua-entrega">Rua *</Label>
                        <Input id="rua-entrega" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="numero-entrega">Número *</Label>
                        <Input id="numero-entrega" required />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="complemento-entrega">Complemento</Label>
                        <Input id="complemento-entrega" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="bairro-entrega">Bairro *</Label>
                        <Input id="bairro-entrega" required />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="cidade-entrega">Cidade *</Label>
                        <Input id="cidade-entrega" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="estado-entrega">Estado *</Label>
                        <Select required>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="SP">São Paulo</SelectItem>
                            <SelectItem value="RJ">Rio de Janeiro</SelectItem>
                            <SelectItem value="MG">Minas Gerais</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cep-entrega">CEP *</Label>
                        <Input id="cep-entrega" placeholder="00000-000" required />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="ponto-referencia-entrega">Ponto de Referência</Label>
                      <Input id="ponto-referencia-entrega" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="comoConheceu">Como nos conheceu? *</Label>
                    <Select required>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="instagram">Instagram</SelectItem>
                        <SelectItem value="site">Site</SelectItem>
                        <SelectItem value="indicacao">Indicação</SelectItem>
                        <SelectItem value="evento">Evento</SelectItem>
                        <SelectItem value="outros">Outros</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {error && <div className="text-sm text-red-500 text-center">{error}</div>}

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Criando conta..." : "Criar Conta"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
