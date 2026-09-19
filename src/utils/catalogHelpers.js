import { products, allHomeServices } from '../data/mockData';
import { SERVICE_CATEGORY_META } from '../data/serviceCategoryMeta';
import { resolveProductImage } from '../data/productImages';

const STORAGE_KEY = 'dit-catalog-v12';

export function buildServiceCategories(services) {
  return SERVICE_CATEGORY_META.map((meta) => ({
    ...meta,
    services: services.filter((service) => service.category === meta.id),
  })).filter((cat) => cat.services.length > 0);
}

export function normalizeCatalogItem(item, index = 0) {
  const normalized = {
    id: item.id || item.itemId,
    type: item.type,
    name: item.name,
    summary: item.summary || '',
    pack: item.pack || '',
    category: item.category,
    price: Number(item.price) || 0,
    originalPrice: Number(item.originalPrice) || 0,
    image: item.image || '',
    emoji: item.emoji || '🛠️',
    createdAt: deriveProductCreatedAt(item),
  };

  if (normalized.type === 'product') {
    normalized.image = resolveProductImage(normalized, index);
  }

  return normalized;
}

export function getDefaultCatalog() {
  return {
    products: products.map((item, index) => normalizeCatalogItem(item, index)),
    services: allHomeServices.map((item, index) => normalizeCatalogItem(item, index)),
  };
}

export function mergeWithDefaultCatalog(catalog) {
  const defaults = getDefaultCatalog();
  const productIds = new Set((catalog.products || []).map((item) => item.id || item.itemId));
  const serviceIds = new Set((catalog.services || []).map((item) => item.id || item.itemId));

  const mergedProducts = [
    ...(catalog.products || []).map((item, index) => normalizeCatalogItem(item, index)),
    ...defaults.products.filter((item) => !productIds.has(item.id)),
  ];

  const mergedServices = [
    ...(catalog.services || []).map((item, index) => normalizeCatalogItem(item, index)),
    ...defaults.services.filter((item) => !serviceIds.has(item.id)),
  ];

  return { products: mergedProducts, services: mergedServices };
}

export function loadCatalogFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed?.products || !parsed?.services) return null;
    return {
      products: parsed.products.map((item, index) => normalizeCatalogItem(item, index)),
      services: parsed.services.map((item, index) => normalizeCatalogItem(item, index)),
    };
  } catch {
    return null;
  }
}

export function saveCatalogToStorage(catalog) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(catalog));
}

export function getDiscountPercent(price, originalPrice) {
  if (!originalPrice || originalPrice <= price) return 0;
  return Math.round(((originalPrice - price) / originalPrice) * 100);
}

export function deriveProductCreatedAt(item) {
  if (item?.createdAt) return Number(item.createdAt);

  const id = String(item?.id || item?.itemId || '');
  const segments = id.split('-');
  if (segments.length >= 2) {
    const maybeTs = Number(segments[1]);
    if (maybeTs > 1_000_000_000_000) return maybeTs;
  }

  const paintMatch = id.match(/^paint-(\d+)$/);
  if (paintMatch) return Number(paintMatch[1]);

  return 0;
}

export function getDealProducts(productList, limit = 4) {
  return [...productList]
    .filter((product) => getDiscountPercent(product.price, product.originalPrice) > 0)
    .sort((a, b) => {
      const discountDiff =
        getDiscountPercent(b.price, b.originalPrice) - getDiscountPercent(a.price, a.originalPrice);
      if (discountDiff !== 0) return discountDiff;
      return b.originalPrice - b.price - (a.originalPrice - a.price);
    })
    .slice(0, limit);
}

export function getNewArrivalProducts(productList, limit = 8, excludeIds = []) {
  const excluded = new Set(excludeIds);

  return [...productList]
    .filter((product) => !excluded.has(product.id))
    .sort((a, b) => b.createdAt - a.createdAt)
    .slice(0, limit);
}

export function resolveProductPricing(body) {
  const price = Number(body.price);
  const discount = Math.min(99, Math.max(0, Number(body.discount) || 0));
  let originalPrice = Number(body.originalPrice) || 0;

  if (discount > 0 && price > 0) {
    originalPrice = Math.round(price / (1 - discount / 100));
  } else if (!originalPrice || originalPrice < price) {
    originalPrice = price;
  }

  return { price, originalPrice };
}

export function createCatalogItem(type, body) {
  const createdAt = Date.now();
  const id = `${type}-${createdAt}-${Math.random().toString(36).slice(2, 6)}`;
  if (type === 'product') {
    const { price, originalPrice } = resolveProductPricing(body);
    return normalizeCatalogItem({
      id,
      type: 'product',
      name: body.name,
      category: body.category,
      pack: body.pack,
      price,
      originalPrice,
      image: body.image || '',
      createdAt,
    });
  }

  return normalizeCatalogItem({
    id,
    type: 'service',
    name: body.name,
    summary: body.summary,
    category: body.category,
    price: Number(body.price),
    emoji: body.emoji || '🛠️',
    image: body.image || '',
  });
}

export function updateCatalogItem(type, id, body) {
  if (type === 'product') {
    const { price, originalPrice } = resolveProductPricing(body);
    return normalizeCatalogItem({
      id,
      type: 'product',
      name: body.name,
      category: body.category,
      pack: body.pack,
      price,
      originalPrice,
      image: body.image || '',
      createdAt: body.createdAt,
    });
  }

  return normalizeCatalogItem({
    id,
    type: 'service',
    name: body.name,
    summary: body.summary,
    category: body.category,
    price: Number(body.price),
    emoji: body.emoji || '🛠️',
    image: body.image || '',
  });
}
