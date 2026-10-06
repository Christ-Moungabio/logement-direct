import { redirect } from "next/navigation";
import AuthLayout from "../../../src/features/auth/components/AuthLayout";
import SignupForm from "../../../src/features/auth/components/SignupForm";
import { destinationForRole, safeNextPath } from "../../../src/features/auth/navigation";
import { getCurrentProfile } from "../../../src/features/auth/queries";

export const metadata = {
  title: "Créer un compte",
  description:
    "Créez votre compte Ndako pour contacter les propriétaires ou publier vos annonces de logement à Brazzaville.",
};

const ROLE_PARAMS = { locataire: "tenant", proprietaire: "owner" };

export default async function InscriptionPage({ searchParams }) {
  const { role, next } = await searchParams;
  const safeNext = safeNextPath(next);

  const profile = await getCurrentProfile();
  if (profile) redirect(destinationForRole(safeNext, profile.role));

  return (
    <AuthLayout
      title="Créer un compte"
      intro="C'est gratuit. Choisissez votre profil, puis renseignez vos informations."
    >
      <SignupForm initialRole={ROLE_PARAMS[role] ?? ""} next={safeNext} />
    </AuthLayout>
  );
}
