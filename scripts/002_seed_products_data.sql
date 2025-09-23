-- Inserir produtos existentes no banco de dados
INSERT INTO public.products (
  name, price, original_price, image, images, is_on_sale, description, details, 
  category, material, stock, sku
) VALUES 
(
  'Anel Solitário Elegante',
  149.90,
  NULL,
  '/elegant-silver-solitaire-ring.jpg',
  ARRAY['/elegant-silver-solitaire-ring.jpg'],
  false,
  'Um anel solitário clássico em prata 925, perfeito para ocasiões especiais. Design atemporal que combina elegância e sofisticação.',
  ARRAY[
    'Prata 925 de alta qualidade',
    'Pedra zircônia cúbica premium',
    'Acabamento polido',
    'Garantia de 1 ano',
    'Acompanha certificado de autenticidade'
  ],
  'Anéis',
  'Prata 925',
  48,
  'ASE001'
),
(
  'Colar Delicado Prata',
  189.90,
  NULL,
  '/delicate-silver-necklace.jpg',
  ARRAY['/delicate-silver-necklace.jpg'],
  false,
  'Colar delicado em prata 925 com corrente veneziana. Peça versátil que complementa qualquer look com elegância.',
  ARRAY[
    'Prata 925 de alta qualidade',
    'Corrente veneziana 45cm',
    'Fecho lagosta seguro',
    'Acabamento rhodium',
    'Hipoalergênico'
  ],
  'Colares',
  'Prata 925',
  25,
  'CDP002'
),
(
  'Brincos Minimalistas',
  89.90,
  NULL,
  '/minimalist-silver-earrings.jpg',
  ARRAY['/minimalist-silver-earrings.jpg'],
  false,
  'Brincos minimalistas em prata 925 com design clean e moderno. Perfeitos para o dia a dia ou ocasiões especiais.',
  ARRAY[
    'Prata 925 de alta qualidade',
    'Design minimalista',
    'Tarraxa de pressão',
    'Acabamento polido',
    'Hipoalergênico'
  ],
  'Brincos',
  'Prata 925',
  18,
  'BM003'
),
(
  'Pulseira Charm Prata',
  129.90,
  NULL,
  '/silver-charm-bracelet.jpg',
  ARRAY['/silver-charm-bracelet.jpg'],
  false,
  'Pulseira charm em prata 925 com berloques delicados. Peça personalizável que conta sua história.',
  ARRAY[
    'Prata 925 de alta qualidade',
    'Comprimento ajustável 16-20cm',
    'Berloques inclusos',
    'Fecho seguro',
    'Possibilidade de adicionar novos charms'
  ],
  'Pulseiras',
  'Prata 925',
  15,
  'PCP004'
),
(
  'Conjunto Harmonia',
  104.93,
  149.90,
  '/silver-jewelry-harmony-set.jpg',
  ARRAY['/silver-jewelry-harmony-set.jpg'],
  true,
  'Conjunto harmonioso com colar e brincos em prata 925. Design coordenado para um look completo e elegante.',
  ARRAY[
    'Prata 925 de alta qualidade',
    'Colar 42cm + brincos',
    'Design coordenado',
    'Acabamento rhodium',
    'Embalagem presente inclusa'
  ],
  'Conjuntos',
  'Prata 925',
  12,
  'CH005'
),
(
  'Anel Vintage Prata',
  104.93,
  149.90,
  '/vintage-silver-ring.jpg',
  ARRAY['/vintage-silver-ring.jpg'],
  true,
  'Anel vintage em prata 925 com detalhes trabalhados. Design clássico que nunca sai de moda.',
  ARRAY[
    'Prata 925 de alta qualidade',
    'Design vintage trabalhado',
    'Acabamento envelhecido',
    'Peça única',
    'Inspiração art déco'
  ],
  'Anéis',
  'Prata 925',
  23,
  'AVP006'
),
(
  'Colar Coração Clássico',
  159.90,
  NULL,
  '/classic-heart-silver-necklace.jpg',
  ARRAY['/classic-heart-silver-necklace.jpg'],
  false,
  'Colar com pingente de coração em prata 925. Símbolo eterno do amor e carinho.',
  ARRAY[
    'Prata 925 de alta qualidade',
    'Pingente coração 1,5cm',
    'Corrente 45cm',
    'Acabamento polido',
    'Embalagem presente'
  ],
  'Colares',
  'Prata 925',
  20,
  'CCC007'
),
(
  'Brincos Argola Média',
  119.90,
  NULL,
  '/medium-silver-hoop-earrings.jpg',
  ARRAY['/medium-silver-hoop-earrings.jpg'],
  false,
  'Brincos argola média em prata 925. Clássicos atemporais que complementam qualquer estilo.',
  ARRAY[
    'Prata 925 de alta qualidade',
    'Diâmetro 2,5cm',
    'Fecho de pressão',
    'Acabamento polido',
    'Design clássico'
  ],
  'Brincos',
  'Prata 925',
  22,
  'BAM008'
),
(
  'Pulseira Elos Prata',
  139.90,
  NULL,
  '/silver-chain-link-bracelet.jpg',
  ARRAY['/silver-chain-link-bracelet.jpg'],
  false,
  'Pulseira de elos em prata 925 com design robusto e elegante. Peça statement para looks marcantes.',
  ARRAY[
    'Prata 925 de alta qualidade',
    'Elos trabalhados',
    'Comprimento 19cm',
    'Fecho seguro',
    'Acabamento polido'
  ],
  'Pulseiras',
  'Prata 925',
  14,
  'PEP009'
),
(
  'Anel Infinito Delicado',
  99.90,
  NULL,
  '/delicate-infinity-silver-ring.jpg',
  ARRAY['/delicate-infinity-silver-ring.jpg'],
  false,
  'Anel infinito delicado em prata 925. Símbolo do amor eterno em design minimalista.',
  ARRAY[
    'Prata 925 de alta qualidade',
    'Design infinito',
    'Acabamento polido',
    'Anel delicado',
    'Significado especial'
  ],
  'Anéis',
  'Prata 925',
  34,
  'AID010'
);

