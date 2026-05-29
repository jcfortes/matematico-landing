import { ImageResponse } from 'next/og'

// Imagem Open Graph gerada dinamicamente em build/runtime.
// Aparece como preview quando o link é compartilhado no
// WhatsApp, LinkedIn, Twitter, Facebook, etc.

export const runtime = 'edge'
export const alt = 'Matemático.com.br — Clareza Financeira'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          background: '#080808',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 80,
          color: 'white',
          fontFamily: 'Helvetica, Arial, sans-serif',
        }}
      >
        {/* Logo */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: 32,
          }}
        >
          <div
            style={{
              width: 96,
              height: 96,
              background: 'white',
              borderRadius: 16,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: 28,
            }}
          >
            <span style={{ fontSize: 64, fontWeight: 900, color: '#080808', lineHeight: 1 }}>M</span>
            <span style={{ fontSize: 56, fontWeight: 900, color: '#10b981', marginLeft: -8, marginTop: 8 }}>.</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: 72, fontWeight: 900, lineHeight: 1 }}>
              Matem<span style={{ color: '#10b981' }}>á</span>tico<span style={{ color: '#10b981' }}>.</span>
            </span>
            <span style={{ fontSize: 24, color: 'rgba(255,255,255,0.55)', marginTop: 12 }}>
              Clareza Financeira
            </span>
          </div>
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: 32,
            color: 'rgba(255,255,255,0.7)',
            textAlign: 'center',
            maxWidth: 1000,
            marginTop: 24,
            lineHeight: 1.3,
          }}
        >
          Calculadoras financeiras profissionais para advogados, contadores e consultores
        </div>

        {/* Badges */}
        <div
          style={{
            display: 'flex',
            gap: 16,
            marginTop: 48,
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}
        >
          {['Atualização Monetária', 'Amortização & Financiamento', 'CET completo'].map((b) => (
            <div
              key={b}
              style={{
                background: 'rgba(16, 185, 129, 0.15)',
                color: '#34d399',
                border: '2px solid rgba(16, 185, 129, 0.3)',
                padding: '12px 24px',
                borderRadius: 999,
                fontSize: 22,
                fontWeight: 600,
              }}
            >
              {b}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size },
  )
}
