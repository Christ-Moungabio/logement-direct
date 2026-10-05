import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import {
  ACTIVITY_COOKIE,
  ACTIVITY_COOKIE_OPTIONS,
  isIdleExpired,
} from "../../features/auth/session";

export async function updateSession(request) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet, headers) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
          Object.entries(headers).forEach(([key, value]) => response.headers.set(key, value));
        },
      },
    },
  );

  const { data } = await supabase.auth.getClaims();
  let claims = data?.claims ?? null;

  if (claims) {
    if (isIdleExpired(request.cookies.get(ACTIVITY_COOKIE)?.value)) {
      await supabase.auth.signOut({ scope: "local" });
      claims = null;
      response.cookies.delete(ACTIVITY_COOKIE);
    } else {
      response.cookies.set(ACTIVITY_COOKIE, String(Date.now()), ACTIVITY_COOKIE_OPTIONS);
    }
  }

  return { response, claims };
}
