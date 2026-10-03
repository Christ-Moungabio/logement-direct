import Link from "next/link";
import { Lock, MessageCircle, Phone, UserRound } from "lucide-react";
import Button from "../../../../components/ui/Button";
import { formatPrice } from "../../../../lib/format";
import { buildTelLink, buildWhatsAppLink, formatPhoneNumber } from "../../../../lib/whatsapp";
import { loginPath } from "../../auth/navigation";
import styles from "./ListingContact.module.css";

// Contact du propriétaire (EF-FIC-05, RG-13). Pour un visiteur, `contact` vaut
// toujours null : le numéro n'est jamais lu côté serveur pour lui.
export function ContactCard({ relation, contact, whatsappMessage, returnTo }) {
  if (relation === "guest") {
    return (
      <Card Icon={Lock}>
        <p className={styles.text}>
          Connectez-vous pour voir le numéro du propriétaire et le contacter par WhatsApp ou par appel.
        </p>
        <Button href={loginPath(returnTo)} variant="secondary" size="lg" fullWidth>
          Se connecter
        </Button>
        <p className={styles.signup}>
          Pas de compte ? <Link href="/inscription">Créer un compte</Link>
        </p>
      </Card>
    );
  }

  if (relation === "owner") {
    return (
      <Card Icon={UserRound} title="Votre annonce">
        <p className={styles.text}>
          Vous consultez votre propre annonce. Les utilisateurs connectés voient ici les boutons pour vous
          contacter par WhatsApp ou par appel.
        </p>
      </Card>
    );
  }

  if (!contact) {
    return (
      <Card Icon={UserRound}>
        <p className={styles.text}>
          Les coordonnées du propriétaire sont momentanément indisponibles. Actualisez la page dans quelques
          instants.
        </p>
      </Card>
    );
  }

  return (
    <Card Icon={UserRound}>
      <div>
        <p className={styles.owner}>{contact.ownerName}</p>
        <p className={`${styles.text} tabular`}>{formatPhoneNumber(contact.whatsappNumber)}</p>
      </div>
      <ContactButtons contact={contact} whatsappMessage={whatsappMessage} />
    </Card>
  );
}

function ContactButtons({ contact, whatsappMessage, compact = false }) {
  return (
    <div className={compact ? styles.buttonsCompact : styles.buttons}>
      <Button
        href={buildWhatsAppLink(contact.whatsappNumber, whatsappMessage)}
        target="_blank"
        rel="noopener noreferrer"
        size="lg"
        fullWidth
        className={styles.whatsapp}
      >
        <MessageCircle size={18} aria-hidden="true" />
        WhatsApp
        <span className="visually-hidden"> (ouvre WhatsApp dans un nouvel onglet)</span>
      </Button>
      <Button href={buildTelLink(contact.whatsappNumber)} variant="secondary" size="lg" fullWidth>
        <Phone size={18} aria-hidden="true" />
        Appeler
      </Button>
    </div>
  );
}

// Barre fixée en bas de l'écran sur mobile, pour garder le contact accessible (ENF-01).
export function MobileContactBar({ relation, contact, whatsappMessage, returnTo, monthlyRent }) {
  if (relation === "owner") return null;
  if (relation !== "guest" && !contact) return null;

  return (
    <div className={styles.bar}>
      <p className={styles.barPrice}>
        <strong className="tabular">{formatPrice(monthlyRent)}</strong>
        <span>par mois</span>
      </p>
      <div className={styles.barActions}>
        {relation === "guest" ? (
          <Button href={loginPath(returnTo)} size="lg" fullWidth>
            Se connecter pour contacter
          </Button>
        ) : (
          <ContactButtons contact={contact} whatsappMessage={whatsappMessage} compact />
        )}
      </div>
    </div>
  );
}

function Card({ Icon, title = "Contact du propriétaire", children }) {
  return (
    <section className={styles.card} aria-labelledby="contact-titre">
      <h2 id="contact-titre" className={`text-heading-md ${styles.title}`}>
        <Icon size={20} aria-hidden="true" />
        {title}
      </h2>
      {children}
    </section>
  );
}
