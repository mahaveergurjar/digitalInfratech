import { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { brand, navLinks, searchPlaceholders, quickCategories } from '../../data/siteContent';
import { useCart } from '../../context/CartContext';

export default function SiteHeader() {
  const { cart, setCartOpen } = useCart();
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setPlaceholderIndex((i) => (i + 1) % searchPlaceholders.length);
    }, 2800);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'bg-white/90 backdrop-blur-xl shadow-lg shadow-slate-900/5 border-b border-slate-200/50'
          : 'bg-white border-b border-slate-100'
      }`}
    >
      {/* Top utility bar */}
      <div className="bg-stone-900 text-stone-200 text-xs sm:text-sm border-b border-stone-800">
        <div className="container mx-auto px-4 lg:px-8 py-2 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 sm:gap-5 overflow-x-auto hide-scrollbar">
            <span className="flex items-center gap-2 whitespace-nowrap font-semibold">
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 text-[10px] font-black leading-none shadow-sm shadow-orange-900/30">
                ⚡
              </span>
              <span>Fast 40-min response · {brand.city}</span>
            </span>
            <span className="hidden sm:inline text-slate-600">|</span>
            <span className="hidden sm:flex items-center gap-1.5 whitespace-nowrap text-slate-300">
              📍 Serving pincode <strong className="text-white">{brand.pincode}</strong>
            </span>
          </div>
          <span className="text-slate-400 whitespace-nowrap shrink-0 hidden md:inline font-medium">{brand.hours}</span>
        </div>
      </div>

      {/* Main header row */}
      <div className="container mx-auto px-4 lg:px-8 py-3 sm:py-4">
        <div className="flex items-center gap-3 sm:gap-5">

          {/* Logo */}
          <Link to="/" className="shrink-0 no-underline group" aria-label={brand.shortName}>
            <div className="flex items-center gap-3">
              <div className="relative">
                <span className="w-11 h-11 rounded-2xl bg-gradient-to-br from-orange-500 via-orange-600 to-amber-500 flex items-center justify-center text-white font-black text-sm shadow-lg shadow-orange-500/30 group-hover:shadow-orange-500/50 transition-shadow">
                  DI
                </span>
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-white animate-pulse" />
              </div>
              <div className="hidden sm:block leading-tight">
                <span className="block text-base font-black text-slate-900 tracking-tight">Digital InfraTech</span>
                <span className="block text-[11px] font-semibold text-orange-500">Services & Paints · {brand.city}</span>
              </div>
            </div>
          </Link>

          {/* Search bar */}
          <label className="hidden md:flex flex-1 max-w-2xl items-center gap-3 bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden px-4 focus-within:ring-2 focus-within:ring-orange-400/50 focus-within:border-orange-300 focus-within:bg-white transition-all shadow-sm">
            <span className="text-slate-400 text-lg flex-shrink-0">🔍</span>
            <input
              type="search"
              className="w-full bg-transparent py-3 outline-none text-sm text-slate-800 placeholder:text-slate-400 font-medium"
              placeholder={`Search for ${searchPlaceholders[placeholderIndex]}...`}
              aria-label="Search products and services"
            />
            <span className="shrink-0 bg-orange-500 text-white text-xs font-bold px-3 py-1.5 rounded-xl cursor-pointer hover:bg-orange-600 transition-colors">
              Search
            </span>
          </label>


          {/* Auth + Cart */}
          <div className="flex items-center gap-2 sm:gap-3 ml-auto shrink-0">
            <button
              type="button"
              className="relative flex items-center justify-center w-12 h-12 rounded-2xl bg-stone-900 text-white hover:bg-orange-600 transition-all shadow-md"
              onClick={() => setCartOpen(true)}
              aria-label="Open cart"
            >
              <span className="text-xl">🛒</span>
              {cart.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-gradient-to-br from-rose-500 to-pink-600 text-white text-[10px] font-black h-5 w-5 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                  {cart.length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile search */}
        <label className="md:hidden mt-3 flex items-center gap-2 bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden px-4 focus-within:ring-2 focus-within:ring-orange-400/50">
          <span className="text-slate-400">🔍</span>
          <input
            type="search"
            className="w-full bg-transparent py-2.5 outline-none text-sm font-medium"
            placeholder={`Search ${searchPlaceholders[placeholderIndex]}...`}
            aria-label="Search products"
          />
        </label>
      </div>

      {/* Nav strip */}
      <div className="border-t border-slate-100 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center gap-1 py-2 overflow-x-auto hide-scrollbar">
            {navLinks.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap no-underline transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-sm shadow-orange-300/50'
                      : 'text-slate-600 hover:bg-orange-50 hover:text-orange-600'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
            <span className="w-px h-5 bg-slate-200 mx-2 shrink-0" />
            {quickCategories.slice(0, 8).map((cat) => (
              <Link
                key={cat.id}
                to={cat.to}
                className="px-3 py-2 rounded-xl text-sm font-semibold text-slate-500 hover:bg-orange-50 hover:text-orange-600 whitespace-nowrap no-underline transition-all flex items-center gap-1.5"
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}
