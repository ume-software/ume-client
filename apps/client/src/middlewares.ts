import { parse } from 'cookie'
import { NextRequest, NextResponse } from 'next/server'

export async function middleware(request: NextRequest) {
  const cookies = parse(request.headers.get('cookie') ?? '')
  const url = request.nextUrl.clone()
  const response = NextResponse.next()
  return response
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon\\.ico|verification|logout|site\\.webmanifest|android-chrome-192x192\\.png|android-chrome-512x512\\.png).*)',
  ],
}
