import { redirect } from "next/navigation";
import AuthLayout from "../../../src/features/auth/components/AuthLayout";
import LoginForm from "../../../src/features/auth/components/LoginForm";
import { destinationForRole, safeNextPath } from "../../../src/features/auth/navigation";
import { getCurrentProfile } from "../../../src/features/auth/queries";

export const metadata = {
  title: "Connexion",
  description: "Connectez-vous à Ndako pour contacter les propriétaires ou gérer vos annonces.",
};

const ACCOUNT_CREATED = "Votre compte est créé. Connectez-vous pour continuer.";

export default async function ConnexionPage({ searchParams }) {
  const { next, compte } = await searchParams;
  const safeNext = safeNextPath(next);

  const profile = await getCurrentProfile();
  if (profile) redirect(destinationForRole(safeNext, profile.role));

  return (
    <AuthLayout
      title="Connexion"
      intro="Connectez-vous pour voir le numéro des propriétaires ou gérer vos annonces."
    >
      <LoginForm next={safeNext} notice={compte === "cree" ? ACCOUNT_CREATED : null} />
    </AuthLayout>
  );
}
