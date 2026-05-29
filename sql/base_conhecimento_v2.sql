-- ============================================================
-- Base de Conhecimento — v2 (estruturada por app)
-- ============================================================
-- Limpa toda a Base atual e recria com conteúdo técnico
-- baseado em fontes oficiais (Código Civil, CPC, Resoluções
-- BCB, IBGE, FGV, doutrina e súmulas).
--
-- Assuntos:
--   1. Conceitos Fundamentais (matemática financeira)
--   2. Sistema de Amortização e Financiamento
--   3. Sistema de Atualização Monetária
--
-- Ao lançar um novo app, adicionar novo assunto seguindo
-- este mesmo padrão. Ver PADROES-PLATAFORMA.md.
-- ============================================================

-- 1) Limpeza completa do que existia em 'base'
delete from faq where tipo = 'base';
delete from faq_assuntos where tipo = 'base';

-- 2) Criar assuntos
insert into faq_assuntos (nome, tipo) values ('Conceitos Fundamentais', 'base');
insert into faq_assuntos (nome, tipo) values ('Sistema de Amortização e Financiamento', 'base');
insert into faq_assuntos (nome, tipo) values ('Sistema de Atualização Monetária', 'base');

-- ============================================================
-- 3) Conteúdos — Conceitos Fundamentais
-- ============================================================

insert into faq (categoria, pergunta, resposta, ordem, ativo, assunto_id, tipo) values (
'geral',
'Juros simples vs. juros compostos: qual a diferença?',
E'Juros simples são calculados sempre sobre o capital inicial (principal), sem incidir sobre os juros acumulados. A fórmula é J = C × i × n, onde C é o capital, i a taxa e n o número de períodos. Já os juros compostos incidem sobre o capital inicial + os juros dos períodos anteriores ("juros sobre juros"). A fórmula do montante é M = C × (1 + i)^n.\n\nNo Brasil, a maior parte das operações financeiras (poupança, financiamentos, aplicações) usa juros compostos. Juros simples são mais comuns em contextos jurídicos — por exemplo, juros de mora em dívidas civis (art. 406 do Código Civil) e em algumas execuções fiscais.\n\nReferências: PUCCINI, Abelardo de Lima. Matemática Financeira: objetiva e aplicada. 10. ed. Saraiva, 2017. SAMANEZ, Carlos Patricio. Matemática Financeira. 5. ed. Pearson, 2010. Banco Central do Brasil — Calculadora do Cidadão.',
10, true, (select id from faq_assuntos where nome = 'Conceitos Fundamentais' and tipo = 'base'), 'base'
);

insert into faq (categoria, pergunta, resposta, ordem, ativo, assunto_id, tipo) values (
'geral',
'Taxa nominal e taxa efetiva: como se relacionam?',
E'A taxa nominal é a taxa anunciada, geralmente sem considerar a capitalização. Já a taxa efetiva é a taxa real após considerar a capitalização dos juros no período.\n\nExemplo: uma taxa nominal de 12% a.a. com capitalização mensal corresponde a 1% ao mês. Mas a taxa efetiva anual é (1,01)^12 − 1 = 12,6825% a.a. — superior à nominal por causa do efeito composto.\n\nA Resolução CMN 3.517/2007 do Banco Central exige que instituições financeiras informem ao cliente a taxa efetiva em qualquer operação de crédito, justamente para evitar comparações enganosas baseadas só na taxa nominal.\n\nReferências: Resolução CMN 3.517/2007. VIEIRA SOBRINHO, José Dutra. Matemática Financeira. 8. ed. Atlas, 2018. Banco Central do Brasil — FAQ sobre Custo Efetivo Total.',
20, true, (select id from faq_assuntos where nome = 'Conceitos Fundamentais' and tipo = 'base'), 'base'
);

insert into faq (categoria, pergunta, resposta, ordem, ativo, assunto_id, tipo) values (
'geral',
'O que é equivalência de taxas?',
E'Equivalência de taxas é o cálculo que permite converter uma taxa de um período para outro mantendo o mesmo rendimento composto. A fórmula geral é: i₂ = (1 + i₁)^(n₁/n₂) − 1.\n\nExemplo: 1% ao mês equivale a (1,01)^12 − 1 = 12,6825% ao ano. Já 10% ao ano equivale a (1,10)^(1/12) − 1 = 0,7974% ao mês.\n\nNo Brasil, essa conversão é essencial em duas situações: (a) comparar produtos financeiros com taxas em períodos diferentes (CDB diário vs. poupança mensal); e (b) reduzir taxas anuais à equivalente mensal nos cronogramas de financiamento.\n\nReferências: SAMANEZ, Carlos Patricio. Matemática Financeira. 5. ed. Pearson, 2010, cap. 3. ASSAF NETO, Alexandre. Matemática Financeira e suas Aplicações. 14. ed. Atlas, 2016.',
30, true, (select id from faq_assuntos where nome = 'Conceitos Fundamentais' and tipo = 'base'), 'base'
);

