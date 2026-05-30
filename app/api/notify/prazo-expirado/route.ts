import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { enviarEmail, templateNotificacaoAdmin } from '@/lib/email'

/**
 * POST — recebe notificação de prazo expirado de um usuário e
 * envia email pros administradores cadastrados em admin_notificacoes
 * que têm notif_prazo_expirado=true.
 *
 * Idempotente: usa profiles.prazo_notificado_em pra não enviar 2 vezes.
 * Se já foi notificado nas últimas 24h, ignora.
 *
 * Body: { userId: string }
 *
 * Chamada pelos apps internos quando o middleware detecta expiração.
 */
export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json()
    if (!userId) {
      return NextResponse.json({ error: 'userId é obrigatório' }, { status: 400 })
    }

    // 1) Carrega profile do usuário expirado
    const { data: profile, error: errProfile } = await supabaseAdmin
      .from('profiles')
      .select('id, nome, prazo_tipo, prazo_quantidade, prazo_inicio, prazo_notificado_em')
      .eq('id', userId)
      .single()

    if (errProfile || !profile) {
      return NextResponse.json({ error: 'Profile não encontrado' }, { status: 404 })
    }

    // 2) Verifica idempotência (já notificado nas últimas 24h?)
    if (profile.prazo_notificado_em) {
      const ultimaNotif = new Date(profile.prazo_notificado_em)
      const horasDesdeUltima = (Date.now() - ultimaNotif.getTime()) / (1000 * 60 * 60)
      if (horasDesdeUltima < 24) {
        return NextResponse.json({ ok: true, ja_notificado: true, horas: horasDesdeUltima.toFixed(1) })
      }
    }

    // 3) Carrega email do usuário via auth
    const { data: { user: usuarioExpirado } } = await supabaseAdmin.auth.admin.getUserById(userId)
    const emailUsuario = usuarioExpirado?.email ?? '(email não encontrado)'
    const nomeUsuario = profile.nome ?? emailUsuario

    // 4) Carrega lista de admins que recebem notificação de prazo expirado
    const { data: destinatarios } = await supabaseAdmin
      .from('admin_notificacoes')
      .select('email, nome')
      .eq('notif_prazo_expirado', true)

    if (!destinatarios || destinatarios.length === 0) {
      return NextResponse.json({
        ok: true,
        avisado: false,
        razao: 'Nenhum email cadastrado pra receber notificação de prazo expirado',
      })
    }

    // 5) Calcula data de expiração (pra mostrar no email)
    let dataExpiracaoLegivel = 'não disponível'
    if (
      profile.prazo_tipo &&
      profile.prazo_tipo !== 'indeterminado' &&
      profile.prazo_quantidade &&
      profile.prazo_inicio
    ) {
      const inicio = new Date(profile.prazo_inicio)
      const expira = new Date(inicio)
      if (profile.prazo_tipo === 'dias') expira.setDate(expira.getDate() + profile.prazo_quantidade)
      else if (profile.prazo_tipo === 'meses') expira.setMonth(expira.getMonth() + profile.prazo_quantidade)
      else if (profile.prazo_tipo === 'anos') expira.setFullYear(expira.getFullYear() + profile.prazo_quantidade)
      dataExpiracaoLegivel = expira.toLocaleDateString('pt-BR')
    }

    // 6) Monta o email
    const html = templateNotificacaoAdmin({
      titulo: '⚠ Prazo de uso expirado',
      preheader: `${nomeUsuario} (${emailUsuario}) teve o acesso à plataforma bloqueado.`,
      blocos: [
        { label: 'Usuário', valor: nomeUsuario },
        { label: 'Email', valor: emailUsuario },
        { label: 'Prazo configurado', valor: `${profile.prazo_quantidade ?? '—'} ${profile.prazo_tipo ?? '—'}` },
        { label: 'Data de expiração', valor: dataExpiracaoLegivel },
        { label: 'Detectado em', valor: new Date().toLocaleString('pt-BR') },
      ],
      acao: {
        texto: 'Renovar acesso no painel',
        url: 'https://matematico.com.br/admin/contratantes',
      },
    })

    // 7) Envia
    const resultado = await enviarEmail({
      para: destinatarios.map((d) => ({ email: d.email, nome: d.nome ?? undefined })),
      assunto: `⚠ Prazo expirado — ${nomeUsuario}`,
      html,
    })

    // 8) Marca como notificado (mesmo se falhou — evita spam de retry)
    await supabaseAdmin
      .from('profiles')
      .update({ prazo_notificado_em: new Date().toISOString() })
      .eq('id', userId)

    return NextResponse.json({
      ok: true,
      enviado: resultado.enviado,
      destinatarios: destinatarios.length,
      erro: resultado.erro,
    })
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'erro desconhecido'
    console.error('[notify/prazo-expirado]', msg)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
