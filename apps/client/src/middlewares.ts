import { NextRequest, NextResponse } from 'next/server'

export async function middleware(request: NextRequest) {
  const url = request.nextUrl.clone()

  const response = NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon\\.ico|verification|logout|site\\.webmanifest|android-chrome-192x192\\.png|android-chrome-512x512\\.png).*)',
  ],
}