insert into faq (categoria, pergunta, resposta, ordem, ativo, assunto_id, tipo) values (
'geral',
'O que é Taxa Interna de Retorno (TIR)?',
E'A TIR é a taxa de desconto que torna o Valor Presente Líquido (VPL) de um fluxo de caixa igual a zero. Em outras palavras, é a "taxa equivalente" que faz as entradas e saídas de caixa se igualarem em valor presente.\n\nMatematicamente: Σ (CFₜ / (1 + TIR)^t) = 0.\n\nNo contexto de financiamentos, a TIR aplicada ao fluxo (valor recebido pelo cliente em t=0 + parcelas pagas em t=1..n) é exatamente o CET (Custo Efetivo Total), conforme determina a Resolução CMN 3.517/2007.\n\nA TIR é calculada por métodos numéricos — o mais comum é Newton-Raphson, que converge iterativamente até atingir uma precisão desejada.\n\nReferências: Resolução CMN 3.517/2007. PUCCINI, Abelardo de Lima. Matemática Financeira: objetiva e aplicada. 10. ed. Saraiva, 2017. Norma Brasileira de Contabilidade NBC TG 33 (Fluxo de Caixa).',
40, true, (select id from faq_assuntos where nome = 'Conceitos Fundamentais' and tipo = 'base'), 'base'
);

-- ============================================================
-- Conteúdos — Sistema de Amortização e Financiamento
-- ============================================================

insert into faq (categoria, pergunta, resposta, ordem, ativo, assunto_id, tipo) values (
'amortizacao',
'O que é a Tabela Price (Sistema Francês de Amortização)?',
E'Criada pelo matemático e teólogo galês Richard Price (1723–1791), a Tabela Price é um sistema de amortização no qual o valor da parcela permanece constante ao longo de todo o financiamento. A composição da parcela varia: nas primeiras parcelas predominam os juros, e nas últimas predomina a amortização do principal.\n\nA fórmula da parcela é: PMT = PV × [i × (1 + i)^n] / [(1 + i)^n − 1], onde PV é o valor financiado, i a taxa periódica e n o número de parcelas.\n\nVantagens: previsibilidade do orçamento (parcela fixa). Desvantagens: o saldo devedor cai mais devagar no início, e o total de juros pagos é maior que no SAC.\n\nÉ o sistema mais usado em financiamentos de bens duráveis, veículos e crédito pessoal no Brasil.\n\nReferências: SAMANEZ, Carlos Patricio. Matemática Financeira. 5. ed. Pearson, 2010, cap. 8. ASSAF NETO, Alexandre. Matemática Financeira e suas Aplicações. 14. ed. Atlas, 2016. PRICE, Richard. Observations on Reversionary Payments (1771).',
10, true, (select id from faq_assuntos where nome = 'Sistema de Amortização e Financiamento' and tipo = 'base'), 'base'
);

insert into faq (categoria, pergunta, resposta, ordem, ativo, assunto_id, tipo) values (
'amortizacao',
'O que é o Sistema de Amortização Constante (SAC)?',
E'O SAC é um sistema de amortização brasileiro no qual a parcela de amortização (devolução do principal) é constante ao longo de todo o contrato. Os juros, por incidirem sobre saldo devedor que decresce, também caem a cada parcela. Resultado: as parcelas são decrescentes.\n\nFórmula: amortização constante = PV / n. Juros do período k = saldo_devedor_(k-1) × i. Parcela_k = amortização + juros_k.\n\nVantagens: total de juros pagos é menor que no Price; o saldo devedor cai mais rápido. Desvantagens: a primeira parcela é mais alta que no Price.\n\nÉ amplamente usado no Sistema Financeiro de Habitação (SFH) — Caixa Econômica Federal e outros bancos oferecem o SAC como opção em financiamentos imobiliários.\n\nReferências: Lei 4.380/1964 (SFH). Manual de Instruções Gerais da CAIXA (MIG-SFH). VIEIRA SOBRINHO, José Dutra. Matemática Financeira. 8. ed. Atlas, 2018.',
20, true, (select id from faq_assuntos where nome = 'Sistema de Amortização e Financiamento' and tipo = 'base'), 'base'
);

