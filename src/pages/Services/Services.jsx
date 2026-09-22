import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { money } from '../../data/mockData';
import { useCart } from '../../context/CartContext';
import { useCatalog } from '../../context/CatalogContext';
import PageHero from '../../components/common/PageHero';
import { HERO_IMAGES, SERVICE_CATEGORY_HERO_IMAGES } from '../../data/heroImages';
import { brand } from '../../data/siteContent';
import PageSeo from '../../components/seo/PageSeo';
import ServiceMedia from '../../components/services/ServiceMedia';
import CatalogPrice from '../../components/common/CatalogPrice';

const whyUs = [
  { icon: '✅', title: 'Vetted Experts', text: 'Background-verified & trained professionals only.', color: '#10b981' },
  { icon: '⚡', title: 'Fast Response', text: 'Expert at your door within 2–4 hours, same day.', color: '#f59e0b' },
  { icon: '💳', title: 'Pay After Service', text: 'No upfront — pay only when satisfied.', color: '#8b5cf6' },
  { icon: '🛡️', title: '30-Day Warranty', text: 'All services backed by a 30-day warranty.', color: '#f97316' },
];

export default function Services() {
  const { addToCart } = useCart();
  const { serviceCategories, loading } = useCatalog();
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get('category');
  const [activeTab, setActiveTab] = useState(categoryParam || 'all');

  useEffect(() => {
    if (!categoryParam) {
      setActiveTab('all');
      return;
    }
    if (categoryParam === 'all' || serviceCategories.some((cat) => cat.id === categoryParam)) {
      setActiveTab(categoryParam);
    }
  }, [categoryParam, serviceCategories]);

  const setServiceTab = (tabId) => {
    setActiveTab(tabId);
    if (tabId === 'all') {
      setSearchParams({});
    } else {
      setSearchParams({ category: tabId });
    }
  };

  const displayed =
    activeTab === 'all'
      ? serviceCategories
      : serviceCategories.filter((c) => c.id === activeTab);

  const seoPath =
    activeTab !== 'all' ? `/services?category=${encodeURIComponent(activeTab)}` : '/services';
  const activeCategory = serviceCategories.find((c) => c.id === activeTab);

  return (
    <div className="space-y-10">
      <PageSeo
        title={
          activeTab === 'all'
            ? `Home Services in ${brand.city}`
            : `${activeCategory?.label || 'Services'} in ${brand.city}`
        }
        description={
          activeTab === 'all'
            ? `Electrician, plumber, painter, carpenter, AC repair & cleaning in ${brand.city}. Vetted experts, same-day visits, pay after service.`
            : `Book ${activeCategory?.label?.toLowerCase() || 'home services'} in ${brand.city}. ${activeCategory?.description || ''}`
        }
        path={seoPath}
      />

      <PageHero
        image={HERO_IMAGES.services}
        kicker="Home services"
        title="Trusted experts for every home job"
        description={`${serviceCategories.length} categories · Vetted professionals · Same-day visit · Across Lucknow`}
        pills={['Electrician', 'Plumber', 'Painter', '2–4 hr response']}
      />

      {/* ─── WHY CHOOSE US ─── */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {whyUs.map((item) => (
          <div
            key={item.title}
            className="card-premium p-5 sm:p-6 text-center group hover:scale-[1.02] transition-transform"
          >
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-4 group-hover:scale-110 transition-transform"
              style={{ background: `${item.color}15`, border: `1.5px solid ${item.color}25` }}
            >
              {item.icon}
            </div>
            <h3 className="font-black text-[#4a3728] text-sm sm:text-base mb-1.5">{item.title}</h3>
            <p className="text-[#8b7355] text-xs sm:text-sm leading-snug">{item.text}</p>
          </div>
        ))}
      </section>

      {/* ─── FILTER TABS ─── */}
      <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
        <button
          type="button"
          onClick={() => setServiceTab('all')}
          className={`services-tab-btn ${activeTab === 'all' ? 'services-tab-active' : 'services-tab-inactive'}`}
        >
          All Services
        </button>
        {serviceCategories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setServiceTab(cat.id)}
            className={`services-tab-btn ${activeTab === cat.id ? 'services-tab-active' : 'services-tab-inactive'}`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* ─── SERVICE SECTIONS ─── */}
      {loading ? (
        <p className="text-[#8b7355] text-center py-12">Loading services...</p>
      ) : (
      displayed.map((cat) => (
        <section key={cat.id} className="service-section">

          {/* Category header */}
          <div className="relative overflow-hidden px-7 py-7 sm:px-10 sm:py-8 text-white min-h-[140px]">
            <img
              src={SERVICE_CATEGORY_HERO_IMAGES[cat.id] || HERO_IMAGES.services}
              alt=""
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="service-category-overlay" />
            <div className="relative z-10 flex items-center gap-4">
              <div>
                <h2 className="text-2xl sm:text-3xl font-black mb-1 text-[#fffcf7]">{cat.label}</h2>
                <p className="text-[#f5deb3] text-sm font-medium">{cat.description}</p>
              </div>
            </div>
          </div>

          {/* Service cards */}
          <div className="service-section-body">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
              {cat.services.map((service) => (
                <article key={service.id} className="service-card group">
                  <ServiceMedia service={service} variant="card" />

                  <h3 className="font-black text-[#4a3728] text-base mb-1 leading-tight">{service.name}</h3>
                  <p className="text-[#8b7355] text-xs mb-4 flex-grow font-medium">{service.summary}</p>

                  <div className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase px-2.5 py-1.5 rounded-xl mb-4 self-start bg-[#fff3d6] text-[#8b6914] border border-[#edd9b8]">
                    {cat.label}
                  </div>

                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-[#f0e4c8]">
                    <CatalogPrice price={service.price} originalPrice={service.originalPrice} />
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
          </div>
        </section>
      ))
      )}

      {/* ─── BOTTOM CTA ─── */}
      <section
        className="rounded-3xl p-8 sm:p-12 text-center relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #f97316 0%, #f59e0b 50%, #f97316 100%)' }}
      >
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, white 0%, transparent 50%), radial-gradient(circle at 80% 50%, white 0%, transparent 50%)' }}
        />
        <div className="relative z-10">
          <div className="text-5xl mb-4">🤝</div>
          <h2 className="text-2xl sm:text-3xl font-black text-white mb-3">Not sure what you need?</h2>
          <p className="text-white/90 mb-8 max-w-lg mx-auto text-sm sm:text-base font-medium leading-relaxed">
            Describe your problem and our team will match you with the right expert. No commitment, no upfront payment.
          </p>
          <a
            href={`mailto:${brand.supportEmail}`}
            className="inline-flex items-center gap-2.5 bg-white text-orange-600 font-black px-8 py-4 rounded-2xl hover:bg-orange-50 transition-all no-underline shadow-xl hover:shadow-2xl hover:-translate-y-0.5 transform text-base"
          >
            📧 Contact us for free advice
          </a>
        </div>
      </section>

    </div>
  );
}
