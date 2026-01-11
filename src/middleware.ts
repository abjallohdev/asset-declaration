import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
 
export function middleware(request: NextRequest) {
  // Check if we are accessing a protected route
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    // Check for the session cookie
    const hasSession = request.cookies.has('ads_session_token')
    
    if (!hasSession) {
      // Redirect to login if no session
      const loginUrl = new URL('/login', request.url)
      // Optional: Add return URL for better UX
      loginUrl.searchParams.set('from', request.nextUrl.pathname)
      return NextResponse.redirect(loginUrl)
    }
  }
 
  return NextResponse.next()
}
 
export const config = {
  matcher: [
    // Match all dashboard routes
    '/dashboard/:path*',
  ],
}
