import { money } from '../data/mockData';
import { brand } from '../data/siteContent';

export function normalizePhone(phone) {
  const digits = String(phone || '').replace(/\D/g, '');
  if (digits.length === 10) return `91${digits}`;
  if (digits.length === 12 && digits.startsWith('91')) return digits;
  return digits;
}

export function buildWhatsAppOrderMessage(order, cartSnapshot) {
  const lines = [
    `Hi ${brand.shortName}, maine order place kiya hai.`,
    '',
    `Order ID: ${order.orderNumber}`,
    `Name: ${order.customerName}`,
    `Mobile: ${order.customerPhone}`,
    `Address: ${order.customerAddress}`,
    '',
    'Items:',
    ...cartSnapshot.map((item) => `- ${item.name} x${item.qty} — ${money.format(item.price * item.qty)}`),
    '',
    `Total: ${money.format(order.total)}`,
    'Payment: Pay on delivery',
  ];

  return lines.join('\n');
}

export function getWhatsAppUrl(message, businessPhone) {
  const encoded = encodeURIComponent(message);
  const shopNumber = normalizePhone(businessPhone || brand.whatsapp);

  if (shopNumber) {
    return `https://wa.me/${shopNumber}?text=${encoded}`;
  }

  return `https://wa.me/?text=${encoded}`;
}
