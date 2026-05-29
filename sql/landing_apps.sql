-- ============================================================
-- CMS Fase 2 — Apps da Landing (cards editáveis)
-- ============================================================
-- Tabela `landing_apps` armazena os cards de aplicativos da LP.
-- Permite ao admin: editar nome/descrição/recursos, mudar status
-- (ativo/breve/oculto), reordenar, adicionar e remover apps via
-- /admin/landing/apps — sem mexer no código.
--
-- Status:
--   'ativo'  → mostra card normal com botão "Acessar ..."
--   'breve'  → mostra card cinza com "Em desenvolvimento"
--   'oculto' → não renderiza (útil para esconder sem deletar)
--
-- Cores e classes visuais são DERIVADAS do status no componente
-- (não estão no banco) para preservar consistência visual.
-- ============================================================

create table if not exists landing_apps (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,             -- ex: 'atualizacao', 'amortizacao', 'avaliacao'
  ordem int not null default 0,          -- ordem de exibição (menor primeiro)
  status text not null default 'ativo'
    check (status in ('ativo', 'breve', 'oculto')),
  emoji text,                            -- ex: '📈', '📊', '🏢'
  tagline text,                          -- pequeno texto em uppercase acima do nome
  nome text not null,                    -- título do card
  descricao text,                        -- parágrafo de descrição
  recursos jsonb not null default '[]'::jsonb, -- array de strings (lista com ✓)
  url text,                              -- ex: 'https://atualizacao.matematico.com.br'
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

create index if not exists landing_apps_ordem_idx on landing_apps (ordem);
create index if not exists landing_apps_status_idx on landing_apps (status);

comment on table landing_apps
  is 'CMS Fase 2 — Cards de aplicativos da landing, editáveis via /admin/landing/apps';

-- ============================================================
-- RLS — leitura pública (anon + authenticated)
-- ============================================================
alter table landing_apps enable row level security;

drop policy if exists "anon pode ler landing_apps" on landing_apps;
create policy "anon pode ler landing_apps"
  on landing_apps
  for select
  to anon, authenticated
  using (true);

-- ============================================================
-- Seed inicial — 3 apps atuais
-- ============================================================
-- Idempotente: ON CONFLICT (slug) DO NOTHING preserva edições
-- futuras do admin.
-- ============================================================

insert into landing_apps (slug, ordem, status, emoji, tagline, nome, descricao, recursos, url) values
('atualizacao', 10, 'ativo', '📈',
 'ATUALIZAÇÃO DE VALORES',
 'Sistema de Atualização Monetária',
 'Atualize valores pela inflação com IPCA, IGPM, INPC e outros índices. Calcule juros, multas e correções monetárias com precisão.',
 '["IPCA, IGPM, INPC", "Juros e multas", "Série histórica", "Exportar laudo"]'::jsonb,
 'https://atualizacao.matematico.com.br'
), ('amortizacao', 20, 'ativo', '📊',
 'SISTEMA DE FINANCIAMENTOS',
 'Sistema de Amortização e Financiamento',
 'Calcule cronogramas completos de amortização pelo sistema Price, SAC ou Variável. Simule carência, balões e veja o custo efetivo total.',
 '["Price, SAC e Variável", "Pagamentos balão", "Carência", "Exportar PDF e Excel"]'::jsonb,
 'https://amortizacao.matematico.com.br'
), ('avaliacao', 30, 'breve', '🏢',
 'AVALIAÇÃO DE EMPRESAS',
 'Avaliação',
 'Valuation completo pelo método do fluxo de caixa descontado, múltiplos de mercado e patrimônio líquido ajustado.',
 '["Fluxo de caixa descontado", "Múltiplos de mercado", "Relatório executivo", "Comparativo setorial"]'::jsonb,
 null
)
on conflict (slug) do nothing;
