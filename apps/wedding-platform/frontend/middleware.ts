import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || ''
  const PLATFORM_DOMAIN = process.env.NEXT_PUBLIC_PLATFORM_DOMAIN || 'localhost:3000'
  const pathname = request.nextUrl.pathname

  // If it's the main platform domain, www subdomain, or dashboard subdomain — serve normally
  if (
    hostname === PLATFORM_DOMAIN ||
    hostname.startsWith('www.') ||
    hostname.startsWith('dashboard.')
  ) {
    return NextResponse.next()
  }

  // Extract subdomain by removing the platform domain
  const subdomain = hostname.replace(`.${PLATFORM_DOMAIN}`, '')

  // If subdomain is empty or equals the full hostname (no subdomain found), serve normally
  if (!subdomain || subdomain === hostname) {
    return NextResponse.next()
  }

  // Rewrite: joaoemaria.platform.com/rsvp → /wedding/joaoemaria/rsvp
  const rewriteUrl = request.nextUrl.clone()
  rewriteUrl.pathname = `/wedding/${subdomain}${pathname}`

  return NextResponse.rewrite(rewriteUrl)
}

export const config = {
  matcher: ['/((?!_next|favicon.ico|api).*)'],
}
