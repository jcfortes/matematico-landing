import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Matemático.com.br — Cálculos precisos. Decisões inteligentes.",
  description: "Plataforma de ferramentas matemáticas e financeiras para análise de financiamentos, avaliação de empresas e atualização de valores.",
  keywords: ["amortização", "financiamento", "avaliação de empresas", "matemática financeira"],
  openGraph: {
    title: "Matemático.com.br",
    description: "Cálculos precisos. Decisões inteligentes.",
    url: "https://matematico.com.br",
    siteName: "Matemático.com.br",
    locale: "pt_BR",
    type: "website",
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
