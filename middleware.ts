import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const currentUser = request.cookies.get('currentUser')?.value
  const isAdmin = request.cookies.get('isAdmin')?.value === 'true'

  // allow access to the login and register pages without authentication
  if (!currentUser && (request.nextUrl.pathname.startsWith('/login') || request.nextUrl.pathname.startsWith('/register'))) {
    return NextResponse.next()
  }

  // redirect unauthenticated users to the login page
  if (!currentUser) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // redirect authenticated users away from the login and register pages
  if (currentUser && (request.nextUrl.pathname.startsWith('/login') || request.nextUrl.pathname.startsWith('/register'))) {
    return NextResponse.redirect(new URL('/input', request.url))
  }

  // restrict access to the admin panel to admin users only
  if (request.nextUrl.pathname.startsWith('/admin') && !isAdmin) {
    return NextResponse.redirect(new URL('/input', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}