insert into faq (categoria, pergunta, resposta, ordem, ativo, assunto_id, tipo) values (
'amortizacao',
'O que é o Sistema de Amortização Variável (SAV) com Balões?',
E'O Sistema de Amortização Variável (também chamado de Sistema Misto ou Price com Balões) é uma adaptação da Tabela Price na qual se incluem pagamentos extras (balões) em parcelas específicas — geralmente semestralmente, anualmente ou ao final do contrato.\n\nO balão funciona como uma amortização extraordinária: reduz o saldo devedor em uma data programada. A partir daí, há três estratégias contratuais comuns:\n\n1. Reduzir prazo — manter a parcela e antecipar a quitação;\n2. Reduzir parcela — recalcular as parcelas seguintes com o novo saldo;\n3. Manter fluxo — abater apenas naquela parcela, sem recalcular.\n\nÉ comum em consórcios, financiamentos de veículos novos com "13ª parcela" e financiamentos comerciais flexíveis.\n\nReferências: Resolução CMN 3.517/2007 (inclui balões no cálculo do CET). ASSAF NETO, Alexandre. Matemática Financeira e suas Aplicações. 14. ed. Atlas, 2016.',
30, true, (select id from faq_assuntos where nome = 'Sistema de Amortização e Financiamento' and tipo = 'base'), 'base'
);

insert into faq (categoria, pergunta, resposta, ordem, ativo, assunto_id, tipo) values (
'amortizacao',
'O que é o Custo Efetivo Total (CET)?',
E'O Custo Efetivo Total (CET) é a taxa que expressa, em base anual, o custo real do crédito ao cliente, considerando NÃO APENAS os juros, mas todos os encargos cobrados: IOF, tarifas (cadastro, abertura de crédito), seguros, e demais despesas.\n\nMatematicamente, o CET é a Taxa Interna de Retorno (TIR) do fluxo de caixa: em t=0 o cliente recebe o valor líquido (valor financiado menos IOF, tarifas e demais despesas iniciais); em t=1..n paga as parcelas (incluindo seguros mensais, se houver).\n\nA divulgação do CET ao cliente é OBRIGATÓRIA em toda operação de crédito a pessoa física, por força da Resolução CMN 3.517/2007 e da Circular BCB 3.371/2007. Deve constar no contrato e em qualquer simulação prévia.\n\nReferências: Resolução CMN 3.517/2007. Circular BCB 3.371/2007. Banco Central do Brasil — FAQ sobre Custo Efetivo Total. Código de Defesa do Consumidor (Lei 8.078/1990), art. 52.',
40, true, (select id from faq_assuntos where nome = 'Sistema de Amortização e Financiamento' and tipo = 'base'), 'base'
);

insert into faq (categoria, pergunta, resposta, ordem, ativo, assunto_id, tipo) values (
'amortizacao',
'IOF em operações de crédito: como é cobrado?',
E'O IOF (Imposto sobre Operações Financeiras) em operações de crédito é regulado pelo Decreto 6.306/2007. A cobrança tem duas componentes:\n\n1. IOF diário — incide sobre o valor da operação, à alíquota de 0,0082% ao dia (pessoa física) ou 0,0041% (pessoa jurídica), limitado a 365 dias. Acima desse prazo, não há aumento adicional do IOF diário.\n\n2. IOF adicional — 0,38% sobre o valor da operação, cobrado uma única vez na liberação do crédito.\n\nO total do IOF em um financiamento de longo prazo (> 1 ano) é aproximadamente 3,38% do valor financiado (3,00% diário máximo + 0,38% adicional). Em prazos menores, o componente diário é proporcional ao número de dias.\n\nO IOF é retido na fonte pela instituição financeira e recolhido à Receita Federal. O cliente o paga "embutido": geralmente é descontado do valor liberado ou somado ao valor financiado.\n\nReferências: Decreto 6.306/2007 (Regulamento do IOF). Receita Federal do Brasil — Manual do IOF. Lei 5.143/1966 (Lei do IOF).',
50, true, (select id from faq_assuntos where nome = 'Sistema de Amortização e Financiamento' and tipo = 'base'), 'base'
);

insert into faq (categoria, pergunta, resposta, ordem, ativo, assunto_id, tipo) values (
'amortizacao',
'Carência em financiamentos: tipos e tratamento contábil',
E'Carência é o período inicial em que o devedor não paga o valor cheio da parcela. Há três modalidades principais:\n\n1. Carência de juros (juros pagos, principal não amortizado) — o cliente paga somente os juros durante a carência; o principal começa a ser amortizado depois.\n\n2. Carência capitalizada (juros incorporados ao saldo) — durante a carência, os juros são capitalizados (somados ao saldo devedor), e nenhum pagamento é feito. Ao final da carência, o cliente passa a pagar parcelas calculadas sobre o saldo já maior.\n\n3. Carência híbrida — paga-se um percentual definido dos juros; o restante é capitalizado.\n\nNa carência capitalizada, o saldo final ao término da carência é: SD₀ × (1 + i)^k, onde k é o número de períodos de carência.\n\nUso comum: financiamentos imobiliários (carência durante construção), financiamento estudantil (FIES — carência durante o curso) e crédito agrícola (carência até a safra).\n\nReferências: Resolução CMN 4.966/2021 (provisões e classificação de operações de crédito). Manual de Crédito Rural (Banco Central). Lei 10.260/2001 (FIES).',
60, true, (select id from faq_assuntos where nome = 'Sistema de Amortização e Financiamento' and tipo = 'base'), 'base'
);

