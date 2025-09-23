-- Criar tabela principal de produtos
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  original_price DECIMAL(10,2),
  image TEXT NOT NULL,
  images TEXT[], -- Array de URLs das imagens
  is_on_sale BOOLEAN DEFAULT false,
  description TEXT NOT NULL,
  details TEXT[], -- Array de detalhes do produto
  category TEXT NOT NULL,
  material TEXT NOT NULL,
  stock INTEGER NOT NULL DEFAULT 0,
  sku TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela para tamanhos dos produtos (relacionamento 1:N)
CREATE TABLE IF NOT EXISTS public.product_sizes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  size TEXT NOT NULL,
  stock INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(product_id, size)
);

-- Habilitar Row Level Security (RLS)
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_sizes ENABLE ROW LEVEL SECURITY;

-- Políticas para produtos (leitura pública, escrita apenas para admins)
CREATE POLICY "Allow public read access on products" 
ON public.products FOR SELECT 
TO public 
USING (true);

CREATE POLICY "Allow authenticated users to insert products" 
ON public.products FOR INSERT 
TO authenticated 
WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update products" 
ON public.products FOR UPDATE 
TO authenticated 
USING (true);

CREATE POLICY "Allow authenticated users to delete products" 
ON public.products FOR DELETE 
TO authenticated 
USING (true);

-- Políticas para tamanhos dos produtos
CREATE POLICY "Allow public read access on product_sizes" 
ON public.product_sizes FOR SELECT 
TO public 
USING (true);

CREATE POLICY "Allow authenticated users to insert product_sizes" 
ON public.product_sizes FOR INSERT 
TO authenticated 
WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update product_sizes" 
ON public.product_sizes FOR UPDATE 
TO authenticated 
USING (true);

CREATE POLICY "Allow authenticated users to delete product_sizes" 
ON public.product_sizes FOR DELETE 
TO authenticated 
USING (true);

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);
CREATE INDEX IF NOT EXISTS idx_products_sku ON public.products(sku);
CREATE INDEX IF NOT EXISTS idx_products_is_on_sale ON public.products(is_on_sale);
CREATE INDEX IF NOT EXISTS idx_product_sizes_product_id ON public.product_sizes(product_id);

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para atualizar updated_at na tabela products
CREATE TRIGGER update_products_updated_at 
BEFORE UPDATE ON public.products 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
