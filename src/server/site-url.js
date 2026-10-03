import "server-only";

import { headers } from "next/headers";

/**
 * URL publique du site, pour les liens partagés (message WhatsApp).
 * NEXT_PUBLIC_SITE_URL est prioritaire ; sinon on reprend l'hôte de la requête.
 *
 * @returns {Promise<string>}
 */
export async function getSiteUrl() {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  }

  const headerList = await headers();
  const host = headerList.get("x-forwarded-host") ?? headerList.get("host");
  const protocol =
    headerList.get("x-forwarded-proto") ??
    (host?.startsWith("localhost") ? "http" : "https");

  return `${protocol}://${host}`;
}
