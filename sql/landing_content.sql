-- ============================================================
-- CMS leve da landing — Fase 1 (textos editáveis)
-- ============================================================
-- Tabela chave-valor para textos editáveis da LP.
-- Cada `key` é única e representa um campo específico da página.
--
-- Permite ao admin editar via /admin/landing sem alterar código.
-- O componente público busca o valor pelo key, usando o `valor_padrao`
-- como fallback caso a query falhe ou o registro não exista.
-- ============================================================

create table if not exists landing_content (
  key text primary key,                  -- ex: 'hero.titulo', 'diferenciais.0.titulo'
  secao text not null,                   -- agrupamento no admin ('Hero', 'Diferenciais', 'Rodapé')
  ordem int not null default 0,          -- ordem de exibição no admin
  tipo text not null default 'texto' check (tipo in ('texto', 'rich_text', 'json')),
  valor text not null,                   -- conteúdo atual (texto plano ou JSON serializado)
  valor_padrao text not null,            -- valor original do código (fallback)
  descricao text,                        -- ajuda contextual no admin
  atualizado_em timestamptz default now() not null,
  atualizado_por uuid references auth.users(id) on delete set null
);

create index if not exists landing_content_secao_ordem_idx
  on landing_content (secao, ordem);

comment on table landing_content
  is 'CMS leve da landing — textos editáveis via /admin/landing';

-- ============================================================
-- RLS — permitir leitura pública (anon + authenticated)
-- ============================================================
-- Os textos da LP são públicos por natureza, então qualquer
-- visitante (mesmo não logado) precisa lê-los.
-- INSERT/UPDATE/DELETE permanecem restritos ao service_role
-- usado pelo admin (que bypassa RLS).
-- ============================================================

alter table landing_content enable row level security;

drop policy if exists "anon pode ler landing_content" on landing_content;
create policy "anon pode ler landing_content"
  on landing_content
  for select
  to anon, authenticated
  using (true);

-- ============================================================
-- Seed inicial: textos atuais da LP
-- ============================================================
-- IDEMPOTENTE: usa "on conflict do nothing" para não sobrescrever
-- valores já editados pelo admin.
-- ============================================================

-- HERO
insert into landing_content (key, secao, ordem, tipo, valor, valor_padrao, descricao) values
('hero.badge', 'Hero', 10, 'texto',
 'Plataforma de ferramentas matemáticas e financeiras',
 'Plataforma de ferramentas matemáticas e financeiras',
 'Texto pequeno no topo do hero (badge com bolinha verde)'
), ('hero.tagline', 'Hero', 20, 'texto',
 'Clareza Financeira.',
 'Clareza Financeira.',
 'Frase abaixo do logo "matematico." em destaque'
), ('hero.descricao', 'Hero', 30, 'texto',
 'Um ecossistema de ferramentas especializadas em matemática financeira, desenvolvidas para profissionais que precisam de resultados confiáveis.',
 'Um ecossistema de ferramentas especializadas em matemática financeira, desenvolvidas para profissionais que precisam de resultados confiáveis.',
 'Parágrafo de apresentação abaixo da tagline'
), ('hero.cta', 'Hero', 40, 'texto',
 'Simular agora ↓',
 'Simular agora ↓',
 'Texto do botão verde principal do hero'
)
on conflict (key) do nothing;

-- APPS (título da seção)
insert into landing_content (key, secao, ordem, tipo, valor, valor_padrao, descricao) values
('apps.titulo', 'Apps', 10, 'texto',
 'Ferramentas especializadas',
 'Ferramentas especializadas',
 'Título da seção que mostra os cards dos apps'
), ('apps.descricao', 'Apps', 20, 'texto',
 'Cada app é focado em um domínio específico da matemática financeira, com a profundidade que profissionais exigem.',
 'Cada app é focado em um domínio específico da matemática financeira, com a profundidade que profissionais exigem.',
 'Subtítulo da seção de apps'
)
on conflict (key) do nothing;

-- DIFERENCIAIS (título + descrição da seção)
insert into landing_content (key, secao, ordem, tipo, valor, valor_padrao, descricao) values
('diferenciais.titulo', 'Diferenciais', 10, 'texto',
 'Por que o Matemático?',
 'Por que o Matemático?',
 'Título da seção de diferenciais (4 cards com ícones)'
), ('diferenciais.descricao', 'Diferenciais', 11, 'texto',
 'Desenvolvido para quem precisa de resultados confiáveis, não de aproximações.',
 'Desenvolvido para quem precisa de resultados confiáveis, não de aproximações.',
 'Subtítulo/resumo da seção (texto curto abaixo do título)'
)
on conflict (key) do nothing;

