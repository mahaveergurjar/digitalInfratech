import { Link } from "react-router-dom";
import { brand } from "../../data/siteContent";

const serviceLinks = [
  { label: "⚡ Electrician", to: "/services" },
  { label: "🔧 Plumber", to: "/services" },
  { label: "🖌️ Painter", to: "/services" },
  { label: "🪚 Carpenter", to: "/services" },
  { label: "❄️ AC Repair", to: "/services" },
  { label: "🧹 Cleaning", to: "/services" },
];

export default function SiteFooter() {
  return (
    <footer className="text-stone-300 mt-16 relative overflow-hidden border-t border-stone-800 surface-dark">
      <div className="hero-orb w-[420px] h-[420px] bg-orange-500/10 top-[-120px] right-[-80px]" />
      <div className="hero-orb w-[280px] h-[280px] bg-amber-500/8 bottom-[-80px] left-[-40px]" />

      <div className="relative border-b border-stone-800/80">
        <div className="container mx-auto px-4 lg:px-8 py-10 max-w-7xl">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
            <div>
              <h3 className="text-xl font-black text-white mb-1">
                Get exclusive offers &amp; updates
              </h3>
              <p className="text-stone-400 text-sm">
                Festive deals, new brands, and Lucknow-only discounts.
              </p>
            </div>
            <Link to="/products" className="shrink-0 btn-primary no-underline">
              Shop paints
            </Link>
          </div>
        </div>
      </div>

      {/* Main footer content */}
      <div className="relative container mx-auto px-4 lg:px-8 py-14 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand column */}
          <div>
            <div className="flex items-center gap-3 mb-5">
              <span className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 text-white flex items-center justify-center font-black text-sm shadow-lg shadow-orange-900/30">
                DI
              </span>
              <span className="text-xl font-black text-white">
                Digital InfraTech
              </span>
            </div>
            <p className="text-sm text-stone-400 leading-relaxed mb-4">
              {brand.tagline}. Fast response across {brand.city}.
            </p>
            <p className="text-xs text-stone-500 font-medium">
              📍 Pincode: {brand.pincode}
            </p>
            <p className="text-xs text-stone-500 font-medium mt-1">
              🕗 {brand.hours}
            </p>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-white font-black mb-5 text-sm uppercase tracking-wider">
              Home Services
            </h4>
            <ul className="space-y-3 text-sm">
              {serviceLinks.map((s) => (
                <li key={s.label}>
                  <Link
                    to={s.to}
                    className="text-stone-400 hover:text-orange-400 no-underline transition-colors font-medium"
                  >
                    {s.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Shop */}
          <div>
            <h4 className="text-white font-black mb-5 text-sm uppercase tracking-wider">
              Paint Supplies
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  to="/products"
                  className="text-stone-400 hover:text-orange-400 no-underline transition-colors font-medium"
                >
                  All Products
                </Link>
              </li>
              <li>
                <span className="text-stone-500 font-medium">
                  Interior Emulsion
                </span>
              </li>
              <li>
                <span className="text-stone-500 font-medium">
                  Exterior Paints
                </span>
              </li>
              <li>
                <span className="text-stone-500 font-medium">
                  Wall Primers & Putty
                </span>
              </li>
              <li>
                <span className="text-stone-500 font-medium">
                  Brushes & Tools
                </span>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-black mb-5 text-sm uppercase tracking-wider">
              Contact Us
            </h4>
            <ul className="space-y-4 text-sm">
              <li>
                <span className="block text-stone-500 text-xs font-bold uppercase tracking-wide mb-1">
                  Email
                </span>
                <a
                  href="mailto:rajsonicareer01@gmail.com"
                  className="text-orange-400 hover:text-orange-300 transition-colors font-semibold no-underline"
                >
                  rajsonicareer01@gmail.com
                </a>
              </li>
              <li>
                <span className="block text-stone-500 text-xs font-bold uppercase tracking-wide mb-1">
                  Address
                </span>
                <address className="text-stone-300 not-italic leading-relaxed font-medium text-sm">
                  BBD Lucknow,
                  <br />
                  Uttar Pradesh 226028
                </address>
              </li>
              <li>
                <div className="flex gap-3 mt-2">
                  <span className="w-9 h-9 rounded-xl bg-stone-900/60 border border-stone-700/60 flex items-center justify-center text-sm cursor-pointer hover:bg-stone-800 transition-colors">
                    📘
                  </span>
                  <span className="w-9 h-9 rounded-xl bg-stone-900/60 border border-stone-700/60 flex items-center justify-center text-sm cursor-pointer hover:bg-stone-800 transition-colors">
                    📸
                  </span>
                  <span className="w-9 h-9 rounded-xl bg-stone-900/60 border border-stone-700/60 flex items-center justify-center text-sm cursor-pointer hover:bg-stone-800 transition-colors">
                    💬
                  </span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-stone-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <span className="font-medium">
            © {new Date().getFullYear()} {brand.name}. Built for Lucknow
            homeowners &amp; contractors.
          </span>
          <div className="flex gap-5 font-medium">
            <Link
              to="/admin/login"
              className="hover:text-stone-300 no-underline transition-colors"
            >
              Admin
            </Link>
            <span className="hover:text-stone-300 cursor-pointer transition-colors">
              Privacy Policy
            </span>
            <span className="hover:text-stone-300 cursor-pointer transition-colors">
              Terms of Service
            </span>
            <span className="hover:text-stone-300 cursor-pointer transition-colors">
              Refund Policy
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
