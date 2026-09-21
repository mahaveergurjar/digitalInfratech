import { Link } from "react-router-dom";
import { brand, socialLinks } from "../../data/siteContent";
import SocialIcon from "../common/SocialIcon";
import { getWhatsAppUrl } from "../../utils/whatsapp";
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
    <footer className="text-[#e8d4b0] mt-16 relative overflow-hidden border-t border-[#6b5344] surface-dark">
      <div className="hero-orb w-[420px] h-[420px] bg-[#e8a838]/12 top-[-120px] right-[-80px]" />
      <div className="hero-orb w-[280px] h-[280px] bg-[#ea7a2a]/10 bottom-[-80px] left-[-40px]" />

      <div className="relative border-b border-[#6b5344]/80">
        <div className="container mx-auto px-4 lg:px-8 py-10 max-w-7xl">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
            <div>
              <h3 className="text-xl font-black text-white mb-1">
                Get exclusive offers &amp; updates
              </h3>
              <p className="text-[#c4a882] text-sm">
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
              <img
                src="/logo.png"
                alt="Digital InfraTech"
                className="w-14 h-14 rounded-full shadow-lg shadow-orange-900/30 object-contain bg-[#fff8ed]"
              />
              <span className="text-xl font-black text-white">
                Digital InfraTech
              </span>
            </div>
            <p className="text-sm text-[#c4a882] leading-relaxed mb-4">
              {brand.tagline}. Fast response across {brand.city}.
            </p>
            <p className="text-xs text-[#a08060] font-medium">
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
                    className="text-[#c4a882] hover:text-[#f5c842] no-underline transition-colors font-medium"
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
                <span className="text-[#a08060] font-medium">
                  Interior Emulsion
                </span>
              </li>
              <li>
                <span className="text-[#a08060] font-medium">
                  Exterior Paints
                </span>
              </li>
              <li>
                <span className="text-[#a08060] font-medium">
                  Wall Primers & Putty
                </span>
              </li>
              <li>
                <span className="text-[#a08060] font-medium">
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
                <span className="block text-[#a08060] text-xs font-bold uppercase tracking-wide mb-1">
                  Phone
                </span>
                <a
                  href={`tel:${brand.phone.replace(/\s/g, "")}`}
                  className="text-[#f5c842] hover:text-[#fff3d6] transition-colors font-semibold no-underline"
                >
                  {brand.phone}
                </a>
              </li>
              <li>
                <span className="block text-[#a08060] text-xs font-bold uppercase tracking-wide mb-1">
                  WhatsApp
                </span>
                <a
                  href={getWhatsAppUrl("", brand.whatsapp)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#f5c842] hover:text-[#fff3d6] transition-colors font-semibold no-underline"
                >
                  {brand.whatsapp}
                </a>
              </li>
              <li>
                <span className="block text-[#a08060] text-xs font-bold uppercase tracking-wide mb-1">
                  Email
                </span>
                <a
                  href={`mailto:${brand.supportEmail}`}
                  className="text-[#f5c842] hover:text-[#fff3d6] transition-colors font-semibold no-underline"
                >
                  {brand.supportEmail}
                </a>
              </li>
              <li>
                <span className="block text-[#a08060] text-xs font-bold uppercase tracking-wide mb-1">
                  Address
                </span>
                <address className="text-[#e8d4b0] not-italic leading-relaxed font-medium text-sm">
                  Arjunganj Lucknow
                  <br />
                  Uttar Pradesh {brand.pincode}
                </address>
              </li>
              <li>
                <span className="block text-[#a08060] text-xs font-bold uppercase tracking-wide mb-2">
                  Follow us
                </span>
                <div className="flex flex-wrap gap-3">
                  {socialLinks.map((item) => (
                    <a
                      key={item.id}
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={item.label}
                      aria-label={`${item.label} — Digital InfraTech`}
                      className="w-10 h-10 rounded-xl bg-[#4a3728]/60 border border-[#6b5344]/60 flex items-center justify-center text-[#f5deb3] hover:text-white hover:bg-[#5c4033] hover:border-[#e8a838]/40 transition-colors no-underline"
                    >
                      <SocialIcon name={item.id} />
                    </a>
                  ))}
                </div>
                <a
                  href={brand.website}
                  className="inline-block mt-3 text-xs text-[#c4a882] hover:text-[#f5c842] no-underline transition-colors font-medium"
                >
                  {brand.website.replace(/^https?:\/\//, "")}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-[#6b5344]/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#a08060]">
          <span className="font-medium">
            © {new Date().getFullYear()} {brand.name}. Built for Lucknow
            homeowners &amp; contractors.
          </span>
          <div className="flex gap-5 font-medium">
            <Link
              to="/admin/login"
              className="hover:text-[#e8d4b0] no-underline transition-colors"
            >
              Admin
            </Link>
            <span className="hover:text-[#e8d4b0] cursor-pointer transition-colors">
              Privacy Policy
            </span>
            <span className="hover:text-[#e8d4b0] cursor-pointer transition-colors">
              Terms of Service
            </span>
            <span className="hover:text-[#e8d4b0] cursor-pointer transition-colors">
              Refund Policy
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
