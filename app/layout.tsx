import type { Metadata } from "next";
import "./globals.css";
import { getLandingContent } from "@/lib/landing-content";
import { SEO_KEYWORDS_FLAT } from "@/lib/seo-keywords";

const TITLE_BASE = "Matemático.com.br — Clareza Financeira em Cálculos Profissionais";
const DESCRICAO_BASE = "Plataforma de calculadoras financeiras profissionais: atualização monetária por IPCA, IGPM, INPC; simulação de financiamentos Price, SAC e variável; CET completo; demonstrativo de composição; exportação em PDF e Excel. Para advogados, contadores e consultores.";
const SITE_URL = "https://matematico.com.br";

export async function generateMetadata(): Promise<Metadata> {
  const c = await getLandingContent()
  const titulo = c('seo.titulo', TITLE_BASE)
  const descricao = c('seo.descricao', DESCRICAO_BASE)
  const googleVerif = c('seo.google_verification', '')

  return {
  metadataBase: new URL(SITE_URL),
  title: {
    default: titulo,
    template: "%s · Matemático.com.br",
  },
  description: descricao,
  applicationName: "Matemático.com.br",
  authors: [{ name: "Matemático.com.br" }],
  generator: "Next.js",
  keywords: SEO_KEYWORDS_FLAT,
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
    title: titulo,
    description: descricao,
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
    title: titulo,
    description: descricao,
    images: ["/og-image.png"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
    ],
    apple: [{ url: "/apple-touch-icon.png" }],
  },
    verification: googleVerif ? { google: googleVerif } : {},
  }
}

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
