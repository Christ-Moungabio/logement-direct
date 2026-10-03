import { NextResponse } from "next/server";
import { updateSession } from "./src/lib/supabase/proxy";
import { isProtectedPath, loginPath } from "./src/features/auth/navigation";

export async function proxy(request) {
  const { response, claims } = await updateSession(request);
  const { pathname, search } = request.nextUrl;

  if (!claims && isProtectedPath(pathname)) {
    const redirect = NextResponse.redirect(new URL(loginPath(pathname + search), request.url));
    response.cookies.getAll().forEach((cookie) => redirect.cookies.set(cookie));
    return redirect;
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
