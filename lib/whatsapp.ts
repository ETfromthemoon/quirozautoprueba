export const WHATSAPP_NUMBER = "56959065441";

export function getWhatsAppUrl(message: string): string {
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`;
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
