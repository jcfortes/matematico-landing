-- ============================================================
-- FAQ sobre a Plataforma Matemático.com.br
-- ============================================================
-- Insere assuntos + 15 perguntas frequentes sobre a plataforma
-- como um todo, com linguagem clara para o usuário final.
--
-- Idempotente: não duplica registros se rodar mais de uma vez
-- (compara por pergunta + tipo).
-- ============================================================

-- 1) Garantir assuntos do tipo 'faq'
insert into faq_assuntos (nome, tipo)
select 'Sobre a Plataforma', 'faq'
where not exists (
  select 1 from faq_assuntos where nome = 'Sobre a Plataforma' and tipo = 'faq'
);

insert into faq_assuntos (nome, tipo)
select 'Aplicativos', 'faq'
where not exists (
  select 1 from faq_assuntos where nome = 'Aplicativos' and tipo = 'faq'
);

insert into faq_assuntos (nome, tipo)
select 'Conta e Segurança', 'faq'
where not exists (
  select 1 from faq_assuntos where nome = 'Conta e Segurança' and tipo = 'faq'
);

insert into faq_assuntos (nome, tipo)
select 'Uso e Cobrança', 'faq'
where not exists (
  select 1 from faq_assuntos where nome = 'Uso e Cobrança' and tipo = 'faq'
);

-- 2) Inserir as perguntas (cada bloco verifica se já existe)

-- ── Sobre a Plataforma ──────────────────────────────────────

insert into faq (categoria, pergunta, resposta, ordem, ativo, assunto_id, tipo)
select 'geral',
       'O que é o Matemático.com.br?',
       'É uma plataforma online de cálculos financeiros voltada para profissionais (advogados, contadores, consultores, corretores) e também para qualquer pessoa que queira entender com clareza o custo real de um financiamento ou o valor atualizado de uma dívida ou contrato. Reunimos várias calculadoras em uma só plataforma, com o mesmo padrão visual e exportação profissional dos resultados.',
       10, true,
       (select id from faq_assuntos where nome = 'Sobre a Plataforma' and tipo = 'faq' limit 1),
       'faq'
where not exists (select 1 from faq where pergunta = 'O que é o Matemático.com.br?' and tipo = 'faq');

insert into faq (categoria, pergunta, resposta, ordem, ativo, assunto_id, tipo)
select 'geral',
       'Para quem a plataforma é indicada?',
       'Para profissionais que trabalham com cálculos financeiros no dia a dia — advogados (atualização de dívidas, alimentos, indenizações), contadores (correção de contratos e ativos), consultores financeiros, corretores de imóveis e vendedores de bens financiados. Também é útil para pessoas físicas que querem simular financiamentos antes de assinar ou conferir o valor atualizado de uma dívida.',
       20, true,
       (select id from faq_assuntos where nome = 'Sobre a Plataforma' and tipo = 'faq' limit 1),
       'faq'
where not exists (select 1 from faq where pergunta = 'Para quem a plataforma é indicada?' and tipo = 'faq');

insert into faq (categoria, pergunta, resposta, ordem, ativo, assunto_id, tipo)
select 'geral',
       'Qual é a proposta da plataforma?',
       'Entregar cálculos rigorosos, transparentes e exportáveis. A maioria das calculadoras na internet simplifica demais ou esconde os passos do cálculo. Nossa proposta é mostrar o caminho completo — do valor original ao total devido — para que o usuário (e o cliente dele) entenda exatamente como o número foi obtido.',
       30, true,
       (select id from faq_assuntos where nome = 'Sobre a Plataforma' and tipo = 'faq' limit 1),
       'faq'
where not exists (select 1 from faq where pergunta = 'Qual é a proposta da plataforma?' and tipo = 'faq');

insert into faq (categoria, pergunta, resposta, ordem, ativo, assunto_id, tipo)
select 'geral',
       'Os cálculos são confiáveis?',
       'Sim. Usamos uma biblioteca de precisão matemática (Decimal.js) para evitar erros de arredondamento. O cálculo do CET (Custo Efetivo Total) segue a Resolução 3.517/2007 do Banco Central, que é a norma oficial. Os dados de índices oficiais (IPCA, IGP-M, INPC, SELIC, etc.) vêm direto da API pública do Banco Central. Em cálculos jurídicos, aplicamos juros simples na mora, conforme prática consagrada nos tribunais.',
       40, true,
       (select id from faq_assuntos where nome = 'Sobre a Plataforma' and tipo = 'faq' limit 1),
       'faq'
