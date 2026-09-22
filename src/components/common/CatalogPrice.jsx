import { money } from '../../data/mockData';
import { getDiscountPercent } from '../../utils/catalogHelpers';

export function DiscountBadge({ price, originalPrice, className = '' }) {
  const discount = getDiscountPercent(price, originalPrice);
  if (discount <= 0) return null;
  return (
    <span className={`product-card-discount ${className}`}>{discount}% off</span>
  );
}

export default function CatalogPrice({ price, originalPrice, fromLabel = 'From' }) {
  const showStrike = originalPrice > price;

  return (
    <div>
      {fromLabel ? (
        <span className="block text-[10px] text-[#a08060] uppercase font-bold tracking-wide">
          {fromLabel}
        </span>
      ) : null}
      <div className="flex items-baseline gap-2 flex-wrap">
        <strong className="text-xl font-black text-[#4a3728]">{money.format(price)}</strong>
        {showStrike && (
          <span className="text-sm text-[#a08060] line-through font-medium">
            {money.format(originalPrice)}
          </span>
        )}
      </div>
    </div>
  );
}
