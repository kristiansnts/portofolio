import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifySessionToken } from '@/lib/auth-session'

export async function proxy(request: NextRequest) {
  const session = await verifySessionToken(
    request.cookies.get('session')?.value,
  )
  const { pathname } = request.nextUrl

  if (pathname.startsWith('/dashboard') && !session) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('from', pathname)
    return NextResponse.redirect(loginUrl)
  }

  if (pathname === '/login' && session) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const proxyConfig = {
  matcher: ['/dashboard/:path*', '/login'],
}
