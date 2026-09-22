import CatalogItem from './CatalogItem.js';
import { EXPECTED_PRODUCT_COUNT, getDefaultCatalogItems } from './defaultCatalog.js';
import { resolveServiceOriginalPrice } from '../../shared/catalogPricing.js';
import { resolveProductImage } from './productImages.js';

function serializeItem(item) {
  const image =
    item.type === 'product'
      ? resolveProductImage({ itemId: item.itemId, name: item.name, category: item.category, image: item.image })
      : item.image || '';

  return {
    id: item.itemId,
    itemId: item.itemId,
    type: item.type,
    name: item.name,
    summary: item.summary || '',
    pack: item.pack || '',
    category: item.category,
    price: item.price,
    originalPrice:
      item.type === 'service'
        ? resolveServiceOriginalPrice(item.price, item.originalPrice)
        : item.originalPrice || 0,
    image,
    emoji: item.emoji || '🛠️',
    active: item.active !== false,
    createdAt: item.createdAt || 0,
  };
}

export async function ensureCatalogSeeded() {
  const defaults = getDefaultCatalogItems();
  const existing = await CatalogItem.find({ itemId: { $in: defaults.map((item) => item.itemId) } })
    .select('itemId')
    .lean();
  const existingIds = new Set(existing.map((item) => item.itemId));
  const missing = defaults.filter((item) => !existingIds.has(item.itemId));

  if (missing.length > 0) {
    await CatalogItem.insertMany(missing, { ordered: false }).catch((error) => {
      if (error?.code !== 11000) throw error;
    });
  }

  const productCount = await CatalogItem.countDocuments({ type: 'product', active: true });
  return { inserted: missing.length, productCount, expected: EXPECTED_PRODUCT_COUNT };
}

export async function getPublicCatalog() {
  await ensureCatalogSeeded();

  const items = await CatalogItem.find({ active: true }).sort({ type: 1, createdAt: 1, itemId: 1 }).lean();
  const products = items.filter((item) => item.type === 'product').map(serializeItem);
  const services = items.filter((item) => item.type === 'service').map(serializeItem);

  return { products, services };
}
