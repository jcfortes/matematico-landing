import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Rotas públicas do admin (sem token)
  if (pathname === '/admin') return NextResponse.next()
  if (pathname === '/api/admin/login') return NextResponse.next()
  if (pathname === '/api/admin/logout') return NextResponse.next()

  const token = request.cookies.get('admin_token')?.value

  if (!token) {
    if (pathname.startsWith('/api/admin')) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }
    return NextResponse.redirect(new URL('/admin', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path+', '/api/admin/:path*'],
}
