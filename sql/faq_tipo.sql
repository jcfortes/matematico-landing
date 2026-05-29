-- ============================================================
-- Separação FAQ × Base de Conhecimento
-- ============================================================
-- Adiciona coluna `tipo` em `faq` para distinguir:
--   'base' → Base de Conhecimento (conteúdo educacional, artigos longos)
--   'faq'  → FAQ (perguntas frequentes sobre o uso do sistema)
--
-- Como os conteúdos atuais são todos educacionais, todos viram 'base'
-- por padrão. Novos cadastros do FAQ vêm marcados como 'faq'.
--
-- Migration idempotente.
-- ============================================================

alter table faq
  add column if not exists tipo text not null default 'base'
  check (tipo in ('base', 'faq'));

-- Backfill explícito caso existam linhas sem o tipo
update faq set tipo = 'base' where tipo is null;

-- Index para filtragem rápida por tipo
create index if not exists faq_tipo_idx on faq(tipo);

-- Faz o mesmo com faq_assuntos para permitir agrupar assuntos por tipo
alter table faq_assuntos
  add column if not exists tipo text not null default 'base'
  check (tipo in ('base', 'faq'));

update faq_assuntos set tipo = 'base' where tipo is null;

create index if not exists faq_assuntos_tipo_idx on faq_assuntos(tipo);

comment on column faq.tipo
  is 'Tipo: "base" (Base de Conhecimento — conteúdo educacional) ou "faq" (FAQ — perguntas frequentes sobre uso do sistema)';

comment on column faq_assuntos.tipo
  is 'Tipo: "base" ou "faq" — define em qual seção o assunto aparece';

-- ============================================================
-- Backfill de permissões: quem tem permissão 'faq' herda 'base-conhecimento'
-- ============================================================
-- Para que admins existentes não percam acesso ao novo menu, copia a
-- permissão 'faq' como 'base-conhecimento' onde ainda não existir.
-- Idempotente: ON CONFLICT DO NOTHING evita duplicata.

insert into permissoes (perfil_id, pagina)
select perfil_id, 'base-conhecimento'
  from permissoes
 where pagina = 'faq'
on conflict do nothing;
