// Supabase Auth n'a que le fournisseur e-mail d'activé : chaque numéro WhatsApp
// est associé à une adresse technique, jamais affichée ni utilisée pour écrire.
// Convention provisoire, à confirmer ou remplacer par le module AUTH.

const AUTH_EMAIL_DOMAIN = "whatsapp.logement-direct.app";

/**
 * @param {string} whatsappNumber Au format +242XXXXXXXXX.
 * @returns {string} Exemple : « 242061234567@whatsapp.logement-direct.app »
 */
export function whatsappToAuthEmail(whatsappNumber) {
  return `${whatsappNumber.replace(/\D/g, "")}@${AUTH_EMAIL_DOMAIN}`;
}
