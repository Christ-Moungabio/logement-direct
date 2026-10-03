import LegalPage from "../../components/LegalPage";

export const metadata = {
  title: "Conditions d'utilisation",
  description:
    "Les règles d'utilisation de Ndako : comptes, publication des annonces, signalement, contact des propriétaires et paiements hors plateforme.",
};

// Texte à faire valider par le PM (ticket #6). Règles reprises du cadrage :
// RG-01, RG-02, RG-04, RG-05, RG-11, RG-13, RG-14, RG-20, RG-21.
const SECTIONS = [
  {
    id: "service",
    title: "Ce que fait Ndako",
    paragraphs: [
      "Ndako publie des annonces de logements à louer à Brazzaville. Les propriétaires y déposent eux-mêmes leurs annonces. Les personnes qui cherchent un logement les consultent, puis contactent le propriétaire sans passer par un démarcheur.",
      "Ndako ne loue aucun logement et ne signe aucun contrat de location. L'accord se fait entre le propriétaire et le locataire.",
    ],
  },
  {
    id: "compte",
    title: "Votre compte",
    items: [
      "Vous vous connectez avec votre adresse e-mail et votre mot de passe. Une adresse e-mail et un numéro WhatsApp ne peuvent servir qu'à un seul compte.",
      "À l'inscription, vous choisissez votre profil : vous cherchez un logement (locataire) ou vous en proposez un (propriétaire).",
      "Votre mot de passe compte au moins 8 caractères. Gardez-le pour vous : les actions faites avec votre compte vous sont attribuées.",
      "Les comptes d'administration sont créés par l'équipe Ndako. L'inscription ne permet pas d'en obtenir un.",
    ],
  },
  {
    id: "annonces",
    title: "Publier une annonce",
    paragraphs: ["Si vous êtes propriétaire :"],
    items: [
      "vous publiez votre annonce vous-même, sans validation préalable de l'équipe. Elle devient visible des locataires 5 minutes après votre clic sur « Publier » ;",
      "vous décrivez un logement réel que vous avez le droit de louer, avec 1 à 8 photos de ce logement ;",
      "vous tenez à jour le loyer, l'avance demandée et la disponibilité ;",
      "vous fermez l'annonce dès que le logement est loué ou retiré de la location.",
    ],
  },
  {
    id: "moderation",
    title: "Signalement et modération",
    paragraphs: [
      "Les annonces ne sont pas vérifiées avant leur mise en ligne. Tout utilisateur connecté peut donc signaler depuis sa fiche une annonce fausse, déjà louée ou suspecte d'arnaque.",
      "L'équipe Ndako examine chaque signalement. Elle peut masquer une annonce en indiquant le motif : le propriétaire voit ce motif dans son espace, mais ne peut pas republier l'annonce lui-même. En cas d'abus, l'équipe peut aussi suspendre un compte.",
    ],
  },
  {
    id: "contact",
    title: "Contacter un propriétaire",
    paragraphs: [
      "Le numéro du propriétaire s'affiche seulement pour les utilisateurs connectés. Vous le joignez par WhatsApp ou par appel pour poser vos questions et organiser la visite.",
    ],
  },
  {
    id: "paiements",
    title: "Loyer, avance et caution",
    paragraphs: [
      "Ndako n'encaisse aucun paiement. Vous réglez la réservation du logement, le loyer, l'avance et la caution avec le propriétaire, en dehors de la plateforme.",
      "Le montant de l'avance affiché sur une annonce vient du propriétaire.",
    ],
  },
  {
    id: "responsabilite",
    title: "Responsabilité",
    paragraphs: [
      "Chaque propriétaire répond du contenu de ses annonces. Chaque fiche affiche la date de sa dernière mise à jour, pour vous aider à juger si elle est encore à jour. Ndako ne garantit pas l'exactitude des annonces et ne participe pas aux accords entre propriétaires et locataires.",
    ],
  },
  {
    id: "evolution",
    title: "Évolution de ces conditions",
    paragraphs: [
      "Ces conditions évolueront avec le service. La date affichée en haut de cette page indique la version en vigueur.",
    ],
  },
];

export default function ConditionsPage() {
  return (
    <LegalPage
      title="Conditions d'utilisation"
      updatedAt="2026-10-02"
      intro="En créant un compte sur Ndako, vous acceptez les règles ci-dessous. Elles valent pour les locataires comme pour les propriétaires."
      sections={SECTIONS}
      related={{ href: "/confidentialite", label: "Confidentialité" }}
    />
  );
}
