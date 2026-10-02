import LegalPage from "../../components/LegalPage";

export const metadata = {
  title: "Confidentialité",
  description:
    "Les informations que Ndako vous demande, à quoi elles servent et qui peut les voir. Votre numéro n'est jamais montré aux visiteurs non connectés.",
};

// Texte à faire valider par le PM (ticket #6). Règles reprises du cadrage :
// RG-02, RG-13, ENF-03, ENF-07, et le schéma Supabase (profiles, reports).
const SECTIONS = [
  {
    id: "collecte",
    title: "Les informations que nous demandons",
    paragraphs: ["À l'inscription, Ndako enregistre :"],
    items: [
      "votre nom complet ;",
      "votre numéro WhatsApp, qui sert aussi d'identifiant de connexion ;",
      "votre ville ;",
      "votre adresse e-mail, seulement si vous choisissez de la donner ;",
      "votre mot de passe, jamais en clair : nous n'en gardons qu'une empreinte qui ne permet pas de le retrouver ;",
      "votre profil (locataire ou propriétaire) et la date à laquelle vous avez accepté les conditions d'utilisation.",
    ],
    after: [
      "Si vous êtes propriétaire, nous enregistrons aussi vos annonces et leurs photos. Si vous signalez une annonce, nous gardons le motif et votre commentaire.",
    ],
  },
  {
    id: "usage",
    title: "À quoi elles servent",
    items: [
      "créer votre compte et vous connecter ;",
      "afficher vos annonces si vous êtes propriétaire ;",
      "permettre aux locataires connectés de vous joindre au sujet de vos annonces ;",
      "traiter les signalements et modérer les annonces.",
    ],
    after: ["Nous ne demandons que les informations utiles à ces usages."],
  },
  {
    id: "visibilite",
    title: "Qui voit vos informations",
    items: [
      "Les annonces publiées et leurs photos sont visibles de tous, avec ou sans compte.",
      "Le nom et le numéro d'un propriétaire ne s'affichent jamais aux visiteurs non connectés. Un utilisateur connecté les voit sur les annonces publiées, pour pouvoir le contacter.",
      "Si vous êtes locataire, votre numéro n'apparaît pas sur le site. Le propriétaire le découvre quand vous le contactez par WhatsApp ou par téléphone.",
      "L'équipe d'administration peut consulter les profils pour traiter les signalements. Le propriétaire d'une annonce ne voit pas qui l'a signalée.",
    ],
  },
  {
    id: "hebergement",
    title: "Où elles sont hébergées",
    paragraphs: [
      "Les comptes, les annonces et les photos sont hébergés chez Supabase, le service de base de données et de connexion utilisé par Ndako.",
    ],
  },
  {
    id: "evolution",
    title: "Évolution de cette page",
    paragraphs: [
      "Cette page évoluera avec le service, par exemple à l'arrivée des visites réservées en ligne. La date affichée en haut indique la version en vigueur.",
    ],
  },
];

export default function ConfidentialitePage() {
  return (
    <LegalPage
      title="Confidentialité"
      updatedAt="2026-10-02"
      intro="Cette page explique quelles informations Ndako vous demande, à quoi elles servent et qui peut les voir."
      sections={SECTIONS}
      related={{ href: "/conditions", label: "Conditions d'utilisation" }}
    />
  );
}