insert into faq (categoria, pergunta, resposta, ordem, ativo, assunto_id, tipo) values (
'amortizacao',
'Price vs SAC: qual sistema paga menos juros?',
E'Em qualquer financiamento, o sistema SAC paga LESS juros no total que o sistema Price, considerando o mesmo prazo e taxa.\n\nMotivo: no SAC, a amortização do principal acontece em parcelas constantes desde a primeira parcela. Isso faz o saldo devedor cair mais rápido, e os juros (que incidem sobre o saldo) também caem mais rápido. Já no Price, nas primeiras parcelas a maior parte da prestação é juros — então o principal demora mais a ser quitado.\n\nExemplo numérico (R$ 100.000, 60 meses, 1% a.m.):\n• Price: total de juros ≈ R$ 33.467\n• SAC:   total de juros ≈ R$ 30.500\n\nDiferença: R$ 2.967 (cerca de 9% menos juros no SAC).\n\nPorém o SAC tem primeira parcela mais alta — o que pode comprometer o orçamento inicial. A escolha depende do perfil do tomador: previsibilidade (Price) vs. economia total (SAC).\n\nReferências: ASSAF NETO, Alexandre. Matemática Financeira e suas Aplicações. 14. ed. Atlas, 2016. CAIXA Econômica Federal — Comparativo Price × SAC no SFH.',
70, true, (select id from faq_assuntos where nome = 'Sistema de Amortização e Financiamento' and tipo = 'base'), 'base'
);

insert into faq (categoria, pergunta, resposta, ordem, ativo, assunto_id, tipo) values (
'amortizacao',
'Quando vale a pena fazer amortização extraordinária?',
E'A amortização extraordinária é o pagamento de um valor adicional à parcela mensal, com o objetivo de reduzir o saldo devedor antes do prazo. É autorizada pelo Banco Central por meio das Resoluções 3.516/2007 e 4.292/2013, e vedada qualquer cobrança de tarifa pela quitação ou amortização antecipada.\n\nAo amortizar, o cliente escolhe entre duas estratégias:\n\n1. Reduzir o prazo — mantém a parcela e antecipa a quitação. Economia total de juros maior.\n\n2. Reduzir a parcela — mantém o prazo, mas paga menos a cada mês. Útil para aliviar o orçamento.\n\nDicas práticas:\n• Quanto antes amortizar, maior a economia (juros incidem sobre saldo decrescente);\n• Compare o rendimento de aplicações conservadoras (CDI, Tesouro) com a taxa do financiamento — se a taxa do financiamento for maior, vale amortizar;\n• Em financiamentos imobiliários com TR + juros baixos (sub-9% a.a.), em períodos de inflação alta, pode valer mais investir.\n\nReferências: Resolução CMN 3.516/2007. Resolução CMN 4.292/2013. Banco Central do Brasil — FAQ sobre liquidação antecipada.',
80, true, (select id from faq_assuntos where nome = 'Sistema de Amortização e Financiamento' and tipo = 'base'), 'base'
);

-- ============================================================
-- Conteúdos — Sistema de Atualização Monetária
-- ============================================================

insert into faq (categoria, pergunta, resposta, ordem, ativo, assunto_id, tipo) values (
'atualizacao',
'IPCA: o que é, como é calculado e onde é usado',
E'O IPCA (Índice Nacional de Preços ao Consumidor Amplo) é o índice oficial de inflação do Brasil, calculado mensalmente pelo IBGE desde 1980. Mede a variação de preços de bens e serviços para famílias com rendimento de 1 a 40 salários mínimos, residentes nas regiões metropolitanas das maiores capitais.\n\nMetodologia (POF 2017–2018, vigente desde 2020):\n• Cesta com cerca de 380 subitens (alimentos, moradia, transporte, saúde, etc.)\n• Pesos definidos pela Pesquisa de Orçamentos Familiares (POF)\n• Coleta de aproximadamente 430 mil preços por mês\n• Cálculo de Laspeyres (preços × quantidades fixas no ano-base)\n\nUso:\n• É o índice META do Banco Central (centro 3,00% ± 1,50% para 2024)\n• Usado em correção de contratos, salários, benefícios previdenciários\n• Base para o piso nacional do magistério (Lei 11.738/2008)\n• Tribunais Superiores adotam o IPCA-E (variante "expandida") como índice de correção monetária em muitas matérias\n\nReferências: IBGE — Notas Metodológicas do Sistema Nacional de Índices de Preços ao Consumidor (SNIPC). Resolução CMN 5.117/2024 (meta de inflação 2026). Lei 11.738/2008.',
10, true, (select id from faq_assuntos where nome = 'Sistema de Atualização Monetária' and tipo = 'base'), 'base'
);

