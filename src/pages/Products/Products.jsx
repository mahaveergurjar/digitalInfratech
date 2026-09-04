import { useMemo, useState } from 'react';
import { products } from '../../data/mockData';
import ProductCard from '../../components/products/ProductCard';

const filters = ['All', 'Interior Paint', 'Exterior Paint', 'Waterproofing', 'Wood & Metal', 'Decorative Finish'];

export default function Products() {
  const [filter, setFilter] = useState('All');

  const filteredProducts = useMemo(() => {
    return products.filter((item) => filter === 'All' || item.category === filter);
  }, [filter]);

  return (
    <div className="space-y-6">
      <section className="rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 text-white p-6 sm:p-8">
        <p className="text-orange-100 font-bold text-xs uppercase tracking-widest mb-2">Full catalogue</p>
        <h1 className="text-2xl sm:text-3xl font-black mb-2">All painting products</h1>
        <p className="text-orange-50 text-sm max-w-xl">
          {filteredProducts.length} products · Authentic brands · {filter === 'All' ? 'Every category' : filter} · Delivered in 40 minutes across Lucknow
        </p>
      </section>

      <div className="flex flex-wrap gap-2">
        {filters.map((item) => (
          <button
            key={item}
            type="button"
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
              filter === item
                ? 'bg-slate-900 text-white shadow-md'
                : 'bg-white border border-slate-200 text-slate-700 hover:border-orange-300 hover:text-orange-600'
            }`}
            onClick={() => setFilter(item)}
          >
            {item}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
