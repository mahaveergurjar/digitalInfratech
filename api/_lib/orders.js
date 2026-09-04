export function createOrderNumber() {
  const date = new Date();
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `DIT-${y}${m}${d}-${rand}`;
}

export function validateOrderBody(body) {
  const errors = [];

  if (!body?.customer?.name?.trim()) errors.push('Name is required');
  if (!body?.customer?.email?.trim()) errors.push('Valid email is required');
  if (!body?.customer?.phone?.trim()) errors.push('Phone is required');
  if (!body?.address?.trim()) errors.push('Address is required');
  if (!Array.isArray(body?.items) || body.items.length === 0) errors.push('Cart is empty');

  const email = body?.customer?.email?.trim() || '';
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push('Valid email is required');
  }

  const phone = body?.customer?.phone?.trim() || '';
  if (phone && !/^[6-9]\d{9}$/.test(phone.replace(/\D/g, '').slice(-10))) {
    errors.push('Enter a valid 10-digit Indian mobile number');
  }

  return errors;
}
