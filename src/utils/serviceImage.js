import { HERO_IMAGES, SERVICE_CATEGORY_HERO_IMAGES } from '../data/heroImages';
import { getServiceStockImage } from '../data/serviceStockImages.js';

/** Normalize image URLs pasted in admin (https missing, protocol-relative, etc.). */
export function getServiceImageUrl(image) {
  if (image == null) return '';
  const trimmed = String(image).trim();
  if (!trimmed) return '';
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  if (trimmed.startsWith('//')) return `https:${trimmed}`;
  if (trimmed.startsWith('/')) return trimmed;
  return `https://${trimmed}`;
}

export function getCategoryServiceImage(categoryId) {
  if (categoryId && SERVICE_CATEGORY_HERO_IMAGES[categoryId]) {
    return SERVICE_CATEGORY_HERO_IMAGES[categoryId];
  }
  return HERO_IMAGES.services;
}

function getBuiltInServiceImage(service) {
  const id = service?.id || service?.itemId;
  return getServiceStockImage(id) || getCategoryServiceImage(service?.category);
}

/** Admin URL, else per-service stock photo, else category hero. */
export function resolveServiceImage(service) {
  return getServiceImageUrl(service?.image) || getBuiltInServiceImage(service);
}

/** Ordered list for img onError fallback (broken external URLs). */
export function getServiceImageFallbacks(service) {
  const list = [];
  const custom = getServiceImageUrl(service?.image);
  if (custom) list.push(custom);
  const stock = getServiceStockImage(service?.id || service?.itemId);
  if (stock && !list.includes(stock)) list.push(stock);
  const category = getCategoryServiceImage(service?.category);
  if (!list.includes(category)) list.push(category);
  if (!list.includes(HERO_IMAGES.services)) list.push(HERO_IMAGES.services);
  return list;
}

export function hasServiceImage(service) {
  return Boolean(getServiceImageUrl(service?.image));
}
