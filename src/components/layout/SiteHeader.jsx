import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { brand, navLinks, searchPlaceholders, paintCategories, serviceQuickCategories, paintCategoryLink, serviceCategoryLink, isPaintCategoryActive, isServiceCategoryActive } from '../../data/siteContent';
import { useCart } from '../../context/CartContext';
export default function SiteHeader() {
  const { cart, setCartOpen } = useCart();
  const location = useLocation();
  const navigate = useNavigate();
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const isServicesSection =
    location.pathname.startsWith('/services') || location.pathname.startsWith('/service');
  const isProductsSection =
    location.pathname.startsWith('/products') || location.pathname.startsWith('/product');

  const visibleQuickCategories = isServicesSection
    ? serviceQuickCategories
    : isProductsSection
      ? paintCategories
      : [];

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

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setSearchQuery(params.get('q') || '');
  }, [location.pathname, location.search]);

  const handleSearch = (event) => {
    event.preventDefault();
    const query = searchQuery.trim();
    if (!query) return;
    navigate(`/search?q=${encodeURIComponent(query)}`);
  };

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'bg-[#fffcf7]/92 backdrop-blur-xl shadow-lg shadow-[#c05621]/8 border-b border-[#edd9b8]/80'
          : 'bg-[#fffcf7]/95 border-b border-[#edd9b8]'
      }`}
    >
      {/* Top utility bar */}
      <div className="bg-gradient-to-r from-[#4a3728] via-[#5c4033] to-[#4a3728] text-[#f5deb3] text-xs sm:text-sm border-b border-[#6b5344]">
        <div className="container mx-auto px-4 lg:px-8 py-2 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 sm:gap-5 overflow-x-auto hide-scrollbar">
            <span className="flex items-center gap-2 whitespace-nowrap font-semibold">
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-br from-[#ea7a2a] to-[#e8a838] text-[10px] font-black leading-none shadow-sm shadow-[#c05621]/30">
                ⚡
              </span>
              <span>Fast 40-min response · {brand.city}</span>
            </span>
            <span className="hidden sm:inline text-[#a08060]">|</span>
            <span className="hidden sm:flex items-center gap-1.5 whitespace-nowrap text-[#e8d4b0]">
              📍 Serving pincode <strong className="text-[#fff8ed]">{brand.pincode}</strong>
            </span>
          </div>
          <span className="text-[#c4a882] whitespace-nowrap shrink-0 hidden md:inline font-medium">{brand.hours}</span>
        </div>
      </div>

      {/* Main header */}
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-[1fr_auto] md:grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 md:gap-6 py-3">
          {/* Logo */}
          <Link
            to="/"
            className="col-start-1 row-start-1 shrink-0 no-underline group min-w-0"
            aria-label={brand.shortName}
          >
            <div className="flex items-center gap-2.5 sm:gap-3">
              <img
                src="/logo.png"
                alt="Digital InfraTech"
                className="w-10 h-10 sm:w-11 sm:h-11 rounded-full shadow-md shadow-orange-500/20 group-hover:shadow-orange-500/40 transition-shadow object-contain bg-[#fff8ed] shrink-0"
              />
              <div className="hidden sm:block min-w-0 leading-tight">
                <span className="block text-[15px] sm:text-base font-black text-[#4a3728] tracking-tight truncate">
                  Digital InfraTech
                </span>
                <span className="block text-[10px] sm:text-[11px] font-semibold text-[#c05621] truncate">
                  Home Services & Paints · {brand.city}
                </span>
              </div>
            </div>
          </Link>

          {/* Search bar — desktop */}
          <form
            onSubmit={handleSearch}
            className="hidden md:flex col-start-2 row-start-1 w-full max-w-xl mx-auto h-11 items-center gap-2.5 bg-[#fff8ed] rounded-xl border border-[#edd9b8] px-3 focus-within:ring-2 focus-within:ring-[#e8a838]/40 focus-within:border-[#e8a838] focus-within:bg-[#fffcf7] transition-all"
          >
            <span className="text-[#a08060] text-base shrink-0" aria-hidden="true">🔍</span>
            <input
              type="search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              className="w-full min-w-0 bg-transparent py-2 outline-none text-sm text-[#4a3728] placeholder:text-[#a08060] font-medium"
              placeholder={`Search for ${searchPlaceholders[placeholderIndex]}...`}
              aria-label="Search products and services"
            />
            <button
              type="submit"
              className="shrink-0 bg-gradient-to-r from-[#ea7a2a] to-[#d97706] text-white text-xs font-bold px-3.5 py-1.5 rounded-lg hover:brightness-105 transition-all"
            >
              Search
            </button>
          </form>

          {/* Cart */}
          <button
            type="button"
            className="col-start-2 md:col-start-3 row-start-1 relative flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-[#4a3728] to-[#5c4033] text-white hover:from-[#ea7a2a] hover:to-[#d97706] transition-all shadow-md shrink-0 justify-self-end"
            onClick={() => setCartOpen(true)}
            aria-label="Open cart"
          >
            <span className="text-lg">🛒</span>
            {cart.length > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-gradient-to-br from-rose-500 to-pink-600 text-white text-[10px] font-black h-5 w-5 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                {cart.length}
              </span>
            )}
          </button>
        </div>

        {/* Mobile search */}
        <form
          onSubmit={handleSearch}
          className="md:hidden pb-3 flex h-10 items-center gap-2 bg-[#fff8ed] rounded-xl border border-[#edd9b8] px-3 focus-within:ring-2 focus-within:ring-[#e8a838]/40"
        >
          <span className="text-[#a08060] shrink-0" aria-hidden="true">🔍</span>
          <input
            type="search"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            className="w-full min-w-0 bg-transparent py-2 outline-none text-sm font-medium"
            placeholder={`Search ${searchPlaceholders[placeholderIndex]}...`}
            aria-label="Search products"
          />
        </form>

        {/* Nav strip */}
        <nav className="border-t border-[#edd9b8] -mx-4 px-4 lg:-mx-8 lg:px-8">
          <div className="flex items-center gap-1 py-2 overflow-x-auto hide-scrollbar">
            {navLinks.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  `px-3.5 py-1.5 rounded-lg text-sm font-bold whitespace-nowrap no-underline transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-[#ea7a2a] to-[#e8a838] text-white shadow-sm shadow-[#c05621]/30'
                      : 'text-[#6b5344] hover:bg-[#fff3d6] hover:text-[#c05621]'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
            {visibleQuickCategories.length > 0 && (
              <>
                <span className="w-px h-4 bg-[#edd9b8] mx-1.5 shrink-0" />
                {visibleQuickCategories.map((cat) => {
                  const categoryTo = isServicesSection ? serviceCategoryLink(cat) : paintCategoryLink(cat);
                  const isActive = isServicesSection
                    ? isServiceCategoryActive(cat, location.search)
                    : isPaintCategoryActive(cat, location.search);

                  return (
                  <Link
                    key={cat.id}
                    to={categoryTo}
                    className={`px-2.5 py-1.5 rounded-lg text-sm font-semibold whitespace-nowrap no-underline transition-all flex items-center gap-1.5 ${
                      isActive
                        ? 'bg-[#fff3d6] text-[#c05621] border border-[#edd9b8]'
                        : 'text-[#8b7355] hover:bg-[#fff3d6] hover:text-[#c05621]'
                    }`}
                  >
                    <span>{cat.icon}</span>
                    <span>{cat.label}</span>
                  </Link>
                  );
                })}
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
