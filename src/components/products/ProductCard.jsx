import { money } from '../../data/mockData';
import { useCart } from '../../context/CartContext';

function discountPercent(price, originalPrice) {
  if (!originalPrice || originalPrice <= price) return 0;
  return Math.round(((originalPrice - price) / originalPrice) * 100);
}

export default function ProductCard({ product, compact = false }) {
  const { addToCart, setCartOpen } = useCart();
  const discount = discountPercent(product.price, product.originalPrice);

  return (
    <article className="group card-premium flex flex-col">
      <div
        className={`relative overflow-hidden rounded-t-[20px] bg-white flex items-center justify-center p-5 ${
          compact ? 'aspect-[4/3]' : 'aspect-square'
        }`}
      >
        {discount > 0 && (
          <span className="absolute top-2.5 left-2.5 z-20 bg-rose-600 text-white text-[10px] font-semibold px-2 py-1 rounded-md">
            {discount}% off
          </span>
        )}
        <img
          src={product.image}
          alt={product.name}
          className="max-h-full max-w-full object-contain"
        />
      </div>

      <div className="px-4 pt-3.5 pb-4 flex flex-col flex-grow border-t border-slate-100">
        <div className="flex flex-wrap gap-1.5 mb-3">
          <span className="text-[10px] font-semibold uppercase tracking-wide bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-lg border border-emerald-100">
            40 min
          </span>
          <span className="text-[10px] font-semibold uppercase tracking-wide bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded-lg">
            Pay on delivery
          </span>
        </div>

        <h3 className="font-bold text-slate-800 text-sm leading-snug line-clamp-2 mb-1 min-h-[2.5rem]">
          {product.name}
        </h3>
        <p className="text-xs text-slate-400 mb-3 font-medium">{product.pack}</p>

        <div className="flex items-baseline gap-2 mb-4">
          <strong className="text-xl font-black text-slate-900">{money.format(product.price)}</strong>
          {product.originalPrice > product.price && (
            <span className="text-sm text-slate-400 line-through font-medium">
              {money.format(product.originalPrice)}
            </span>
          )}
        </div>

        <div className="mt-auto grid grid-cols-2 gap-2">
          <button
            type="button"
            className="py-2.5 px-3 border border-slate-200 text-slate-700 font-semibold rounded-xl hover:border-orange-300 hover:text-orange-600 hover:bg-orange-50 transition-colors text-sm"
            onClick={() => addToCart(product)}
          >
            Add
          </button>
          <button
            type="button"
            className="py-2.5 px-3 bg-orange-500 text-white font-semibold rounded-xl hover:bg-orange-600 transition-colors text-sm"
            onClick={() => {
              addToCart(product);
              setCartOpen(true);
            }}
          >
            Buy now
          </button>
        </div>
      </div>
    </article>
  );
}
