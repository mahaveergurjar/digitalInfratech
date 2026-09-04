import { Link } from 'react-router-dom';
import { products, serviceCategories } from '../../data/mockData';
import { brand, trustBenefits, testimonials } from '../../data/siteContent';
import CategoryScrollStrip from '../../components/home/CategoryScrollStrip';
import ProductCard from '../../components/products/ProductCard';

const dealProducts = products.slice(0, 4);
const newArrivals = products.slice(4, 12);

const stats = [
  { value: '500+', label: 'Happy Customers', icon: '😊' },
  { value: '40 min', label: 'Avg Response', icon: '⚡' },
  { value: '6+', label: 'Service Types', icon: '🛠️' },
  { value: '100%', label: 'Verified Experts', icon: '✅' },
];

export default function HomePage() {
  return (
    <div className="space-y-10 sm:space-y-14">

      {/* ─── HERO ─── */}
      <section
        className="relative overflow-hidden rounded-3xl border border-stone-800/60"
        style={{
          background: 'linear-gradient(145deg, #1c1917 0%, #292524 42%, #1f1a17 100%)',
        }}
      >
        {/* Warm accent orbs only */}
        <div className="hero-orb w-[420px] h-[420px] bg-orange-500/12 top-[-100px] right-[-80px]" />
        <div className="hero-orb w-[280px] h-[280px] bg-amber-500/8 bottom-[-60px] left-[-40px]" />

        {/* Floating service icons */}
        <div className="absolute right-8 top-10 hidden lg:flex flex-col gap-3 z-10">
          {serviceCategories.slice(0, 3).map((cat) => (
            <div
              key={cat.id}
              className="rounded-2xl px-4 py-3 flex items-center gap-3 border border-orange-500/15 bg-stone-900/70 backdrop-blur-sm"
            >
              <span className="text-2xl">{cat.icon}</span>
              <div>
                <p className="text-stone-100 text-xs font-semibold">{cat.label}</p>
                <p className="text-stone-400 text-[10px]">{cat.services.length} services</p>
              </div>
            </div>
          ))}
        </div>

        <div className="absolute right-8 bottom-10 hidden xl:flex flex-col gap-3 z-10">
          {serviceCategories.slice(3, 6).map((cat) => (
            <div
              key={cat.id}
              className="rounded-2xl px-4 py-3 flex items-center gap-3 border border-orange-500/15 bg-stone-900/70 backdrop-blur-sm"
            >
              <span className="text-2xl">{cat.icon}</span>
              <div>
                <p className="text-stone-100 text-xs font-semibold">{cat.label}</p>
                <p className="text-stone-400 text-[10px]">{cat.services.length} services</p>
              </div>
            </div>
          ))}
        </div>

        <div className="relative z-10 p-5 sm:p-7 lg:p-9 max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 rounded-full px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider mb-4 text-orange-100">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-400" />
            Now live in {brand.city} · {brand.eta}
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight mb-3">
            Your home, our{' '}
            <span className="gradient-text-orange">expertise</span>
          </h1>

          <p className="text-stone-300 text-base sm:text-lg mb-5 max-w-xl leading-relaxed">
            Electrician · Plumber · Painter · Carpenter · AC Repair · Cleaning — plus premium paint supplies. All in Lucknow.
          </p>

          <div className="flex flex-wrap gap-2 mb-5">
            {trustBenefits.map((item) => (
              <span
                key={item.title}
                className="inline-flex items-center gap-1.5 bg-stone-900/50 border border-stone-700/60 rounded-lg px-3 py-1.5 text-xs text-stone-200"
              >
                <span className="text-orange-300">{item.icon}</span>
                <span>
                  <strong className="font-semibold text-white">{item.title}</strong>
                  <span className="text-stone-400"> · {item.text}</span>
                </span>
              </span>
            ))}
          </div>

          <div className="flex flex-wrap gap-2.5">
            <Link to="/services" className="btn-primary !py-3 !px-5 !text-sm">
              Book a service
            </Link>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 bg-transparent hover:bg-white/5 border border-stone-500/70 text-stone-100 font-semibold px-5 py-3 rounded-xl transition-all no-underline hover:border-orange-400/60 text-sm"
            >
              Browse paints
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-6">
            {stats.map((s) => (
              <div key={s.label} className="stat-card !py-3 !px-3">
                <div className="text-sm mb-0.5 text-orange-300">{s.icon}</div>
                <div className="text-lg sm:text-xl font-black text-white">{s.value}</div>
                <div className="text-[9px] text-stone-400 font-medium uppercase tracking-wide">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── MARQUEE TICKER ─── */}
      <div className="overflow-hidden rounded-2xl bg-stone-900 border border-stone-800">
        <div className="animate-marquee flex whitespace-nowrap gap-16 text-sm font-semibold text-stone-200 py-3.5 px-4">
          {[...Array(2)].map((_, i) => (
            <span key={i} className="flex gap-16">
              <span>Diwali 15% OFF on select paints</span>
              <span className="text-orange-400">✦</span>
              <span>Electrician at your door in 2 hrs</span>
              <span className="text-orange-400">✦</span>
              <span>Plumber for leaks &amp; pipe repair</span>
              <span className="text-orange-400">✦</span>
              <span>Book verified painters online</span>
              <span className="text-orange-400">✦</span>
              <span>AC Service &amp; gas refill</span>
              <span className="text-orange-400">✦</span>
              <span>Home deep cleaning service</span>
              <span className="text-orange-400">✦</span>
              <span>Carpenter for furniture &amp; doors</span>
              <span className="text-orange-400">✦</span>
              <span>Pay on delivery available</span>
              <span className="text-orange-400">✦</span>
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
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
              Book an expert for any home job
            </h2>
            <p className="text-slate-500 text-sm mt-1.5">Vetted professionals · Pay after service · 30-day warranty</p>
          </div>
          <Link to="/services" className="shrink-0 inline-flex items-center gap-1.5 text-sm font-bold text-orange-600 hover:text-orange-700 no-underline border border-orange-200 rounded-xl px-4 py-2 hover:bg-orange-50 transition-all">
            All services →
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {serviceCategories.map((cat, i) => (
            <Link
              key={cat.id}
              to="/services"
              className="group relative card-premium no-underline text-center p-5 flex flex-col items-center gap-3 overflow-hidden"
            >
              {/* color accent top bar */}
              <div className={`absolute top-0 left-0 right-0 h-1 rounded-t-[20px] bg-gradient-to-r ${cat.color}`} />
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform bg-gradient-to-br ${cat.color} bg-opacity-10 shadow-sm`}
                style={{ background: `linear-gradient(135deg, rgba(var(--tw-gradient-from-position),0.1), rgba(var(--tw-gradient-to-position),0.08))` }}
              >
                <span className="text-3xl">{cat.icon}</span>
              </div>
              <div>
                <p className="text-sm font-black text-slate-900 group-hover:text-orange-600 transition-colors leading-tight">{cat.label}</p>
                <p className="text-[10px] text-slate-400 mt-0.5 font-semibold">{cat.services.length} services</p>
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
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">Deals of the week</h2>
            <p className="text-slate-500 text-sm mt-1.5">Hand-picked paints at our best prices this week</p>
          </div>
          <Link to="/products" className="shrink-0 inline-flex items-center gap-1.5 text-sm font-bold text-orange-600 hover:text-orange-700 no-underline border border-orange-200 rounded-xl px-4 py-2 hover:bg-orange-50 transition-all">
            See all →
          </Link>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {dealProducts.map((product) => (
            <ProductCard key={product.id} product={product} compact />
          ))}
        </div>
      </section>

      {/* ─── NEW ARRIVALS ─── */}
      <section>
        <div className="flex items-end justify-between gap-4 mb-7">
          <div>
            <span className="kicker" style={{ color: '#10b981' }}>✨ Just in</span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">New arrivals</h2>
          </div>
          <Link to="/products" className="shrink-0 inline-flex items-center gap-1.5 text-sm font-bold text-orange-600 hover:text-orange-700 no-underline border border-orange-200 rounded-xl px-4 py-2 hover:bg-orange-50 transition-all">
            View catalogue →
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
          {newArrivals.map((product) => (
            <ProductCard key={product.id} product={product} compact />
          ))}
        </div>
      </section>

      {/* ─── TESTIMONIALS ─── */}
      <section className="relative overflow-hidden rounded-3xl p-8 sm:p-12"
        style={{ background: 'linear-gradient(135deg, #fff7ed 0%, #fffbeb 50%, #f0fdf4 100%)' }}
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-200/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-200/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 text-center mb-10">
          <span className="kicker">⭐ Customer stories</span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">Lucknow trusts Digital InfraTech</h2>
          <p className="text-slate-500 text-sm mt-2">Real reviews from real customers across Lucknow</p>
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
              <p className="text-slate-600 text-sm leading-relaxed mb-5 flex-grow italic">
                &ldquo;{item.quote}&rdquo;
              </p>
              <footer className="flex items-center gap-3 pt-4 border-t border-slate-100">
                <span
                  className="w-10 h-10 rounded-full text-white flex items-center justify-center font-black text-sm shadow-sm flex-shrink-0"
                  style={{ background: `linear-gradient(135deg, hsl(${(i * 60 + 20) % 360}, 80%, 55%), hsl(${(i * 60 + 60) % 360}, 80%, 60%))` }}
                >
                  {item.name.charAt(0)}
                </span>
                <div>
                  <cite className="not-italic font-bold text-slate-900 text-sm">{item.name}</cite>
                  <span className="block text-xs text-slate-400 font-medium">{item.area}, Lucknow</span>
                </div>
              </footer>
            </blockquote>
          ))}
        </div>
      </section>

      {/* ─── CTA CARD ─── */}
      <section>
        <div
          className="rounded-3xl p-8 sm:p-10 flex flex-col justify-between relative overflow-hidden min-h-[220px] border border-slate-200"
          style={{ background: 'linear-gradient(135deg, #fff 0%, #f8fafc 100%)' }}
        >
          <div className="absolute bottom-0 right-0 w-48 h-48 bg-emerald-50 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10">
            <span className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 text-xs font-black uppercase tracking-wider px-3 py-1.5 rounded-full mb-4">
              📊 Price transparency
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 mb-2">Download Lucknow price list</h3>
            <p className="text-slate-500 text-sm mb-6 leading-relaxed max-w-sm">Compare rates for primers, putty, emulsions and tools before you order. Always up to date.</p>
            <Link
              to="/price-lists"
              className="self-start inline-flex items-center gap-2 border-2 border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white font-bold px-6 py-3 rounded-2xl no-underline transition-all"
            >
              View price list
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
