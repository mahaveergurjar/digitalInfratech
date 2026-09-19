import { useEffect, useState } from 'react';
import { money } from '../../data/mockData';
import { resolveProductImage } from '../../data/productImages';
import { useCart } from '../../context/CartContext';

function discountPercent(price, originalPrice) {
  if (!originalPrice || originalPrice <= price) return 0;
  return Math.round(((originalPrice - price) / originalPrice) * 100);
}

export default function ProductCard({ product }) {
  const { addToCart, setCartOpen } = useCart();
  const resolvedImage = resolveProductImage(product);
  const [imageSrc, setImageSrc] = useState(resolvedImage);
  const discount = discountPercent(product.price, product.originalPrice);

  useEffect(() => {
    setImageSrc(resolveProductImage(product));
  }, [product.id, product.image, product.name]);

  return (
    <article className="product-card group h-full">
      <div className="product-card-media aspect-square">
        {discount > 0 && (
          <span className="product-card-discount">{discount}% off</span>
        )}
        <img
          src={imageSrc}
          alt={product.name}
          className="relative z-10"
          onError={() => setImageSrc(resolveProductImage(product))}
        />
      </div>

      <div className="product-card-body">
        <div className="flex flex-wrap gap-1.5 mb-3">
          <span className="product-card-tag product-card-tag--delivery">40 min</span>
          <span className="product-card-tag product-card-tag--cod">Pay on delivery</span>
        </div>

        <h3 className="font-bold text-[#4a3728] text-sm leading-snug line-clamp-2 mb-1 min-h-[2.5rem]">
          {product.name}
        </h3>
        <p className="text-xs text-[#a08060] mb-3 font-medium">{product.pack}</p>

        <div className="flex items-baseline gap-2 mb-4">
          <strong className="text-xl font-black text-[#4a3728]">{money.format(product.price)}</strong>
          {product.originalPrice > product.price && (
            <span className="text-sm text-[#a08060] line-through font-medium">
              {money.format(product.originalPrice)}
            </span>
          )}
        </div>

        <div className="mt-auto grid grid-cols-2 gap-2">
          <button
            type="button"
            className="product-card-btn-outline"
            onClick={() => addToCart(product)}
          >
            Add
          </button>
          <button
            type="button"
            className="product-card-btn-primary"
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
