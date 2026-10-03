import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";

/**
 * Rafraîchit la session Supabase à chaque requête et réécrit les cookies.
 * Les Server Components ne peuvent pas écrire de cookies : c'est le rôle du proxy.
 *
 * @param {import("next/server").NextRequest} request
 */
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
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // Ne rien exécuter entre la création du client et cet appel :
  // il valide le jeton et le renouvelle s'il a expiré.
  await supabase.auth.getClaims();

  return response;
}