-- DIFERENCIAIS (4 cards)
insert into landing_content (key, secao, ordem, tipo, valor, valor_padrao, descricao) values
('diferenciais.1.icone', 'Diferenciais', 20, 'texto', '🎯', '🎯', 'Emoji/ícone do diferencial 1'),
('diferenciais.1.titulo', 'Diferenciais', 21, 'texto', 'Precisão', 'Precisão', 'Título do diferencial 1'),
('diferenciais.1.descricao', 'Diferenciais', 22, 'texto',
 'Cálculos baseados em matemática financeira rigorosa, com resultados confiáveis para decisões importantes.',
 'Cálculos baseados em matemática financeira rigorosa, com resultados confiáveis para decisões importantes.',
 'Descrição do diferencial 1'
),
('diferenciais.2.icone', 'Diferenciais', 30, 'texto', '⚡', '⚡', 'Emoji/ícone do diferencial 2'),
('diferenciais.2.titulo', 'Diferenciais', 31, 'texto', 'Velocidade', 'Velocidade', 'Título do diferencial 2'),
('diferenciais.2.descricao', 'Diferenciais', 32, 'texto',
 'Resultados instantâneos. Simule cenários em segundos e compare alternativas sem esperar.',
 'Resultados instantâneos. Simule cenários em segundos e compare alternativas sem esperar.',
 'Descrição do diferencial 2'
),
('diferenciais.3.icone', 'Diferenciais', 40, 'texto', '📋', '📋', 'Emoji/ícone do diferencial 3'),
('diferenciais.3.titulo', 'Diferenciais', 41, 'texto', 'Relatórios', 'Relatórios', 'Título do diferencial 3'),
('diferenciais.3.descricao', 'Diferenciais', 42, 'texto',
 'Exporte cronogramas e análises em PDF e Excel, prontos para apresentação ou arquivo.',
 'Exporte cronogramas e análises em PDF e Excel, prontos para apresentação ou arquivo.',
 'Descrição do diferencial 3'
),
('diferenciais.4.icone', 'Diferenciais', 50, 'texto', '🔒', '🔒', 'Emoji/ícone do diferencial 4'),
('diferenciais.4.titulo', 'Diferenciais', 51, 'texto', 'Segurança', 'Segurança', 'Título do diferencial 4'),
('diferenciais.4.descricao', 'Diferenciais', 52, 'texto',
 'Seus dados ficam protegidos com autenticação segura e armazenamento criptografado.',
 'Seus dados ficam protegidos com autenticação segura e armazenamento criptografado.',
 'Descrição do diferencial 4'
)
on conflict (key) do nothing;

-- CTA
insert into landing_content (key, secao, ordem, tipo, valor, valor_padrao, descricao) values
('cta.titulo', 'CTA', 10, 'texto',
 'Comece agora, gratuitamente',
 'Comece agora, gratuitamente',
 'Título do bloco verde de chamada para ação (CTA) antes do FAQ'
), ('cta.descricao', 'CTA', 20, 'texto',
 'Calcule seu primeiro financiamento em menos de 2 minutos. Sem cartão de crédito.',
 'Calcule seu primeiro financiamento em menos de 2 minutos. Sem cartão de crédito.',
 'Subtítulo do CTA'
), ('cta.botao', 'CTA', 30, 'texto',
 'Criar conta grátis →',
 'Criar conta grátis →',
 'Texto do botão do CTA'
)
on conflict (key) do nothing;

-- RODAPÉ
insert into landing_content (key, secao, ordem, tipo, valor, valor_padrao, descricao) values
('rodape.aviso', 'Rodapé', 10, 'rich_text',
 'A plataforma é uma ferramenta de apoio ao trabalho profissional e não substitui a revisão por contador, advogado ou especialista qualificado. Trata-se de obrigação de meio — os resultados dependem de dados informados pelo usuário, fontes públicas (Banco Central, IBGE, FGV) e tecnologias de terceiros (incluindo IA), todos sujeitos a falhas e indisponibilidades. Confira sempre os cálculos antes de utilizá-los para fins contratuais, judiciais ou comerciais.',
 'A plataforma é uma ferramenta de apoio ao trabalho profissional e não substitui a revisão por contador, advogado ou especialista qualificado. Trata-se de obrigação de meio — os resultados dependem de dados informados pelo usuário, fontes públicas (Banco Central, IBGE, FGV) e tecnologias de terceiros (incluindo IA), todos sujeitos a falhas e indisponibilidades. Confira sempre os cálculos antes de utilizá-los para fins contratuais, judiciais ou comerciais.',
 'Aviso jurídico-técnico do rodapé (texto longo)'
), ('rodape.copyright', 'Rodapé', 20, 'texto',
 '© 2026 Matemático.com.br · Todos os direitos reservados',
 '© 2026 Matemático.com.br · Todos os direitos reservados',
 'Linha de copyright no rodapé'
)
on conflict (key) do nothing;
