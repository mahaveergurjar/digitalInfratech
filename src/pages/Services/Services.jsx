import { useState } from 'react';
import { serviceCategories, money } from '../../data/mockData';
import { useCart } from '../../context/CartContext';

const whyUs = [
  { icon: '✅', title: 'Vetted Experts', text: 'Background-verified & trained professionals only.', color: '#10b981' },
  { icon: '⚡', title: 'Fast Response', text: 'Expert at your door within 2–4 hours, same day.', color: '#f59e0b' },
  { icon: '💳', title: 'Pay After Service', text: 'No upfront — pay only when satisfied.', color: '#8b5cf6' },
  { icon: '🛡️', title: '30-Day Warranty', text: 'All services backed by a 30-day warranty.', color: '#f97316' },
];

export default function Services() {
  const { addToCart } = useCart();
  const [activeTab, setActiveTab] = useState('all');

  const displayed =
    activeTab === 'all'
      ? serviceCategories
      : serviceCategories.filter((c) => c.id === activeTab);

  return (
    <div className="space-y-10">

      {/* ─── HERO ─── */}
      <section
        className="relative overflow-hidden rounded-3xl border border-stone-800/60 surface-dark text-white p-8 sm:p-10 lg:p-12"
      >
        <div className="hero-orb w-[420px] h-[420px] bg-orange-500/12 top-[-100px] right-[-80px]" />
        <div className="hero-orb w-[280px] h-[280px] bg-amber-500/8 bottom-[-60px] left-[-40px]" />

        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 rounded-full px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider mb-5 text-orange-100">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-400" />
            Home Services · Lucknow
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black leading-tight mb-4">
            Book trusted home{' '}
            <span className="gradient-text-orange">service experts</span>
          </h1>

          <p className="text-stone-300 text-base sm:text-lg mb-7 leading-relaxed">
            Electrician, Plumber, Painter, Carpenter, AC Repair &amp; Cleaning — vetted professionals at your doorstep.
          </p>

          <div className="flex flex-wrap gap-2">
            {serviceCategories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveTab(cat.id)}
                className="inline-flex items-center gap-1.5 bg-stone-900/50 hover:bg-stone-900/70 border border-stone-700/60 hover:border-orange-400/40 rounded-lg px-3 py-1.5 text-sm font-semibold text-stone-200 transition-all"
              >
                {cat.icon} {cat.label}
              </button>
            ))}
          </div>
        </div>
      </section>

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
            <h3 className="font-black text-slate-900 text-sm sm:text-base mb-1.5">{item.title}</h3>
            <p className="text-slate-500 text-xs sm:text-sm leading-snug">{item.text}</p>
          </div>
        ))}
      </section>

      {/* ─── FILTER TABS ─── */}
      <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
        <button
          type="button"
          onClick={() => setActiveTab('all')}
          className={`services-tab-btn ${activeTab === 'all' ? 'services-tab-active' : 'services-tab-inactive'}`}
        >
          🏠 All Services
        </button>
        {serviceCategories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setActiveTab(cat.id)}
            className={`services-tab-btn ${activeTab === cat.id ? 'services-tab-active' : 'services-tab-inactive'}`}
          >
            {cat.icon} {cat.label}
          </button>
        ))}
      </div>

      {/* ─── SERVICE SECTIONS ─── */}
      {displayed.map((cat) => (
        <section key={cat.id} className="overflow-hidden rounded-3xl border border-slate-100 shadow-sm">

          {/* Category header */}
          <div className={`relative overflow-hidden px-7 py-7 sm:px-10 sm:py-8 bg-gradient-to-r ${cat.color} text-white`}>
            <div className="absolute right-0 top-0 bottom-0 w-48 opacity-10"
              style={{ background: 'radial-gradient(circle at right, white, transparent)' }}
            />
            <div className="relative z-10 flex items-center gap-4">
              <div className="w-16 h-16 rounded-3xl bg-white/20 backdrop-blur flex items-center justify-center text-4xl shadow-inner border border-white/20 flex-shrink-0">
                {cat.icon}
              </div>
              <div>
                <h2 className="text-2xl sm:text-3xl font-black mb-1">{cat.label}</h2>
                <p className="text-white/80 text-sm font-medium">{cat.description}</p>
              </div>
            </div>
          </div>

          {/* Service cards */}
          <div className="bg-white p-6 sm:p-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
              {cat.services.map((service) => (
                <article
                  key={service.id}
                  className="group relative rounded-2xl border border-slate-100 bg-gradient-to-b from-slate-50 to-white hover:border-slate-200 hover:shadow-xl transition-all p-5 flex flex-col overflow-hidden"
                >
                  {/* Top accent line */}
                  <div className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r ${cat.color} opacity-0 group-hover:opacity-100 transition-opacity`} />

                  {/* Emoji icon */}
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl mb-4 transition-transform group-hover:scale-110 bg-gradient-to-br ${cat.bgLight} ${cat.borderLight} border`}>
                    {service.emoji}
                  </div>

                  <h3 className="font-black text-slate-900 text-base mb-1 leading-tight">{service.name}</h3>
                  <p className="text-slate-500 text-xs mb-4 flex-grow font-medium">{service.summary}</p>

                  <div className={`inline-flex items-center gap-1.5 text-[10px] font-black uppercase px-2.5 py-1.5 rounded-xl mb-4 self-start ${cat.bgLight} ${cat.textColor}`}>
                    {cat.icon} {cat.label}
                  </div>

                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100">
                    <div>
                      <span className="block text-[10px] text-slate-400 uppercase font-bold tracking-wide">From</span>
                      <strong className="text-xl font-black text-slate-900">{money.format(service.price)}</strong>
                    </div>
                    <button
                      type="button"
                      className="bg-gradient-to-r from-slate-900 to-slate-800 group-hover:from-orange-500 group-hover:to-amber-500 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-all shadow-sm hover:shadow-md"
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
      ))}

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
            href="mailto:support@digitalinfratech.in"
            className="inline-flex items-center gap-2.5 bg-white text-orange-600 font-black px-8 py-4 rounded-2xl hover:bg-orange-50 transition-all no-underline shadow-xl hover:shadow-2xl hover:-translate-y-0.5 transform text-base"
          >
            📧 Contact us for free advice
          </a>
        </div>
      </section>

    </div>
  );
}
