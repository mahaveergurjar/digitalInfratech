const PRODUCT_IMAGE_CACHE_VERSION = '5';

export const CATEGORY_PRODUCT_IMAGES = {
  'Interior Paint': '/products/category-interior.png',
  'Exterior Paint': '/products/category-exterior.png',
  Waterproofing: '/products/category-waterproofing.png',
  'Wood & Metal': '/products/category-wood.png',
  'Decorative Finish': '/products/category-decorative.png',
};

const NAME_IMAGE_RULES = [
  { pattern: /primer/i, image: '/products/category-primer.png' },
  { pattern: /putty/i, image: '/products/category-putty.png' },
  { pattern: /metal/i, image: '/products/category-metal.png' },
  { pattern: /wood|enamel/i, image: '/products/category-wood.png' },
  { pattern: /waterproof|membrane|seal|shield|concrete|roof/i, image: '/products/category-waterproofing.png' },
  { pattern: /texture|decor|designer|refresh|colour|color/i, image: '/products/category-decorative.png' },
  { pattern: /exterior|weather/i, image: '/products/category-exterior.png' },
];

export const PRODUCT_IMAGE_BY_ID = {
  'paint-1': '/products/paint-1.png',
  'paint-2': '/products/paint-2.png',
  'paint-3': '/products/paint-3.png',
  'paint-4': '/products/category-waterproofing.png',
  'paint-5': '/products/category-wood.png',
  'paint-7': '/products/paint-7.png',
  'paint-8': '/products/paint-8.png',
  'paint-9': '/products/paint-9.png',
  'paint-10': '/products/paint-10.png',
  'paint-11': '/products/paint-11.png',
  'paint-12': '/products/paint-12.png',
  'paint-13': '/products/paint-13.png',
  'paint-14': '/products/paint-14.png',
  'paint-15': '/products/paint-15.png',
  'paint-16': '/products/paint-16.png',
  'paint-17': '/products/paint-17.png',
  'paint-18': '/products/paint-18.png',
  'paint-20': '/products/paint-20.png',
  'paint-21': '/products/paint-21.png',
  'paint-22': '/products/paint-22.png',
  'paint-24': '/products/paint-24.png',
  'paint-25': '/products/paint-25.png',
  'paint-26': '/products/paint-26.png',
  'paint-27': '/products/paint-27.png',
  'paint-28': '/products/paint-28.png',
  'paint-29': '/products/paint-29.png',
  'paint-30': '/products/paint-30.png',
};

const PRODUCT_IMAGE_FALLBACKS = Object.values(CATEGORY_PRODUCT_IMAGES);

function withProductImageVersion(path) {
  if (!path?.startsWith('/products/paint-')) return path;
  const base = path.split('?')[0];
  return `${base}?v=${PRODUCT_IMAGE_CACHE_VERSION}`;
}

function imageForProductName(name) {
  if (!name) return null;
  for (const rule of NAME_IMAGE_RULES) {
    if (rule.pattern.test(name)) return rule.image;
  }
  return null;
}

function hasCustomImage(image) {
  const value = image?.trim();
  if (!value) return false;
  if (value.includes('Screenshot') || value.includes('/assets/')) return false;
  return true;
}

function mappedProductImage(id) {
  const path = PRODUCT_IMAGE_BY_ID[id];
  if (!path) return null;
  return withProductImageVersion(path);
}

export function resolveProductImage(item, index = 0) {
  const image = item?.image?.trim();
  const id = item?.itemId || item?.id;

  if (hasCustomImage(image)) {
    return image;
  }

  const mapped = id ? mappedProductImage(id) : null;
  if (mapped) return mapped;

  const byName = imageForProductName(item?.name);
  if (byName) return byName;

  if (item?.category && CATEGORY_PRODUCT_IMAGES[item.category]) {
    return CATEGORY_PRODUCT_IMAGES[item.category];
  }

  const match = String(id || '').match(/paint-(\d+)/);
  const derivedIndex = match ? Number(match[1]) - 1 : index;
  return PRODUCT_IMAGE_FALLBACKS[derivedIndex % PRODUCT_IMAGE_FALLBACKS.length];
}
