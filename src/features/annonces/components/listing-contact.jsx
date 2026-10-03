import { Lock, MessageCircle, Phone, UserRound } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { loginUrl, signupUrl } from "@/lib/navigation";
import {
  buildTelLink,
  buildWhatsAppLink,
  formatPhoneNumber,
} from "@/lib/phone";

/**
 * @typedef {object} ContactProps
 * @property {import("../types").ViewerRelation} relation
 * @property {import("../types").ListingContact | null} contact
 *   Toujours `null` pour un visiteur : le numéro n'est jamais lu pour lui.
 * @property {string} whatsappMessage Message pré-rempli.
 * @property {string} returnTo Chemin de la fiche, pour revenir après connexion.
 */

/**
 * Bloc « Contact du propriétaire » (EF-FIC-05, RG-13).
 * @param {ContactProps} props
 */
export function ContactCard({ relation, contact, whatsappMessage, returnTo }) {
  if (relation === "guest") {
    return (
      <ContactCardFrame icon={Lock}>
        <p className="text-muted-foreground">
          Connectez-vous pour voir le numéro du propriétaire et le contacter par
          WhatsApp ou par appel.
        </p>
        <Button asChild variant="outline" className="w-full">
          <Link href={loginUrl(returnTo)}>Se connecter</Link>
        </Button>
        <p className="text-center text-sm text-muted-foreground">
          Pas de compte ?{" "}
          <Link
            href={signupUrl(returnTo)}
            className="font-semibold text-primary underline underline-offset-4"
          >
            Créer un compte
          </Link>
        </p>
      </ContactCardFrame>
    );
  }

  if (relation === "owner") {
    return (
      <ContactCardFrame icon={UserRound} title="Votre annonce">
        <p className="text-muted-foreground">
          Vous consultez votre propre annonce. Les utilisateurs connectés voient
          ici les boutons pour vous contacter par WhatsApp ou par appel.
        </p>
      </ContactCardFrame>
    );
  }

  if (!contact) {
    return (
      <ContactCardFrame icon={UserRound}>
        <p className="text-muted-foreground">
          Les coordonnées du propriétaire sont momentanément indisponibles.
          Actualisez la page dans quelques instants.
        </p>
      </ContactCardFrame>
    );
  }

  return (
    <ContactCardFrame icon={UserRound}>
      <div>
        <p className="font-semibold">{contact.ownerName}</p>
        <p className="text-muted-foreground">
          {formatPhoneNumber(contact.whatsappNumber)}
        </p>
      </div>
      <ContactButtons contact={contact} whatsappMessage={whatsappMessage} />
    </ContactCardFrame>
  );
}

/**
 * Boutons WhatsApp et Appel, partagés par le bloc et la barre mobile.
 * @param {{ contact: import("../types").ListingContact, whatsappMessage: string, compact?: boolean }} props
 */
export function ContactButtons({ contact, whatsappMessage, compact = false }) {
  return (
    <div className={compact ? "grid grid-cols-2 gap-2" : "grid gap-2"}>
      <Button asChild variant="whatsapp" className="w-full">
        <a
          href={buildWhatsAppLink(contact.whatsappNumber, whatsappMessage)}
          target="_blank"
          rel="noopener noreferrer"
        >
          <MessageCircle aria-hidden="true" />
          WhatsApp
          <span className="sr-only">
            {" "}
            (ouvre WhatsApp dans un nouvel onglet)
          </span>
        </a>
      </Button>
      <Button asChild variant="outline" className="w-full">
        <a href={buildTelLink(contact.whatsappNumber)}>
          <Phone aria-hidden="true" />
          Appeler
        </a>
      </Button>
    </div>
  );
}

/**
 * Barre de contact fixée en bas de l'écran sur mobile (ENF-01).
 * @param {ContactProps & { priceLabel: string }} props
 */
export function MobileContactBar({
  relation,
  contact,
  whatsappMessage,
  returnTo,
  priceLabel,
}) {
  if (relation === "owner") return null;
  if (relation !== "guest" && !contact) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t bg-background/95 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-[0_-4px_16px_rgba(0,0,0,0.06)] backdrop-blur lg:hidden">
      <div className="mx-auto flex max-w-page items-center gap-3">
        <p className="min-w-0 shrink-0 text-sm leading-tight">
          <span className="block font-semibold">{priceLabel}</span>
          <span className="text-muted-foreground">par mois</span>
        </p>
        <div className="min-w-0 flex-1">
          {relation === "guest" ? (
            <Button asChild className="w-full">
              <Link href={loginUrl(returnTo)}>Se connecter pour contacter</Link>
            </Button>
          ) : (
            <ContactButtons
              contact={contact}
              whatsappMessage={whatsappMessage}
              compact
            />
          )}
        </div>
      </div>
    </div>
  );
}

function ContactCardFrame({
  icon: Icon,
  title = "Contact du propriétaire",
  children,
}) {
  return (
    <section
      aria-labelledby="contact-title"
      className="flex flex-col gap-4 rounded-xl border p-5 sm:p-6"
    >
      <h2
        id="contact-title"
        className="flex items-center gap-2 text-lg font-semibold"
      >
        <Icon className="size-5 shrink-0" aria-hidden="true" />
        {title}
      </h2>
      {children}
    </section>
  );
}
