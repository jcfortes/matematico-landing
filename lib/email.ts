/**
 * Helper de envio de emails transacionais.
 *
 * Provider: Brevo (Sendinblue) — escolhido por já ter DMARC configurado
 * no domínio matematico.com.br.
 *
 * Configuração:
 *   BREVO_API_KEY  — chave da API Brevo (https://app.brevo.com/settings/keys/api)
 *   EMAIL_FROM     — endereço remetente verificado (default: noreply@matematico.com.br)
 *   EMAIL_FROM_NOME — nome do remetente (default: Matemático · Notificações)
 *
 * Se BREVO_API_KEY não estiver configurada, o helper apenas faz LOG do email
 * que seria enviado (modo desenvolvimento/staging).
 */

export interface DestinatarioEmail {
  email: string
  nome?: string
}

export interface EmailParams {
  para: DestinatarioEmail[]
  assunto: string
  /** HTML do corpo do email */
  html: string
  /** Texto plano de fallback (opcional, gerado a partir do HTML se omitido) */
  texto?: string
  /** Substituir remetente padrão */
  remetente?: DestinatarioEmail
  /** Email pra reply (default: contato@matematico.com.br ou EMAIL_FROM) */
  responderPara?: string
}

export interface EmailResult {
  ok: boolean
  enviado: boolean
  erro?: string
  /** ID da mensagem retornado pelo provedor (se enviou) */
  messageId?: string
}

const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email'

const FROM_DEFAULT_EMAIL = process.env.EMAIL_FROM ?? 'noreply@matematico.com.br'
const FROM_DEFAULT_NOME = process.env.EMAIL_FROM_NOME ?? 'Matemático · Notificações'

/**
 * Envia um email transacional.
 *
 * @returns Resultado da operação (sempre retorna, nunca lança).
 */
export async function enviarEmail(params: EmailParams): Promise<EmailResult> {
  const apiKey = process.env.BREVO_API_KEY

  // Sem chave → log local pra debug, não envia
  if (!apiKey) {
    console.warn(
      '[email] BREVO_API_KEY não configurada. Email NÃO foi enviado. ' +
        'Configure a variável de ambiente pra ativar.\n' +
        `> Para: ${params.para.map((p) => p.email).join(', ')}\n` +
        `> Assunto: ${params.assunto}`
    )
    return { ok: true, enviado: false, erro: 'BREVO_API_KEY não configurada (apenas log)' }
  }

  const remetente = params.remetente ?? { email: FROM_DEFAULT_EMAIL, nome: FROM_DEFAULT_NOME }

  const body = {
    sender: { email: remetente.email, name: remetente.nome },
    to: params.para.map((d) => ({ email: d.email, name: d.nome })),
    subject: params.assunto,
    htmlContent: params.html,
    textContent: params.texto ?? stripHtml(params.html),
    ...(params.responderPara ? { replyTo: { email: params.responderPara } } : {}),
  }

  try {
    const res = await fetch(BREVO_API_URL, {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'api-key': apiKey,
        'content-type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    if (!res.ok) {
      const erro = await res.text()
      console.error('[email] Brevo retornou erro:', res.status, erro)
      return { ok: false, enviado: false, erro: `${res.status}: ${erro.slice(0, 200)}` }
    }

    const data = (await res.json()) as { messageId?: string }
    return { ok: true, enviado: true, messageId: data.messageId }
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'erro desconhecido'
    console.error('[email] Falha ao enviar:', msg)
    return { ok: false, enviado: false, erro: msg }
  }
}

/** Conversão básica HTML → texto plano (pra fallback) */
function stripHtml(html: string): string {
  return html
    .replace(/<style[^>]*>.*?<\/style>/gi, '')
    .replace(/<script[^>]*>.*?<\/script>/gi, '')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/?p[^>]*>/gi, '\n\n')
    .replace(/<[^>]+>/g, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

// ── Templates específicos ─────────────────────────────────────────────────

/** Template padrão pra notificação interna (alerta pros admins) */
export function templateNotificacaoAdmin(opts: {
  titulo: string
  preheader: string
  blocos: { label: string; valor: string }[]
  acao?: { texto: string; url: string }
}): string {
  const linhas = opts.blocos
    .map(
      (b) =>
        `<tr><td style="padding:8px 0;color:#64748b;font-size:13px;width:140px;vertical-align:top;">${b.label}</td>` +
        `<td style="padding:8px 0;color:#0f172a;font-size:14px;font-weight:600;">${b.valor}</td></tr>`
    )
    .join('')

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head><meta charset="utf-8" /><title>${opts.titulo}</title></head>
<body style="margin:0;background:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;">
  <span style="display:none;visibility:hidden;opacity:0;height:0;width:0;">${opts.preheader}</span>
  <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background:#f8fafc;padding:32px 16px;">
    <tr><td align="center">
      <table role="presentation" cellpadding="0" cellspacing="0" width="600" style="max-width:600px;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e2e8f0;">
        <tr><td style="background:#059669;padding:20px 24px;color:#ffffff;">
          <p style="margin:0;font-size:12px;letter-spacing:1px;text-transform:uppercase;opacity:0.9;">Matemático · Notificações</p>
          <h1 style="margin:6px 0 0;font-size:20px;font-weight:700;">${opts.titulo}</h1>
        </td></tr>
        <tr><td style="padding:24px;">
          <table role="presentation" cellpadding="0" cellspacing="0" width="100%">${linhas}</table>
          ${
            opts.acao
              ? `<table role="presentation" cellpadding="0" cellspacing="0" style="margin-top:24px;">
                  <tr><td style="border-radius:8px;background:#059669;">
                    <a href="${opts.acao.url}" target="_blank" style="display:inline-block;padding:12px 24px;color:#ffffff;text-decoration:none;font-weight:600;font-size:14px;">${opts.acao.texto}</a>
                  </td></tr>
                </table>`
              : ''
          }
        </td></tr>
        <tr><td style="padding:16px 24px;background:#f8fafc;border-top:1px solid #e2e8f0;font-size:11px;color:#94a3b8;">
          <p style="margin:0;">Esta é uma notificação automática da plataforma Matemático.com.br.</p>
          <p style="margin:4px 0 0;">Você está recebendo porque está cadastrado como administrador/gestor em /admin/notificacoes.</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`
}