insert into faq (categoria, pergunta, resposta, ordem, ativo, assunto_id, tipo) values (
'atualizacao',
'IGP-M: composição e quando usar',
E'O IGP-M (Índice Geral de Preços do Mercado) é calculado pela FGV (Fundação Getulio Vargas) desde 1989. É um índice "geral" porque combina três índices distintos:\n\n• IPA — Índice de Preços ao Produtor Amplo (60%): preços no atacado\n• IPC — Índice de Preços ao Consumidor (30%): preços ao consumidor\n• INCC — Índice Nacional de Custo da Construção (10%): insumos da construção civil\n\nA coleta vai do dia 21 do mês anterior ao dia 20 do mês de referência. Por isso o IGP-M é divulgado por volta do dia 30 de cada mês.\n\nUso histórico:\n• Reajuste de contratos de aluguel residencial e comercial (Lei 8.245/1991)\n• Reajuste de planos de saúde antigos\n• Tarifas de serviços públicos (energia, telecom)\n\nObs.: a partir de 2020, com o IGP-M batendo recordes, muitos contratos migraram para IPCA. A Lei do Inquilinato (Lei 8.245/1991) permite negociar o índice de reajuste — não há obrigação de usar IGP-M.\n\nReferências: FGV IBRE — Metodologia dos Índices Gerais de Preços. Lei 8.245/1991 (Lei do Inquilinato). FGV IBRE — Carta IPC.',
20, true, (select id from faq_assuntos where nome = 'Sistema de Atualização Monetária' and tipo = 'base'), 'base'
);

insert into faq (categoria, pergunta, resposta, ordem, ativo, assunto_id, tipo) values (
'atualizacao',
'INPC e a diferença para o IPCA',
E'O INPC (Índice Nacional de Preços ao Consumidor) é calculado pelo IBGE com a mesma metodologia do IPCA, mas com uma diferença importante: a faixa de renda das famílias pesquisadas.\n\n• IPCA — famílias de 1 a 40 salários mínimos\n• INPC — famílias de 1 a 5 salários mínimos\n\nIsso faz o INPC refletir melhor a inflação enfrentada pela população de menor renda, onde itens essenciais (alimentos, transporte público, moradia popular) têm peso maior.\n\nUso obrigatório do INPC:\n• Reajuste do salário mínimo (não é automático, mas é a base usada nos cálculos)\n• Reajuste do salário de servidores federais (quando há acordo)\n• Reajuste anual do FGTS (TR + 3% a.a. — sem INPC, mas relevante na comparação)\n• Sentenças trabalhistas (após decisão do STF em 2020 sobre TR, o INPC voltou a ser usado em vários TRTs)\n\nReferências: IBGE — Sistema Nacional de Índices de Preços ao Consumidor (SNIPC). STF ADIs 5.867 e 6.021. TST — Súmula 200.',
30, true, (select id from faq_assuntos where nome = 'Sistema de Atualização Monetária' and tipo = 'base'), 'base'
);

insert into faq (categoria, pergunta, resposta, ordem, ativo, assunto_id, tipo) values (
'atualizacao',
'SELIC, CDI e TR: o que são e como se relacionam',
E'• SELIC — Taxa do Sistema Especial de Liquidação e Custódia. É a taxa básica de juros da economia brasileira, definida nas reuniões do COPOM (Comitê de Política Monetária do BCB) a cada 45 dias. Serve de referência para todas as outras taxas. Há duas variantes: SELIC Meta (definida pelo COPOM) e SELIC Over (média ponderada efetiva).\n\n• CDI — Certificado de Depósito Interbancário. É a taxa pela qual os bancos emprestam dinheiro entre si por 1 dia. Historicamente fica próxima da SELIC Over (diferença ~0,10 ponto). É a referência para a maioria dos investimentos de renda fixa (CDB, LCI, fundos DI).\n\n• TR — Taxa Referencial. Foi criada para substituir indexadores inflacionários no Plano Collor (1991). É calculada pelo Banco Central a partir da TBF (Taxa Básica Financeira) com aplicação de um redutor. Por anos ficou em zero. É usada para corrigir o saldo do FGTS (TR + 3% a.a.) e financiamentos imobiliários do SFH.\n\nReferências: Banco Central do Brasil — Manual de Estatísticas do SGS. Lei 8.177/1991 (TR). Resolução CMN 4.624/2018 (TBF). Comitê de Política Monetária — Atas das reuniões.',
40, true, (select id from faq_assuntos where nome = 'Sistema de Atualização Monetária' and tipo = 'base'), 'base'
);

