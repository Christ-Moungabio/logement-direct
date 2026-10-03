import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";

// Rafraîchit le jeton de session avant le rendu : les Server Components
// ne peuvent pas écrire de cookies, c'est donc ici que le jeton est renouvelé.
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

  // Aucun code entre la création du client et cet appel : sinon la session
  // peut ne pas être rafraîchie et l'utilisateur se retrouve déconnecté.
  await supabase.auth.getClaims();

  return response;
}
