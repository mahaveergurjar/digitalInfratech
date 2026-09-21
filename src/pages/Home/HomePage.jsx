import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { brand, testimonials } from '../../data/siteContent';
import CategoryScrollStrip from '../../components/home/CategoryScrollStrip';
import ProductCard from '../../components/products/ProductCard';
import PageHero from '../../components/common/PageHero';
import { useCatalog } from '../../context/CatalogContext';
import { getDealProducts, getNewArrivalProducts } from '../../utils/catalogHelpers';
import { HERO_IMAGES, SERVICE_CATEGORY_HERO_IMAGES } from '../../data/heroImages';
import PageSeo from '../../components/seo/PageSeo';
import { homeJsonLd, seoDefaults } from '../../config/seo';

const stats = [
  { value: '500+', label: 'Happy Customers', icon: '😊' },
  { value: '40 min', label: 'Avg Response', icon: '⚡' },
  { value: '6+', label: 'Service Types', icon: '🛠️' },
  { value: '100%', label: 'Verified Experts', icon: '✅' },
];

export default function HomePage() {
  const { products, serviceCategories } = useCatalog();
  const dealProducts = useMemo(() => getDealProducts(products, 4), [products]);
  const newArrivals = useMemo(
    () => getNewArrivalProducts(products, 8, dealProducts.map((product) => product.id)),
    [products, dealProducts],
  );

  return (
    <div className="space-y-10 sm:space-y-14">
      <PageSeo
        title={null}
        description={seoDefaults.description}
        path="/"
        jsonLd={homeJsonLd()}
      />

      <PageHero
        image={HERO_IMAGES.home}
        kicker={`Now live in ${brand.city} · ${brand.eta}`}
        title="Your home, our expertise"
        description="Home services & premium paints in one place — electrician, plumber, painter, carpenter, AC repair, cleaning & more."
        pills={['Home services', 'Premium paints', 'Pay on delivery', 'Vetted experts']}
        actions={
          <div className="page-hero-actions">
            <Link to="/services" className="btn-primary !py-3 !px-5 !text-sm no-underline">
              Book a service
            </Link>
            <Link to="/products" className="page-hero-btn-secondary">
              Browse paints
            </Link>
          </div>
        }
      />

      {/* ─── STATS ─── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {stats.map((s) => (
          <div key={s.label} className="card-premium p-4 sm:p-5 text-center">
            <div className="text-xl mb-1">{s.icon}</div>
            <div className="text-xl sm:text-2xl font-black text-[#4a3728]">{s.value}</div>
            <div className="text-[10px] text-[#8b7355] font-semibold uppercase tracking-wide mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* ─── MARQUEE TICKER ─── */}
      <div className="overflow-hidden rounded-2xl bg-gradient-to-r from-[#4a3728] via-[#5c4033] to-[#4a3728] border border-[#6b5344]">
        <div className="animate-marquee flex whitespace-nowrap gap-16 text-sm font-semibold text-[#f5deb3] py-3.5 px-4">
          {[...Array(2)].map((_, i) => (
            <span key={i} className="flex gap-16">
              <span>Diwali 15% OFF on select paints</span>
              <span className="text-[#f5c842]">✦</span>
              <span>Electrician at your door in 2 hrs</span>
              <span className="text-[#f5c842]">✦</span>
              <span>Plumber for leaks &amp; pipe repair</span>
              <span className="text-[#f5c842]">✦</span>
              <span>Book verified painters online</span>
              <span className="text-[#f5c842]">✦</span>
              <span>AC Service &amp; gas refill</span>
              <span className="text-[#f5c842]">✦</span>
              <span>Home deep cleaning service</span>
              <span className="text-[#f5c842]">✦</span>
              <span>Carpenter for furniture &amp; doors</span>
              <span className="text-[#f5c842]">✦</span>
              <span>Pay on delivery available</span>
              <span className="text-[#f5c842]">✦</span>
            </span>
          ))}
        </div>
      </div>

      {/* ─── CATEGORY QUICK ACCESS ─── */}
      <CategoryScrollStrip />

      {/* ─── SERVICES GRID ─── */}
      <section>
        <div className="flex items-end justify-between gap-4 mb-7">
          <div>
            <span className="kicker">🏠 Home Services</span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#4a3728] leading-tight">
              Book an expert for any home job
            </h2>
            <p className="text-[#8b7355] text-sm mt-1.5">Vetted professionals · Pay after service · 30-day warranty</p>
          </div>
          <Link to="/services" className="shrink-0 inline-flex items-center gap-1.5 text-sm font-bold text-[#c05621] hover:text-[#ea7a2a] no-underline border border-[#edd9b8] rounded-xl px-4 py-2 hover:bg-[#fff3d6] transition-all">
            All services →
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {serviceCategories.map((cat) => (
            <Link
              key={cat.id}
              to={`/services?category=${cat.id}`}
              className="group relative card-premium no-underline overflow-hidden p-0 flex flex-col"
            >
              <div className={`absolute top-0 left-0 right-0 h-1 z-10 bg-gradient-to-r ${cat.color}`} />
              <div className="aspect-[4/3] overflow-hidden bg-[#f0e4c8]">
                <img
                  src={SERVICE_CATEGORY_HERO_IMAGES[cat.id] || HERO_IMAGES.services}
                  alt={cat.label}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
              <div className="p-4 text-center">
                <p className="text-sm font-black text-[#4a3728] group-hover:text-[#c05621] transition-colors leading-tight">
                  {cat.label}
                </p>
                <p className="text-[10px] text-[#a08060] mt-0.5 font-semibold">{cat.services.length} services</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ─── DEALS OF THE WEEK ─── */}
      <section>
        <div className="flex items-end justify-between gap-4 mb-7">
          <div>
            <span className="kicker">🔥 Limited time</span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#4a3728]">Deals of the week</h2>
            <p className="text-[#8b7355] text-sm mt-1.5">Top discounts on paints this week — updated automatically</p>
          </div>
          <Link to="/products" className="shrink-0 inline-flex items-center gap-1.5 text-sm font-bold text-[#c05621] hover:text-[#ea7a2a] no-underline border border-[#edd9b8] rounded-xl px-4 py-2 hover:bg-[#fff3d6] transition-all">
            See all →
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
          {dealProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* ─── NEW ARRIVALS ─── */}
      <section>
        <div className="flex items-end justify-between gap-4 mb-7">
          <div>
            <span className="kicker" style={{ color: '#10b981' }}>✨ Just in</span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#4a3728]">New arrivals</h2>
            <p className="text-[#8b7355] text-sm mt-1.5">Recently added paints — newest first</p>
          </div>
          <Link to="/products" className="shrink-0 inline-flex items-center gap-1.5 text-sm font-bold text-[#c05621] hover:text-[#ea7a2a] no-underline border border-[#edd9b8] rounded-xl px-4 py-2 hover:bg-[#fff3d6] transition-all">
            View catalogue →
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
          {newArrivals.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* ─── TESTIMONIALS ─── */}
      <section className="relative overflow-hidden rounded-3xl p-8 sm:p-12"
        style={{ background: 'linear-gradient(135deg, #fff8ed 0%, #fff3d6 50%, #f5deb3 100%)' }}
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-200/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-200/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 text-center mb-10">
          <span className="kicker">⭐ Customer stories</span>
          <h2 className="text-2xl sm:text-3xl font-black text-[#4a3728]">Lucknow trusts Digital InfraTech</h2>
          <p className="text-[#8b7355] text-sm mt-2">Real reviews from real customers across Lucknow</p>
        </div>

        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {testimonials.map((item, i) => (
            <blockquote
              key={item.name}
              className="card-premium p-6 flex flex-col"
            >
              <div className="flex gap-0.5 mb-4">
                {[...Array(5)].map((_, s) => (
                  <span key={s} className="star-filled text-sm">★</span>
                ))}
              </div>
              <p className="text-[#6b5344] text-sm leading-relaxed mb-5 flex-grow italic">
                &ldquo;{item.quote}&rdquo;
              </p>
              <footer className="flex items-center gap-3 pt-4 border-t border-[#f0e4c8]">
                <span
                  className="w-10 h-10 rounded-full text-white flex items-center justify-center font-black text-sm shadow-sm flex-shrink-0"
                  style={{ background: `linear-gradient(135deg, hsl(${(i * 60 + 20) % 360}, 80%, 55%), hsl(${(i * 60 + 60) % 360}, 80%, 60%))` }}
                >
                  {item.name.charAt(0)}
                </span>
                <div>
                  <cite className="not-italic font-bold text-[#4a3728] text-sm">{item.name}</cite>
                  <span className="block text-xs text-[#a08060] font-medium">{item.area}, Lucknow</span>
                </div>
              </footer>
            </blockquote>
          ))}
        </div>
      </section>

    </div>
  );
}
