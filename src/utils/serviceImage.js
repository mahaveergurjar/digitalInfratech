import { HERO_IMAGES, SERVICE_CATEGORY_HERO_IMAGES } from '../data/heroImages';

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

/** Admin URL, else category stock photo, else site default. */
export function resolveServiceImage(service) {
  return getServiceImageUrl(service?.image) || getCategoryServiceImage(service?.category);
}

/** Ordered list for img onError fallback (broken external URLs). */
export function getServiceImageFallbacks(service) {
  const list = [];
  const custom = getServiceImageUrl(service?.image);
  if (custom) list.push(custom);
  const category = getCategoryServiceImage(service?.category);
  if (!list.includes(category)) list.push(category);
  return list;
}

export function hasServiceImage(service) {
  return Boolean(getServiceImageUrl(service?.image));
}
