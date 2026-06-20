import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getInternalPath } from "./lib/i18n/routes";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Resolve public path to internal route segment structure
  const internalPath = getInternalPath(pathname);

  // Perform rewrite silently to avoid changing browser URL
  const url = request.nextUrl.clone();
  url.pathname = internalPath;

  return NextResponse.rewrite(url);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - studio (Sanity Studio embedded route)
     * - favicon.ico, robots.txt, sitemap.xml
     * - Static assets with file extensions (e.g. logo.png, document.pdf)
     */
    "/((?!api|_next/static|_next/image|studio|favicon\\.ico|robots\\.txt|sitemap\\.xml|.*\\.[\\w]+$).*)",
  ],
};
