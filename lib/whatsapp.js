export function formatPhoneNumber(number) {
  const match = /^\+242(\d{2})(\d{3})(\d{2})(\d{2})$/.exec(number);
  if (!match) return number;
  return `+242 ${match.slice(1).join(" ")}`;
}

export function buildWhatsAppLink(number, message) {
  const digits = number.replace(/\D/g, "");
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

export function buildTelLink(number) {
  return `tel:${number}`;
}
