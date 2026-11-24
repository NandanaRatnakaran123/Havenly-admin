import { NextResponse, type NextRequest } from "next/server";
import { canAccess, isUserRole } from "@/config/access";
import { AUTH_COOKIE_NAME, ROLE_COOKIE_NAME } from "@/lib/auth-constants";

/**
 * Optimistic auth gate only. The backend must enforce permissions on every API call.
 * Unauthenticated users go to /login?next=<path>; signed-in users are bounced off /login
 * and away from sections their role can't use.
 */
export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const hasSession = Boolean(request.cookies.get(AUTH_COOKIE_NAME)?.value);
  const isLogin = pathname === "/login";

  if (!hasSession && !isLogin) {
    const url = new URL("/login", request.url);
    url.searchParams.set("next", `${pathname}${search}`);
    return NextResponse.redirect(url);
  }

  if (hasSession && isLogin) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (hasSession) {
    const role = request.cookies.get(ROLE_COOKIE_NAME)?.value;
    if (isUserRole(role) && !canAccess(pathname, role)) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  // Skip Next internals, API routes and static files.
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
