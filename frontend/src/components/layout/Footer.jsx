import { Link } from 'react-router-dom';
import { brand, navLinks } from '../../data/siteContent';

export default function Footer() {
  return (
    <footer className="mt-16 bg-gray-900 text-gray-300 pt-12 pb-6 border-t-4 border-orange-500">
      <div className="container mx-auto px-4 lg:px-8 max-w-7xl grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <h3 className="text-white font-bold text-lg mb-2">{brand.name}</h3>
          <p className="text-sm text-gray-400">{brand.tagline}</p>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-3">Explore</h4>
          <div className="flex flex-col gap-2">
            {navLinks.map((item) => (
              <Link key={item.to} to={item.to} className="text-sm text-gray-400 hover:text-orange-400 transition-colors no-underline">
                {item.label}
              </Link>
            ))}
          </div>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-3">Delivery</h4>
          <p className="text-sm text-gray-400">{brand.city} city pricing</p>
          <p className="text-sm text-gray-400">{brand.eta} on selected areas</p>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-3">Contact</h4>
          <p className="text-sm text-gray-400">Digital InfraTech Support</p>
          <p className="text-sm text-gray-400">Lucknow, Uttar Pradesh</p>
        </div>
      </div>
      <div className="container mx-auto px-4 lg:px-8 max-w-7xl mt-8 pt-6 border-t border-gray-800 text-center text-sm text-gray-500">
        © 2026 {brand.name}. Clean product storefront for Lucknow.
      </div>
    </footer>
  );
}
