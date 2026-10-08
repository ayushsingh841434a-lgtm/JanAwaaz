import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSessionFromRequest } from "./lib/auth";

// Pages that require login (client components also guard, this is defense-in-depth)
const PROTECTED_PAGES = ["/dashboard", "/authority"];

const PUBLIC_API_PREFIXES = ["/api/auth/"];

// Public GET endpoints (browsing reports, issues, rights, stats, maps and locations)
const PUBLIC_API_GET = [
  "/api/reports",
  "/api/issues",
  "/api/rights",
  "/api/stats",
  "/api/map",
  "/api/locations",
  "/api/search",
];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isApi = pathname.startsWith("/api/");

  const isProtectedPage = PROTECTED_PAGES.some(
    (p) => pathname === p || pathname.startsWith(p + "/")
  );
  if (!isApi && !isProtectedPage) return NextResponse.next();

  if (isApi) {
    if (PUBLIC_API_PREFIXES.some((p) => pathname.startsWith(p))) return NextResponse.next();
    if (request.method === "POST" && pathname === "/api/ai/chat") return NextResponse.next();
    if (request.method === "POST" && pathname === "/api/ai/draft") return NextResponse.next();
    if (request.method === "GET" && PUBLIC_API_GET.some((p) => pathname === p || pathname.startsWith(p + "/"))) {
      return NextResponse.next();
    }
  }

  const session = await getSessionFromRequest(request);
  if (!session) {
    if (isApi) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Role gate for the authority console
  if (pathname.startsWith("/authority") && session.role !== "AUTHORITY" && session.role !== "ADMIN") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/authority/:path*", "/api/:path*"],
};
