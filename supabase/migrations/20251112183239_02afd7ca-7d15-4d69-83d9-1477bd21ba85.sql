-- Criar tabela para armazenar assinaturas
CREATE TABLE public.signatures (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  ip_address TEXT NOT NULL,
  browser_fingerprint TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar Row Level Security
ALTER TABLE public.signatures ENABLE ROW LEVEL SECURITY;

-- Política para permitir leitura pública (para o contador)
CREATE POLICY "Qualquer um pode ver assinaturas"
ON public.signatures
FOR SELECT
USING (true);

-- Política para permitir inserção pública (mas validaremos no código)
CREATE POLICY "Qualquer um pode assinar"
ON public.signatures
FOR INSERT
WITH CHECK (true);

-- Índice para busca rápida por IP
CREATE INDEX idx_signatures_ip ON public.signatures(ip_address);

-- Índice para busca rápida por fingerprint
CREATE INDEX idx_signatures_fingerprint ON public.signatures(browser_fingerprint);

-- Índice para ordenação por data
CREATE INDEX idx_signatures_created_at ON public.signatures(created_at DESC);

-- Habilitar realtime para contador ao vivo
ALTER TABLE public.signatures REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.signatures;