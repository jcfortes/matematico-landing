-- ============================================================
-- SEO Config — campos editáveis no admin
-- ============================================================
-- Adiciona 3 chaves em `landing_content` para o admin gerenciar:
--   seo.titulo       — override do title da home
--   seo.descricao    — override da description da home
--   seo.google_verif — código de verificação do Google Search
--                       Console (para indexar oficialmente)
--
-- Se vazias, usa-se o valor padrão do código.
-- ============================================================

insert into landing_content (key, secao, ordem, tipo, valor, valor_padrao, descricao) values
('seo.titulo', 'SEO', 10, 'texto',
 'Matemático.com.br — Clareza Financeira em Cálculos Profissionais',
 'Matemático.com.br — Clareza Financeira em Cálculos Profissionais',
 'Título da página (aparece na aba do navegador e nos resultados do Google). Recomendado: até 60 caracteres.'
), ('seo.descricao', 'SEO', 20, 'rich_text',
 'Plataforma de calculadoras financeiras profissionais: atualização monetária por IPCA, IGPM, INPC; simulação de financiamentos Price, SAC e variável; CET completo; demonstrativo de composição; exportação em PDF e Excel. Para advogados, contadores e consultores.',
 'Plataforma de calculadoras financeiras profissionais: atualização monetária por IPCA, IGPM, INPC; simulação de financiamentos Price, SAC e variável; CET completo; demonstrativo de composição; exportação em PDF e Excel. Para advogados, contadores e consultores.',
 'Descrição mostrada nos resultados do Google e ao compartilhar o link. Recomendado: até 160 caracteres.'
), ('seo.google_verification', 'SEO', 30, 'texto',
 '',
 '',
 'Código de verificação do Google Search Console (apenas a string dentro do content="..."). Necessário para o Google passar a indexar o site oficialmente. Crie em search.google.com/search-console.'
)
on conflict (key) do nothing;