where not exists (select 1 from faq where pergunta = 'Os cálculos são confiáveis?' and tipo = 'faq');

-- ── Aplicativos ─────────────────────────────────────────────

insert into faq (categoria, pergunta, resposta, ordem, ativo, assunto_id, tipo)
select 'geral',
       'Quais aplicativos estão disponíveis?',
       'Atualmente temos dois aplicativos ativos: (1) Sistema de Amortização e Financiamento — calcula financiamentos pelos sistemas Price, SAC e Variável (Price + Balões); e (2) Sistema de Atualização Monetária — atualiza valores por índices oficiais (IPCA, IGP-M, INPC, SELIC e mais) com possibilidade de aplicar juros, multa e despesas. Estamos preparando também um sistema de Avaliação de empresas, que será lançado em breve.',
       10, true,
       (select id from faq_assuntos where nome = 'Aplicativos' and tipo = 'faq' limit 1),
       'faq'
where not exists (select 1 from faq where pergunta = 'Quais aplicativos estão disponíveis?' and tipo = 'faq');

insert into faq (categoria, pergunta, resposta, ordem, ativo, assunto_id, tipo)
select 'amortizacao',
       'O que faz o Sistema de Amortização e Financiamento?',
       'Calcula cronogramas completos de financiamento. Você informa o valor do bem, a entrada, o prazo e a taxa de juros, e o sistema gera todas as parcelas com juros, amortização, saldo devedor e Custo Efetivo Total (CET). Permite escolher entre três modelos — Tabela Price (parcela fixa), SAC (parcela decrescente) e SAV/Variável (Price com balões) — e ainda cadastrar custos do contrato como IOF, tarifa de cadastro e seguros. Tudo pode ser exportado em PDF ou Excel.',
       20, true,
       (select id from faq_assuntos where nome = 'Aplicativos' and tipo = 'faq' limit 1),
       'faq'
where not exists (select 1 from faq where pergunta = 'O que faz o Sistema de Amortização e Financiamento?' and tipo = 'faq');

insert into faq (categoria, pergunta, resposta, ordem, ativo, assunto_id, tipo)
select 'atualizacao',
       'O que faz o Sistema de Atualização Monetária?',
       'Atualiza valores pela inflação ou por outros índices. Por exemplo, se uma dívida de R$ 10.000 é de 2020, o sistema calcula quanto ela vale hoje corrigida por IPCA, IGP-M, INPC, SELIC ou outro índice que você escolher. Também permite aplicar juros de mora, multa e despesas (como honorários advocatícios em percentual), gerando um demonstrativo completo do cálculo. É possível comparar vários índices ao mesmo tempo para ver qual rendeu mais no período. Ideal para advogados e contadores.',
       30, true,
       (select id from faq_assuntos where nome = 'Aplicativos' and tipo = 'faq' limit 1),
       'faq'
where not exists (select 1 from faq where pergunta = 'O que faz o Sistema de Atualização Monetária?' and tipo = 'faq');

insert into faq (categoria, pergunta, resposta, ordem, ativo, assunto_id, tipo)
select 'geral',
       'Posso exportar os cálculos em PDF e Excel?',
       'Sim, todos os aplicativos da plataforma permitem exportar os resultados em dois formatos: PDF (laudo profissional pronto para apresentar a um cliente, juiz ou parecer técnico) e Excel (planilha estruturada caso você queira continuar trabalhando com os dados ou integrar a outros documentos).',
       40, true,
       (select id from faq_assuntos where nome = 'Aplicativos' and tipo = 'faq' limit 1),
       'faq'
where not exists (select 1 from faq where pergunta = 'Posso exportar os cálculos em PDF e Excel?' and tipo = 'faq');

insert into faq (categoria, pergunta, resposta, ordem, ativo, assunto_id, tipo)
select 'geral',
       'Posso usar a plataforma pelo celular?',
       'Sim. Todos os aplicativos são responsivos e funcionam bem no celular, tablet e computador. Para uso intenso em cálculos complexos com muitas parcelas, recomendamos o computador para ter mais espaço na tela.',
       50, true,
       (select id from faq_assuntos where nome = 'Aplicativos' and tipo = 'faq' limit 1),
       'faq'
where not exists (select 1 from faq where pergunta = 'Posso usar a plataforma pelo celular?' and tipo = 'faq');

-- ── Conta e Segurança ───────────────────────────────────────

