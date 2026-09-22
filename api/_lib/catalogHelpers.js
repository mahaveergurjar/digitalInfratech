import { resolveProductImage } from './productImages.js';

export function toClientItem(doc, index = 0) {
  const item = doc.toObject ? doc.toObject() : doc;
  const clientItem = {
    id: item.itemId,
    type: item.type,
    name: item.name,
    summary: item.summary || '',
    pack: item.pack || '',
    category: item.category,
    price: item.price,
    originalPrice: item.originalPrice || 0,
    image: item.image || '',
    emoji: item.emoji || '🛠️',
    active: item.active !== false,
  };

  if (clientItem.type === 'product') {
    clientItem.image = resolveProductImage({ ...clientItem, itemId: item.itemId }, index);
  }

  return clientItem;
}

export function validateCatalogBody(body, type) {
  const errors = [];

  if (!body.name?.trim()) errors.push('Name is required');
  if (!body.category?.trim()) errors.push('Category is required');
  if (body.price === undefined || body.price === '' || Number(body.price) < 0) {
    errors.push('Valid price is required');
  }

  if (type === 'product' && !body.pack?.trim()) {
    errors.push('Pack size is required for products');
  }

  if (type === 'service' && !body.summary?.trim()) {
    errors.push('Summary is required for services');
  }

  if (errors.length) {
    const error = new Error(errors.join(', '));
    error.status = 400;
    throw error;
  }

  const itemId =
    body.itemId?.trim() ||
    `${type}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

  const price = Number(body.price);
  let originalPrice = Number(body.originalPrice) || 0;
  const discount = Math.min(99, Math.max(0, Number(body.discount) || 0));

  if (discount > 0 && price > 0) {
    originalPrice = Math.round(price / (1 - discount / 100));
  } else if (!originalPrice || originalPrice < price) {
    originalPrice = price;
  }

  return {
    itemId,
    type,
    name: body.name.trim(),
    summary: body.summary?.trim() || '',
    pack: body.pack?.trim() || '',
    category: body.category.trim(),
    price,
    originalPrice,
    image: body.image?.trim() || '',
    emoji: body.emoji?.trim() || '🛠️',
    active: body.active !== false,
  };
}
