import { Link } from 'react-router-dom';
import { SERVICE_CATEGORY_META } from '../../data/serviceCategoryMeta';
import { useCart } from '../../context/CartContext';
import ServiceMedia from './ServiceMedia';
import CatalogPrice, { DiscountBadge } from '../common/CatalogPrice';

function categoryLabel(categoryId) {
  return SERVICE_CATEGORY_META.find((item) => item.id === categoryId)?.label || 'Service';
}

export default function ServiceHomeCard({ service }) {
  const { addToCart, setCartOpen } = useCart();
  const category = categoryLabel(service.category);

  return (
    <article className="product-card group h-full">
      <Link
        to={`/services?category=${encodeURIComponent(service.category)}`}
        className="block no-underline text-inherit"
      >
        <div className="product-card-media aspect-square overflow-hidden bg-[#f0e4c8] relative">
          <DiscountBadge price={service.price} originalPrice={service.originalPrice} />
          <ServiceMedia service={service} variant="thumb" className="w-full h-full object-cover" />
        </div>
      </Link>

      <div className="product-card-body">
        <div className="flex flex-wrap gap-1.5 mb-3">
          <span className="product-card-tag product-card-tag--delivery">Same day</span>
          <span className="product-card-tag product-card-tag--cod">Pay after service</span>
        </div>

        <h3 className="font-bold text-[#4a3728] text-sm leading-snug line-clamp-2 mb-1 min-h-[2.5rem]">
          {service.name}
        </h3>
        <p className="text-xs text-[#a08060] mb-2 font-medium line-clamp-2 min-h-[2rem]">
          {service.summary}
        </p>
        <p className="text-[10px] font-bold uppercase tracking-wide text-[#8b6914] mb-3">
          {category}
        </p>

        <div className="mb-4">
          <CatalogPrice price={service.price} originalPrice={service.originalPrice} />
        </div>

        <div className="mt-auto grid grid-cols-2 gap-2">
          <Link
            to="/services"
            className="product-card-btn-outline text-center no-underline flex items-center justify-center"
          >
            Details
          </Link>
          <button
            type="button"
            className="product-card-btn-primary"
            onClick={() => {
              addToCart({ ...service, type: 'service' });
              setCartOpen(true);
            }}
          >
            Book
          </button>
        </div>
      </div>
    </article>
  );
}