insert into faq (categoria, pergunta, resposta, ordem, ativo, assunto_id, tipo)
select 'geral',
       'Como faço para criar uma conta?',
       'Acesse https://matematico.com.br, clique em "Entrar" no menu superior e escolha a opção de cadastro. Você precisa apenas de um e-mail válido. Após confirmar o e-mail, já pode acessar todos os aplicativos da plataforma com o mesmo login.',
       10, true,
       (select id from faq_assuntos where nome = 'Conta e Segurança' and tipo = 'faq' limit 1),
       'faq'
where not exists (select 1 from faq where pergunta = 'Como faço para criar uma conta?' and tipo = 'faq');

insert into faq (categoria, pergunta, resposta, ordem, ativo, assunto_id, tipo)
select 'geral',
       'Meus dados ficam protegidos?',
       'Sim. Usamos autenticação segura (criptografia padrão da indústria) e cada usuário só consegue ver os próprios cálculos e clientes cadastrados — nem mesmo a equipe da plataforma tem acesso aos dados pessoais que você inserir nos cálculos. O banco de dados é hospedado em infraestrutura profissional (Supabase) com backups automáticos.',
       20, true,
       (select id from faq_assuntos where nome = 'Conta e Segurança' and tipo = 'faq' limit 1),
       'faq'
where not exists (select 1 from faq where pergunta = 'Meus dados ficam protegidos?' and tipo = 'faq');

insert into faq (categoria, pergunta, resposta, ordem, ativo, assunto_id, tipo)
select 'geral',
       'Esqueci minha senha. Como recupero?',
       'Na tela de login, clique em "Esqueci minha senha". Você receberá um e-mail com link para criar uma nova. Se não receber, verifique a pasta de spam.',
       30, true,
       (select id from faq_assuntos where nome = 'Conta e Segurança' and tipo = 'faq' limit 1),
       'faq'
where not exists (select 1 from faq where pergunta = 'Esqueci minha senha. Como recupero?' and tipo = 'faq');

insert into faq (categoria, pergunta, resposta, ordem, ativo, assunto_id, tipo)
select 'geral',
       'Posso usar a mesma conta em mais de um aplicativo?',
       'Sim, e essa é justamente uma vantagem da plataforma. Com um único login você acessa todos os aplicativos (Amortização, Atualização Monetária e os futuros). Não precisa criar contas separadas.',
       40, true,
       (select id from faq_assuntos where nome = 'Conta e Segurança' and tipo = 'faq' limit 1),
       'faq'
where not exists (select 1 from faq where pergunta = 'Posso usar a mesma conta em mais de um aplicativo?' and tipo = 'faq');

-- ── Uso e Cobrança ──────────────────────────────────────────

insert into faq (categoria, pergunta, resposta, ordem, ativo, assunto_id, tipo)
select 'geral',
       'A plataforma é gratuita?',
       'No momento, a plataforma está em fase de lançamento e o uso é gratuito. Futuramente teremos planos pagos para profissionais com recursos avançados (mais histórico, equipe, marca branca em laudos, etc.). Quando isso acontecer, avisaremos com antecedência.',
       10, true,
       (select id from faq_assuntos where nome = 'Uso e Cobrança' and tipo = 'faq' limit 1),
       'faq'
where not exists (select 1 from faq where pergunta = 'A plataforma é gratuita?' and tipo = 'faq');

insert into faq (categoria, pergunta, resposta, ordem, ativo, assunto_id, tipo)
select 'geral',
       'Há limite de cálculos ou cadastros?',
       'Não há limite definido para uso normal. Recomendamos apenas bom senso: a plataforma é desenhada para profissionais que fazem dezenas a centenas de cálculos por mês. Casos de uso muito acima disso, ou integrações automatizadas, podem requerer um plano específico — entre em contato.',
       20, true,
       (select id from faq_assuntos where nome = 'Uso e Cobrança' and tipo = 'faq' limit 1),
       'faq'
where not exists (select 1 from faq where pergunta = 'Há limite de cálculos ou cadastros?' and tipo = 'faq');

insert into faq (categoria, pergunta, resposta, ordem, ativo, assunto_id, tipo)
select 'geral',
       'Como entro em contato com a equipe?',
       'Use o formulário na seção "Contato" na página inicial (https://matematico.com.br/#contato). Respondemos por e-mail em até 2 dias úteis. Sugestões, dúvidas, parcerias e propostas comerciais são todas bem-vindas.',
       30, true,
       (select id from faq_assuntos where nome = 'Uso e Cobrança' and tipo = 'faq' limit 1),
       'faq'
where not exists (select 1 from faq where pergunta = 'Como entro em contato com a equipe?' and tipo = 'faq');
