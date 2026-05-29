import type { Metadata } from "next";
import "./globals.css";

const TITLE_BASE = "Matemático.com.br — Clareza Financeira em Cálculos Profissionais";
const DESCRICAO_BASE = "Plataforma de calculadoras financeiras profissionais: atualização monetária por IPCA, IGPM, INPC; simulação de financiamentos Price, SAC e variável; CET completo; demonstrativo de composição; exportação em PDF e Excel. Para advogados, contadores e consultores.";
const SITE_URL = "https://matematico.com.br";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: TITLE_BASE,
    template: "%s · Matemático.com.br",
  },
  description: DESCRICAO_BASE,
  applicationName: "Matemático.com.br",
  authors: [{ name: "Matemático.com.br" }],
  generator: "Next.js",
  keywords: [
    // Atualização monetária
    "atualização monetária",
    "correção monetária",
    "IPCA",
    "IGPM",
    "INPC",
    "INCC",
    "SELIC",
    "CDI",
    "TR",
    "calculadora de atualização monetária",
    "juros de mora",
    "multa moratória",
    "honorários advocatícios",
    // Amortização e financiamento
    "amortização",
    "sistema price",
    "tabela price",
    "sistema SAC",
    "sistema de amortização constante",
    "amortização variável",
    "balões",
    "carência",
    "financiamento imobiliário",
    "financiamento de veículo",
    "CET",
    "custo efetivo total",
    "IOF",
    "calculadora de financiamento",
    "cronograma de amortização",
    // Geral / matemática financeira
    "matemática financeira",
    "ferramentas financeiras",
    "calculadora financeira profissional",
    "advogados",
    "contadores",
    "consultores financeiros",
    "perito",
    "valuation",
    "avaliação de empresas",
  ],
  category: "finance",
  alternates: {
    canonical: SITE_URL,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: SITE_URL,
    siteName: "Matemático.com.br",
    title: TITLE_BASE,
    description: DESCRICAO_BASE,
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Matemático.com.br — Clareza Financeira",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE_BASE,
    description: DESCRICAO_BASE,
    images: ["/og-image.png"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
    ],
    apple: [{ url: "/apple-touch-icon.png" }],
  },
  verification: {
    // Adicione aqui o código do Google Search Console quando configurar:
    // google: "xxxxxxxxxxxxxxxx",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className="h-full">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
