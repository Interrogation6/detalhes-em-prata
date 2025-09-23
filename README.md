# Detalhe Prata - E-commerce de Semijoias

Uma aplicação de e-commerce elegante para semijoias em prata, construída com Next.js 14, Supabase e Tailwind CSS.

## 🚀 Tecnologias

- **Next.js 14** - Framework React com App Router
- **Supabase** - Backend como serviço (autenticação, banco de dados)
- **Tailwind CSS v4** - Framework CSS utilitário
- **TypeScript** - Tipagem estática
- **Radix UI** - Componentes acessíveis
- **Geist Font** - Tipografia moderna

## 📦 Instalação e Configuração

### 1. Clone o repositório

\`\`\`bash
git clone <repository-url>
cd detalhe-prata
\`\`\`

### 2. Instale as dependências

\`\`\`bash
npm install
# ou
yarn install
# ou
pnpm install
\`\`\`

### 3. Configure as variáveis de ambiente

Copie o arquivo `.env.example` para `.env.local`:

\`\`\`bash
cp .env.example .env.local
\`\`\`

Preencha as variáveis de ambiente no arquivo `.env.local`:

\`\`\`env
NEXT_PUBLIC_SUPABASE_URL=sua_url_do_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anonima_do_supabase
SUPABASE_SERVICE_ROLE_KEY=sua_chave_de_servico_do_supabase
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000
\`\`\`

### 4. Configure o banco de dados

Execute os scripts SQL na pasta `scripts/` no seu projeto Supabase:

1. `001_create_products_tables.sql` - Cria as tabelas de produtos
2. `002_seed_products_data.sql` - Insere dados de exemplo
3. `001_setup_user_profiles.sql` - Configura perfis de usuário

### 5. Execute o projeto

\`\`\`bash
npm run dev
# ou
yarn dev
# ou
pnpm dev
\`\`\`

Abra [http://localhost:3000](http://localhost:3000) no seu navegador.

## 🏗️ Estrutura do Projeto

\`\`\`
├── app/                    # App Router do Next.js
│   ├── globals.css        # Estilos globais
│   ├── layout.tsx         # Layout raiz
│   ├── page.tsx          # Página inicial
│   ├── produtos/         # Páginas de produtos
│   ├── produto/[id]/     # Página individual do produto
│   ├── login/            # Página de login
│   └── cadastro/         # Página de cadastro
├── components/            # Componentes React
│   ├── ui/               # Componentes base (shadcn/ui)
│   ├── header.tsx        # Cabeçalho
│   ├── sidebar.tsx       # Barra lateral
│   └── ...
├── contexts/             # Contextos React
│   ├── auth-context.tsx  # Contexto de autenticação
│   ├── cart-context.tsx  # Contexto do carrinho
│   └── admin-context.tsx # Contexto administrativo
├── lib/                  # Utilitários e configurações
│   ├── supabase/         # Configuração do Supabase
│   └── utils.ts          # Funções utilitárias
├── hooks/                # Hooks customizados
└── scripts/              # Scripts SQL do banco de dados
\`\`\`

## 🔧 Funcionalidades

### Para Usuários
- ✅ Catálogo de produtos com filtros
- ✅ Visualização detalhada de produtos
- ✅ Carrinho de compras
- ✅ Sistema de autenticação
- ✅ Busca de produtos
- ✅ Categorização por tipo de joia

### Para Administradores
- ✅ Painel administrativo
- ✅ Gerenciamento de produtos
- ✅ Controle de estoque
- ✅ Edição de informações de produtos

## 🎨 Design

O projeto utiliza um sistema de design elegante e minimalista:

- **Paleta de cores**: Tons neutros quentes com acentos em preto sofisticado
- **Tipografia**: Geist Sans para texto e Playfair Display para títulos
- **Layout**: Design responsivo mobile-first
- **Componentes**: Baseados em Radix UI para acessibilidade

## 🔒 Autenticação

O sistema de autenticação é gerenciado pelo Supabase:

- Login/cadastro com email e senha
- Sessões persistentes
- Proteção de rotas administrativas
- Middleware para gerenciamento de sessões

## 📱 Responsividade

O projeto é totalmente responsivo:

- **Mobile**: Layout otimizado para dispositivos móveis
- **Tablet**: Adaptação para telas médias
- **Desktop**: Experiência completa para telas grandes

## 🚀 Deploy

### Vercel (Recomendado)

1. Conecte seu repositório ao Vercel
2. Configure as variáveis de ambiente no painel do Vercel
3. O deploy será automático a cada push

### Outras plataformas

O projeto pode ser deployado em qualquer plataforma que suporte Next.js:

- Netlify
- Railway
- DigitalOcean App Platform

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 🆘 Suporte

Se você encontrar algum problema:

1. Verifique se todas as variáveis de ambiente estão configuradas
2. Certifique-se de que o Supabase está configurado corretamente
3. Execute `npm run build` para verificar erros de build
4. Consulte os logs do console para mais informações

Para mais ajuda, abra uma issue no repositório.