-- Inserir tamanhos para os anéis
DO $$
DECLARE
    anel_solitario_id UUID;
    anel_vintage_id UUID;
    anel_infinito_id UUID;
BEGIN
    -- Buscar IDs dos anéis
    SELECT id INTO anel_solitario_id FROM public.products WHERE sku = 'ASE001';
    SELECT id INTO anel_vintage_id FROM public.products WHERE sku = 'AVP006';
    SELECT id INTO anel_infinito_id FROM public.products WHERE sku = 'AID010';
    
    -- Inserir tamanhos para Anel Solitário Elegante
    INSERT INTO public.product_sizes (product_id, size, stock) VALUES
    (anel_solitario_id, '14', 5),
    (anel_solitario_id, '15', 8),
    (anel_solitario_id, '16', 12),
    (anel_solitario_id, '17', 10),
    (anel_solitario_id, '18', 6),
    (anel_solitario_id, '19', 4),
    (anel_solitario_id, '20', 3);
    
    -- Inserir tamanhos para Anel Vintage Prata
    INSERT INTO public.product_sizes (product_id, size, stock) VALUES
    (anel_vintage_id, '14', 2),
    (anel_vintage_id, '15', 4),
    (anel_vintage_id, '16', 6),
    (anel_vintage_id, '17', 5),
    (anel_vintage_id, '18', 3),
    (anel_vintage_id, '19', 2),
    (anel_vintage_id, '20', 1);
    
    -- Inserir tamanhos para Anel Infinito Delicado
    INSERT INTO public.product_sizes (product_id, size, stock) VALUES
    (anel_infinito_id, '14', 3),
    (anel_infinito_id, '15', 6),
    (anel_infinito_id, '16', 8),
    (anel_infinito_id, '17', 7),
    (anel_infinito_id, '18', 5),
    (anel_infinito_id, '19', 3),
    (anel_infinito_id, '20', 2);
END $$;