insert into faq (categoria, pergunta, resposta, ordem, ativo, assunto_id, tipo) values (
'atualizacao',
'INCC: índice da construção civil',
E'O INCC (Índice Nacional de Custo da Construção) é calculado pela FGV e mede a variação de preços de materiais, mão de obra e serviços ligados à construção civil. Existem duas versões: INCC-DI (Disponibilidade Interna) e INCC-M (Mercado), com pequenas variações de metodologia.\n\nComposição (aproximada):\n• Materiais e equipamentos — 50%\n• Mão de obra — 35%\n• Serviços (engenharia, projetos) — 15%\n\nUso típico:\n• Reajuste de contratos de construção e empreitada\n• Correção de prestações de imóveis na planta (durante a fase de obras)\n• Adendos de orçamento em obras públicas (ainda que a lei nº 14.133/2021 permita outros índices)\n\nNo financiamento imobiliário "na planta", o INCC corrige o saldo devedor durante a obra. Após a entrega das chaves, a correção passa para outro índice contratado (geralmente IPCA, IGP-M ou TR).\n\nReferências: FGV IBRE — Carta INCC. Lei 14.133/2021 (Nova Lei de Licitações). NORMA ABNT NBR 12.721:2006 (Avaliação de custos unitários da construção).',
50, true, (select id from faq_assuntos where nome = 'Sistema de Atualização Monetária' and tipo = 'base'), 'base'
);

insert into faq (categoria, pergunta, resposta, ordem, ativo, assunto_id, tipo) values (
'atualizacao',
'Atualização monetária em condenações judiciais: qual índice usar?',
E'A atualização monetária em condenações judiciais visa preservar o valor real da dívida, não como punição mas como recomposição patrimonial. A Lei 6.899/1981 instituiu a correção monetária em débitos judiciais.\n\nÍndice aplicável (varia conforme a matéria):\n\n• Cível em geral — IPCA-E (consagrado em diversas decisões do STJ — REsp 1.495.146, RE 870.947 etc.)\n• Trabalhista — após STF (ADCs 58 e 59), IPCA-E na fase pré-judicial + SELIC após o ajuizamento\n• Tributária (créditos contra a Fazenda) — SELIC desde 1996 (Lei 9.250/1995, art. 39)\n• Previdenciária — IPCA-E (TNU 110)\n• Alimentos — INPC ou índice da Justiça local (geralmente INPC)\n\nO termo inicial da correção varia também: data do evento danoso (responsabilidade extracontratual), vencimento (contratos), ajuizamento etc. — analisar caso a caso.\n\nReferências: Lei 6.899/1981. STF — RE 870.947 (Tema 810). STF — ADCs 58/59 (correção em débitos trabalhistas). STJ — REsp 1.495.146/MG. CJF — Manual de Cálculos da Justiça Federal.',
60, true, (select id from faq_assuntos where nome = 'Sistema de Atualização Monetária' and tipo = 'base'), 'base'
);

insert into faq (categoria, pergunta, resposta, ordem, ativo, assunto_id, tipo) values (
'atualizacao',
'Juros de mora: simples ou compostos?',
E'Juros de mora são os juros devidos pelo atraso no cumprimento da obrigação. No Direito Civil brasileiro, a regra geral é JUROS SIMPLES, salvo disposição contratual ou legal específica.\n\nFundamentos:\n• Código Civil, art. 406 — "Quando os juros moratórios não forem convencionados, ou o forem sem taxa estipulada, serão fixados segundo a taxa que estiver em vigor para a mora do pagamento de impostos devidos à Fazenda Nacional" (a SELIC, conforme art. 161, §1º do CTN);\n• Súmula 379 do STJ — "Nos contratos bancários não regidos por legislação específica, os juros moratórios poderão ser convencionados até o limite de 1% ao mês";\n• Decreto 22.626/1933 (Lei da Usura) — proíbe juros compostos em contratos civis comuns;\n• Súmula 121 do STF (1963) — "É vedada a capitalização de juros, ainda que expressamente convencionada".\n\nExceções (juros compostos permitidos):\n• Sistema Financeiro Nacional — após MP 1.963-17/2000 (e suas reedições), permite-se capitalização de juros em operações financeiras se prazo igual ou inferior a 1 ano e expressamente prevista no contrato;\n• Cédulas de crédito industrial, comercial e bancário — permitido por leis específicas.\n\nReferências: Código Civil — arts. 406 e 407. CTN — art. 161, §1º. Decreto 22.626/1933. STJ — Súmula 379. STF — Súmula 121. MP 1.963-17/2000 (e reedições).',
70, true, (select id from faq_assuntos where nome = 'Sistema de Atualização Monetária' and tipo = 'base'), 'base'
);

