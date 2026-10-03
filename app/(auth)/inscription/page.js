import { redirect } from "next/navigation";
import AuthLayout from "../../../src/features/auth/components/AuthLayout";
import SignupForm from "../../../src/features/auth/components/SignupForm";
import { homeForRole } from "../../../src/features/auth/navigation";
import { getCurrentProfile } from "../../../src/features/auth/queries";

export const metadata = {
  title: "Créer un compte",
  description:
    "Créez votre compte Ndako pour contacter les propriétaires ou publier vos annonces de logement à Brazzaville.",
};

// Les liens de l'accueil envoient ?role=locataire ou ?role=proprietaire.
const ROLE_PARAMS = { locataire: "tenant", proprietaire: "owner" };

export default async function InscriptionPage({ searchParams }) {
  const profile = await getCurrentProfile();
  if (profile) redirect(homeForRole(profile.role));

  const { role } = await searchParams;

  return (
    <AuthLayout
      title="Créer un compte"
      intro="C'est gratuit. Choisissez votre profil, puis renseignez vos informations."
    >
      <SignupForm initialRole={ROLE_PARAMS[role] ?? ""} />
    </AuthLayout>
  );
}
