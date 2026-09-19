import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import ProductCard from '../../components/products/ProductCard';
import PageHero from '../../components/common/PageHero';
import { useCatalog } from '../../context/CatalogContext';
import { HERO_IMAGES } from '../../data/heroImages';

const filters = ['All', 'Interior Paint', 'Exterior Paint', 'Waterproofing', 'Wood & Metal', 'Decorative Finish'];

export default function Products() {
  const { products, loading } = useCatalog();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const categoryParam = searchParams.get('category');
  const nameParam = searchParams.get('name');
  const initialFilter = categoryParam && filters.includes(categoryParam) ? categoryParam : 'All';
  const [filter, setFilter] = useState(initialFilter);

  useEffect(() => {
    if (nameParam) {
      setFilter('All');
      return;
    }
    if (categoryParam && filters.includes(categoryParam)) {
      setFilter(categoryParam);
      return;
    }
    if (!categoryParam && !nameParam) {
      setFilter('All');
    }
  }, [categoryParam, nameParam]);

  const filteredProducts = useMemo(() => {
    if (nameParam) {
      const pattern = new RegExp(nameParam, 'i');
      return products.filter((product) => pattern.test(product.name));
    }
    return products.filter((item) => filter === 'All' || item.category === filter);
  }, [filter, products, nameParam]);

  const activeLabel = nameParam
    ? nameParam.charAt(0).toUpperCase() + nameParam.slice(1)
    : filter === 'All'
      ? 'Every category'
      : filter;

  const setProductFilter = (item) => {
    setFilter(item);
    if (item === 'All') {
      navigate('/products');
    } else {
      navigate(`/products?category=${encodeURIComponent(item)}`);
    }
  };

  return (
    <div className="space-y-6">
      <PageHero
        image={HERO_IMAGES.products}
        kicker="Full catalogue"
        title="Premium paints & coatings"
        description={`${filteredProducts.length} products · Authentic brands · ${activeLabel} · Delivered in 40 minutes across Lucknow`}
        pills={['Interior', 'Exterior', 'Waterproofing', '40 min delivery']}
      />

      <div className="flex flex-wrap gap-2">
        {filters.map((item) => (
          <button
            key={item}
            type="button"
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
              !nameParam && filter === item
                ? 'bg-gradient-to-r from-[#4a3728] to-[#5c4033] text-white shadow-md'
                : 'bg-[#fffcf7] border border-[#edd9b8] text-[#6b5344] hover:border-[#e8a838] hover:text-[#c05621] hover:bg-[#fff3d6]'
            }`}
            onClick={() => setProductFilter(item)}
          >
            {item}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
        {loading ? (
          <p className="col-span-full text-[#8b7355] py-8 text-center">Loading products...</p>
        ) : (
          filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))
        )}
      </div>
    </div>
  );
}
