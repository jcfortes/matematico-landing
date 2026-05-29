import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const codigo = searchParams.get('codigo')
  const dataInicial = searchParams.get('dataInicial')
  const dataFinal = searchParams.get('dataFinal')

  if (!codigo || !dataInicial || !dataFinal) {
    return NextResponse.json({ error: 'Parâmetros inválidos' }, { status: 400 })
  }

  const url = `https://api.bcb.gov.br/dados/serie/bcdata.sgs.${codigo}/dados?formato=json&dataInicial=${dataInicial}&dataFinal=${dataFinal}`

  const res = await fetch(url)
  if (!res.ok) {
    return NextResponse.json({ error: 'Erro ao buscar dados do Banco Central' }, { status: res.status })
  }

  const dados = await res.json()
  return NextResponse.json(dados)
}
