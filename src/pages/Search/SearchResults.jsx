import { useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import ProductCard from '../../components/products/ProductCard';
import { money } from '../../data/mockData';
import { useCart } from '../../context/CartContext';
import { useCatalog } from '../../context/CatalogContext';
import { searchCatalog } from '../../utils/search';
import PageSeo from '../../components/seo/PageSeo';
import ServiceMedia from '../../components/services/ServiceMedia';
import { brand } from '../../data/siteContent';

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q')?.trim() || '';
  const { addToCart } = useCart();
  const { products, services } = useCatalog();

  const { products: productResults, services: serviceResults } = useMemo(
    () => searchCatalog(query, { products, services }),
    [query, products, services]
  );

  const totalResults = productResults.length + serviceResults.length;

  const seoPath = query ? `/search?q=${encodeURIComponent(query)}` : '/search';

  return (
    <div className="space-y-8">
      <PageSeo
        title={query ? `Search: ${query}` : 'Search'}
        description={
          query
            ? `Find paints and home services matching "${query}" in ${brand.city}.`
            : `Search paints, primers, electricians, plumbers and more in ${brand.city}.`
        }
        path={seoPath}
        noindex={Boolean(query)}
      />
      <section className="rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 text-white p-6 sm:p-8">
        <p className="text-orange-100 font-bold text-xs uppercase tracking-widest mb-2">Search</p>
        <h1 className="text-2xl sm:text-3xl font-black mb-2">
          {query ? `Results for "${query}"` : 'Search products & services'}
        </h1>
        <p className="text-orange-50 text-sm max-w-xl">
          {query
            ? `${totalResults} match${totalResults === 1 ? '' : 'es'} found across paints and home services`
            : 'Type in the search bar above to find paints, primers, electricians, plumbers and more.'}
        </p>
      </section>

      {!query && (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-500">
          Use the search bar in the header to get started.
        </div>
      )}

      {query && totalResults === 0 && (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
          <p className="text-slate-700 font-semibold mb-2">No results found for "{query}"</p>
          <p className="text-slate-500 text-sm mb-5">Try searching for paint, primer, electrician, plumber, or AC repair.</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link to="/products" className="btn-primary no-underline">Browse products</Link>
            <Link to="/services" className="btn-secondary no-underline">Browse services</Link>
          </div>
        </div>
      )}

      {productResults.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-xl font-black text-slate-900">Products ({productResults.length})</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
            {productResults.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      {serviceResults.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-xl font-black text-slate-900">Services ({serviceResults.length})</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {serviceResults.map((service) => (
              <article key={service.id} className="card-premium p-5 flex flex-col">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-20 h-20 shrink-0 overflow-hidden rounded-xl border border-slate-100 bg-slate-50">
                    <ServiceMedia service={service} variant="thumb" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h3 className="font-black text-slate-900">{service.name}</h3>
                    <p className="text-sm text-slate-500 mt-1">{service.summary}</p>
                  </div>
                </div>
                <div className="mt-auto flex items-center justify-between gap-3 pt-3 border-t border-slate-100">
                  <strong className="text-lg font-black text-slate-900">{money.format(service.price)}</strong>
                  <button
                    type="button"
                    className="py-2 px-4 bg-orange-500 text-white font-semibold rounded-xl hover:bg-orange-600 transition-colors text-sm"
                    onClick={() => addToCart({ ...service, type: 'service' })}
                  >
                    Book now
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