insert into faq (categoria, pergunta, resposta, ordem, ativo, assunto_id, tipo) values (
'atualizacao',
'Multa moratória: limite legal e como calcular',
E'A multa moratória é a penalidade pelo atraso no cumprimento da obrigação. Tem natureza punitiva (e não compensatória, que seria juros). Está prevista no Código Civil arts. 408 a 416.\n\nLimites legais:\n\n• Relações de consumo — máximo de 2% sobre o valor da prestação (Código de Defesa do Consumidor, art. 52, §1º);\n• Contratos civis comuns entre particulares — limite de 10% pela Lei da Usura (Decreto 22.626/1933, art. 9º). Há divergência se ainda se aplica;\n• Locação residencial e comercial — multa pode ser livremente pactuada, sendo comum 10% sobre o aluguel atrasado (Lei 8.245/1991);\n• Tributos federais — multa de 0,33% por dia, limitada a 20% (Lei 9.430/1996, art. 61).\n\nA multa moratória é cobrada UMA ÚNICA VEZ sobre o valor devido — não é proporcional ao número de dias de atraso. Diferente dos juros de mora, que são proporcionais.\n\nReferências: Código Civil — arts. 408 a 416. Código de Defesa do Consumidor — art. 52, §1º. Decreto 22.626/1933 — art. 9º. Lei 9.430/1996 — art. 61. STJ — Súmula 285.',
80, true, (select id from faq_assuntos where nome = 'Sistema de Atualização Monetária' and tipo = 'base'), 'base'
);

insert into faq (categoria, pergunta, resposta, ordem, ativo, assunto_id, tipo) values (
'atualizacao',
'Honorários advocatícios: percentual e base de cálculo',
E'Os honorários advocatícios são a remuneração devida ao advogado vencedor da demanda. Estão regulados pelo CPC art. 85.\n\nRegra geral (CPC art. 85, §2º): honorários entre 10% e 20% sobre o valor da condenação, do proveito econômico obtido ou, não sendo possível mensurá-los, sobre o valor atualizado da causa.\n\nFatores que o juiz considera (CPC art. 85, §2º, I-IV):\n• Grau de zelo do profissional;\n• Lugar de prestação do serviço;\n• Natureza e importância da causa;\n• Trabalho realizado e tempo exigido.\n\nFazenda Pública — escalonamento decrescente (CPC art. 85, §3º):\n• até 200 SM: 10% a 20%\n• 200 a 2.000 SM: 8% a 10%\n• 2.000 a 20.000 SM: 5% a 8%\n• 20.000 a 100.000 SM: 3% a 5%\n• acima de 100.000 SM: 1% a 3%\n\nNa prática da atualização de dívidas: os honorários geralmente incidem sobre o "valor atualizado" — ou seja, valor original corrigido + juros + multa. Por isso é importante calcular nessa ordem: primeiro atualiza, depois aplica juros/multa, depois honorários como % do total.\n\nReferências: CPC (Lei 13.105/2015) — art. 85. Estatuto da OAB (Lei 8.906/1994) — arts. 22 a 26. STJ — Súmula 326. Manual de Cálculos da Justiça Federal.',
90, true, (select id from faq_assuntos where nome = 'Sistema de Atualização Monetária' and tipo = 'base'), 'base'
);

insert into faq (categoria, pergunta, resposta, ordem, ativo, assunto_id, tipo) values (
'atualizacao',
'Atualização de pensão alimentícia: critérios e índices',
E'A pensão alimentícia, uma vez fixada em sentença ou acordo homologado, sofre atualização periódica para preservar o poder de compra do alimentando. Há duas formas comuns de fixação e reajuste:\n\n1. Em salários mínimos — reajuste automático sempre que o SM é majorado. Apesar de muito usado, o STF (Súmula Vinculante 4) considerou inconstitucional a vinculação ao SM para reajuste — mas a vinculação como referência de fixação é permitida e amplamente aceita;\n\n2. Em valor fixo + índice — sentença fixa um valor (R$) e prevê reajuste anual por índice (geralmente INPC, conforme Lei 6.899/1981 e prática da Justiça Estadual).\n\nQuando os pais discutem revisão (Código Civil art. 1.699): mudança nas condições de quem paga ou de quem recebe permite revisar para mais ou para menos. Não basta a inflação — precisa demonstrar mudança fática.\n\nNo cálculo retroativo de pensões atrasadas, a regra é: valor de cada parcela vencida × correção do mês de vencimento até a data atual + juros de mora de 1% a.m. (Código Civil art. 406).\n\nReferências: Código Civil — arts. 1.694 a 1.710. Lei 5.478/1968 (Ação de Alimentos). Lei 6.899/1981 (Correção Monetária). STF — Súmula Vinculante 4. CJF — Manual de Cálculos da Justiça Federal.',
100, true, (select id from faq_assuntos where nome = 'Sistema de Atualização Monetária' and tipo = 'base'), 'base'
);

