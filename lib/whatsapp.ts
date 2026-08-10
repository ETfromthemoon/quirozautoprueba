export const WHATSAPP_CONTACTS = {
  marco: { name: "Marco", number: "56959065441", displayNumber: "+56 9 5906 5441" },
  daniel: { name: "Daniel", number: "56993431571", displayNumber: "+56 9 9343 1571" },
} as const;

export type WhatsAppContact = keyof typeof WHATSAPP_CONTACTS;

export const WHATSAPP_NUMBER = WHATSAPP_CONTACTS.marco.number;

export function getWhatsAppUrl(message: string, contact: WhatsAppContact = "marco"): string {
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${WHATSAPP_CONTACTS[contact].number}?text=${encoded}`;
}

/**
 * Formato corto de precio para pills/chips mobile.
 * "$40.980.000" → "$40,98M"
 * "$15.870.000" → "$15,87M"
 */
export function formatPriceShort(price: string): string {
  const num = parseInt(price.replace(/[^\d]/g, ""), 10);
  if (Number.isNaN(num)) return price;
  if (num >= 1_000_000) {
    const millions = num / 1_000_000;
    return `$${millions.toFixed(2).replace(".", ",")}M`;
  }
  if (num >= 1_000) {
    const thousands = num / 1_000;
    return `$${thousands.toFixed(0)}K`;
  }
  return price;
}
