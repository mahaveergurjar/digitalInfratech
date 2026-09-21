import { Link, useParams } from 'react-router-dom';
import { money } from '../../data/mockData';
import { SERVICE_CATEGORY_META } from '../../data/serviceCategoryMeta';
import { brand } from '../../data/siteContent';
import { useCatalog } from '../../context/CatalogContext';
import PageSeo from '../../components/seo/PageSeo';
import { HERO_IMAGES, SERVICE_CATEGORY_HERO_IMAGES } from '../../data/heroImages';
import { useCart } from '../../context/CartContext';
import ServiceMedia from '../../components/services/ServiceMedia';

export default function ServiceCategory() {
  const { slug } = useParams();
  const meta = SERVICE_CATEGORY_META.find((item) => item.id === slug);
  const { serviceCategories, loading } = useCatalog();
  const category = serviceCategories.find((item) => item.id === slug);
  const { addToCart } = useCart();

  if (!meta) {
    return (
      <>
        <PageSeo title="Service not found" description="Browse home services in Lucknow." path="/services" noindex />
        <div className="empty-state card">
          <h2>Category not found</h2>
          <Link to="/services" className="btn-primary">Back to services</Link>
        </div>
      </>
    );
  }

  const services = category?.services ?? [];
  const description = `Book ${meta.label} in ${brand.city}. ${meta.description} Same-day visits, vetted pros, pay after service.`;

  return (
    <>
      <PageSeo
        title={`${meta.label} in ${brand.city}`}
        description={description}
        path={`/services/${slug}`}
      />

      <div className="space-y-8">
        <section className="relative overflow-hidden rounded-3xl px-7 py-10 sm:px-10 text-white min-h-[180px]">
          <img
            src={SERVICE_CATEGORY_HERO_IMAGES[meta.id] || HERO_IMAGES.services}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="service-category-overlay" />
          <div className="relative z-10 max-w-2xl">
            <p className="text-[#f5deb3] text-xs font-bold uppercase tracking-widest mb-2">Home services</p>
            <h1 className="text-3xl sm:text-4xl font-black mb-3">{meta.label} in {brand.city}</h1>
            <p className="text-[#fffcf7]/90 text-sm sm:text-base font-medium">{meta.description}</p>
          </div>
        </section>

        {loading ? (
          <p className="text-[#8b7355] text-center py-12">Loading services...</p>
        ) : services.length === 0 ? (
          <div className="card p-8 text-center">
            <p className="text-[#8b7355] mb-4">Browse all categories on the services page.</p>
            <Link to="/services" className="btn-primary">View all services</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {services.map((service) => (
              <article key={service.id} className="service-card group">
                <ServiceMedia service={service} variant="card" />
                <h2 className="font-black text-[#4a3728] text-base mb-1">{service.name}</h2>
                <p className="text-[#8b7355] text-xs mb-4 flex-grow font-medium">{service.summary}</p>
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-[#f0e4c8]">
                  <strong className="text-xl font-black text-[#4a3728]">{money.format(service.price)}</strong>
                  <button
                    type="button"
                    className="product-card-btn-primary text-xs px-5 py-2.5"
                    onClick={() => addToCart({ ...service, type: 'service' })}
                  >
                    Book →
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}

        <div className="hero__actions">
          <Link to="/services" className="btn-secondary">All services</Link>
          <Link to={`/services?category=${meta.id}`} className="btn-primary">Open in catalogue</Link>
        </div>
      </div>
    </>
  );
}