insert into faq (categoria, pergunta, resposta, ordem, ativo, assunto_id, tipo) values (
'atualizacao',
'Quando se usa SELIC em atualização monetária?',
E'A SELIC tem natureza HÍBRIDA: contém tanto juros como atualização monetária. Por isso, em algumas matérias, ela substitui AMBOS — não se aplica correção monetária por outro índice junto com juros adicionais.\n\nUsos consagrados da SELIC isolada:\n\n• Débitos da Fazenda Pública contra contribuinte (e vice-versa) — Lei 9.250/1995, art. 39 (desde 1/1/1996 a SELIC substitui juros + correção);\n• Tributos federais em geral — Lei 9.430/1996;\n• Restituição de tributos pagos a maior — Súmula 162 STJ;\n• Débitos trabalhistas após o ajuizamento da ação — STF (ADCs 58/59), substituindo a TR mais juros de mora;\n• Algumas decisões civis quando o índice contratual era omisso ou inconstitucional.\n\nAtenção: usar SELIC + correção por outro índice equivale a "bis in idem" — está vedado por reiterada jurisprudência.\n\nReferências: Lei 9.250/1995 — art. 39. Lei 9.430/1996. STJ — Súmula 162. STF — ADCs 58/59 (Tema 1191). STJ — REsp 1.111.189/SP. Manual de Cálculos da Justiça Federal.',
110, true, (select id from faq_assuntos where nome = 'Sistema de Atualização Monetária' and tipo = 'base'), 'base'
);

insert into faq (categoria, pergunta, resposta, ordem, ativo, assunto_id, tipo) values (
'atualizacao',
'Atualização monetária em contratos de aluguel',
E'O contrato de locação (urbana, residencial ou comercial) é regido pela Lei 8.245/1991 (Lei do Inquilinato). Sobre atualização:\n\nReajuste anual (art. 18) — permitido a cada 12 meses contados do início do contrato ou do último reajuste. O índice é o pactuado em contrato.\n\nÍndices mais usados:\n• IGP-M — historicamente o mais comum;\n• IPCA — adotado por muitos contratos após a alta do IGP-M em 2020–2022;\n• INPC — usado em locações de menor valor;\n• Índices da fundação local (ex.: IGP-DI também é aceito).\n\nRevisional (art. 19) — após 3 anos do contrato ou do último acordo de aluguel, qualquer parte pode pedir revisão para alinhar o valor ao preço de mercado. Não depende de atraso ou descumprimento.\n\nRenovatória (art. 51) — em locação comercial com contrato escrito por prazo determinado de 5 anos ou mais (computados acordos consecutivos), o locatário tem direito à renovação por igual período. A revisão do aluguel é parte do pedido.\n\nMora — multa moratória usual de 10% sobre o aluguel em atraso, mais juros de 1% a.m., além de correção monetária do período em atraso.\n\nReferências: Lei 8.245/1991 — arts. 17 a 21, 51 a 57. Código Civil — arts. 565 a 578. STJ — Súmulas 357 e 374. SECOVI-SP — Cartilha do Inquilinato.',
120, true, (select id from faq_assuntos where nome = 'Sistema de Atualização Monetária' and tipo = 'base'), 'base'
);

insert into faq (categoria, pergunta, resposta, ordem, ativo, assunto_id, tipo) values (
'atualizacao',
'O que são cestas de índices e quando usar',
E'Uma "cesta" de índices é a combinação de dois ou mais indicadores oficiais com pesos personalizados, formando um índice composto. Por exemplo: 60% IPCA + 40% IGP-M.\n\nPor que usar?\n\n• Reduzir volatilidade — em períodos em que um índice oscila muito (como o IGP-M em 2020–2022, próximo a 30% a.a.), uma cesta com IPCA suaviza o reajuste.\n\n• Refletir uma "cesta de despesas" específica — uma seguradora pode usar 50% INCC + 50% IPCA para corrigir contratos cuja base de custos é parte construção, parte geral.\n\n• Pactuar uma "fórmula de reajuste" — comum em contratos públicos e privados onde nenhum índice isolado representa bem a realidade da operação.\n\nMatemática: o fator de correção da cesta no mês é a soma ponderada dos fatores mensais. Ex.: se IPCA = 0,50% e IGP-M = 0,80% num mês, a cesta 60/40 desse mês é 0,60×0,50% + 0,40×0,80% = 0,62%. O fator acumulado de N meses é o produto dos fatores mensais da cesta.\n\nValidade jurídica: cestas são amplamente aceitas em contratos privados. Em contratos administrativos, devem ser previstas em edital (Lei 14.133/2021).\n\nReferências: Lei 14.133/2021 — Lei de Licitações. ASSAF NETO, Alexandre. Matemática Financeira e suas Aplicações. 14. ed. Atlas, 2016. SECOVI-SP — Manual de Reajuste de Contratos.',
130, true, (select id from faq_assuntos where nome = 'Sistema de Atualização Monetária' and tipo = 'base'), 'base'
);
