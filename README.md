# Matemático.com.br — Landing & Painel Admin

> **Hub central da plataforma [Matemático.com.br](https://matematico.com.br)** — clareza financeira para profissionais e tomadores de crédito.

Landing page institucional + painel administrativo + auth centralizada para os aplicativos da plataforma.

🌐 **Produção:** https://matematico.com.br

---

## 🎯 O que é este repo

Este é o **hub** da plataforma. Apresenta os aplicativos, captura interesse de usuários (simulador embutido + contato), centraliza autenticação e gerencia conteúdos editoriais (Base de Conhecimento e FAQ) e usuários (contratantes, equipe, perfis de permissão).

## ⚡ Funcionalidades

### Pública (landing)
- **Hero** institucional e apresentação da proposta
- **Cards dos aplicativos** com status (Ativo / Em breve)
- **Simulador embutido** — simulação rápida que chama as APIs dos apps
- **Base de Conhecimento** — artigos editoriais sobre cálculos, finanças, tributação
- **FAQ** — perguntas frequentes sobre o uso do sistema
- **Diferenciais** + **Contato** (envio de mensagem para admin)
- Tema **escuro** (vs. tema claro dos apps internos)

### Auth
- Login/cadastro via **Supabase Auth**
- Compartilha sessão com todos os apps via cookies de subdomínio
- Recuperação de senha por e-mail

### Painel Admin (/admin)
Acessível apenas para usuários autorizados:
- 👥 **Contratantes** — gestão de empresas/profissionais cadastrados
- ✉️ **Contatos** — mensagens recebidas pelo formulário
- 📚 **Base de Conhecimento** — CRUD de conteúdos educacionais
- ❓ **FAQ** — CRUD de perguntas frequentes (separado da Base)
- 🛡️ **Equipe** — usuários admin
- 🎭 **Perfis** — perfis de permissão (granular por página)

## 🧱 Stack técnico

| Camada | Tecnologia |
|---|---|
| Framework | **Next.js 16** (App Router) |
| Linguagem | **TypeScript** (strict) |
| Banco | **Supabase** (PostgreSQL + RLS + Auth) |
| UI | **Tailwind CSS** (tema dark) |
| Deploy | **Vercel** |

### Arquitetura
- **App Router** com Server Components na landing
- **Client Components** apenas para interatividade (nav, simulador, FAQ acordeão)
- **RLS** + tabela `permissoes` para controle granular por página no admin
- **Middleware** para proteger rotas `/admin/*`

## 📂 Estrutura

```
app/
├── page.tsx                    # Landing
├── layout.tsx
├── Simulador.tsx               # Simulador embutido
├── NavClient.tsx               # Nav superior
├── NavMobile.tsx               # Drawer mobile
├── FaqSection.tsx              # 2 blocos: Base de Conhecimento + FAQ
├── ContatoSection.tsx
│
├── auth/                       # Login/cadastro/recuperação
│
├── admin/                      # Painel administrativo
│   ├── AdminLayout.tsx
│   ├── AdminNav.tsx            # Sidebar do admin
│   ├── page.tsx
│   ├── contratantes/
│   ├── contatos/
│   ├── base-conhecimento/      # CRUD Base de Conhecimento (tipo='base')
│   ├── faq/                    # CRUD FAQ (tipo='faq')
│   ├── equipe/
│   └── perfis/
│
└── api/
    ├── admin/
    │   ├── faq/                # CRUD via REST, aceita ?tipo=base|faq
    │   ├── contratantes/
    │   ├── contatos/
    │   ├── equipe/
    │   ├── perfis/
    │   └── logout/
    ├── simular/                # Roteador do simulador
    └── contato/                # Envio de mensagem

lib/
├── supabase.ts
├── supabase-browser.ts
├── supabase-admin.ts           # Cliente com service_role
└── paginas-admin.ts            # Catálogo de páginas para permissões

middleware.ts                   # Protege /admin/*

sql/                            # Migrations
└── faq_tipo.sql                # Separação Base de Conhecimento × FAQ
```

## 🚀 Como rodar localmente

```bash
git clone https://github.com/jcfortes/matematico-landing.git
cd matematico-landing
npm install
```

### Variáveis de ambiente

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx
SUPABASE_SERVICE_ROLE_KEY=xxx       # service_role para admin
RESEND_API_KEY=xxx                  # para envio de e-mails
```

### Banco

Você precisa das tabelas: `faq`, `faq_assuntos`, `contratantes`, `contatos`, `perfis`, `permissoes`, `equipe`. Os SQL files de criação não estão neste repo (foram aplicados manualmente). Rode pelo menos `sql/faq_tipo.sql` para separar Base × FAQ.

### Dev

```bash
npm run dev
```

Abra http://localhost:3000.

## 📜 Padrões da plataforma

Antes de mexer em qualquer UI, leia **[../PADROES-PLATAFORMA.md](../PADROES-PLATAFORMA.md)**.

⚠️ Este app usa **tema escuro**, enquanto os apps internos (amortização, atualização) usam **tema claro**. O padrão de cores (verde emerald como primária) é o mesmo, mas as classes Tailwind variam.

## 🤖 Construído com Claude Code

Veja [CLAUDE.md](./CLAUDE.md).

## 📄 Licença

Proprietário — © José Carlos Fortes / Fortes Tecnologia
