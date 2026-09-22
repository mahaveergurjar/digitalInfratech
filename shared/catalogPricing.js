/** Default ~12% off MRP when service has no admin discount saved yet. */
const DEFAULT_SERVICE_DISCOUNT = 0.12;

export function resolveServiceOriginalPrice(price, originalPrice) {
  const sale = Number(price) || 0;
  const mrp = Number(originalPrice) || 0;
  if (sale <= 0) return sale;
  if (mrp > sale) return mrp;
  if (mrp === 0) return Math.round(sale / (1 - DEFAULT_SERVICE_DISCOUNT));
  return sale;
}
