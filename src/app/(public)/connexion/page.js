import { redirect } from "next/navigation";

import { SignInForm } from "@/features/auth/components/sign-in-form";
import { safeRedirectPath } from "@/lib/navigation";
import { getCurrentUser } from "@/server/auth";

export const metadata = { title: "Connexion" };

// Page PROVISOIRE, en attendant le module AUTH.
export default async function SignInPage({ searchParams }) {
  const { redirect: redirectParam } = await searchParams;
  const redirectTo = safeRedirectPath(redirectParam);

  if (await getCurrentUser()) redirect(redirectTo);

  return (
    <div className="mx-auto w-full max-w-sm px-4 py-12 sm:py-16">
      <h1 className="text-2xl font-semibold tracking-tight">Connexion</h1>
      <p className="mt-2 mb-8 text-muted-foreground">
        Connectez-vous pour contacter les propriétaires.
      </p>
      <SignInForm redirectTo={redirectTo} />
    </div>
  );
}
