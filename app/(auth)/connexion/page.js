import { redirect } from "next/navigation";
import AuthLayout from "../../../src/features/auth/components/AuthLayout";
import LoginForm from "../../../src/features/auth/components/LoginForm";
import { homeForRole, safeNextPath } from "../../../src/features/auth/navigation";
import { getCurrentProfile } from "../../../src/features/auth/queries";

export const metadata = {
  title: "Connexion",
  description: "Connectez-vous à Ndako pour contacter les propriétaires ou gérer vos annonces.",
};

export default async function ConnexionPage({ searchParams }) {
  const { next } = await searchParams;
  const safeNext = safeNextPath(next);

  const profile = await getCurrentProfile();
  if (profile) redirect(safeNext ?? homeForRole(profile.role));

  return (
    <AuthLayout
      title="Connexion"
      intro="Connectez-vous pour voir le numéro des propriétaires ou gérer vos annonces."
    >
      <LoginForm next={safeNext} />
    </AuthLayout>
  );
}
