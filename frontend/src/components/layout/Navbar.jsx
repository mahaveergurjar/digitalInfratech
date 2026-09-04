import { NavLink, Link } from 'react-router-dom';
import { brand, navLinks } from '../../data/siteContent';
import { useAuth } from '../../hooks/useAuth';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <>
      <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-center py-2 text-sm font-medium tracking-wide">
        Open 8 am to 8 pm all days
      </div>

      <header className="sticky top-0 z-40 bg-white shadow-sm border-b border-gray-100">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-4 py-4">
            <Link to="/" className="flex items-center gap-3 no-underline text-inherit">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-500 text-sm font-black text-white">
                DI
              </span>
              <span className="leading-tight">
                <strong className="block text-base font-black text-gray-900">{brand.name}</strong>
                <small className="block text-xs text-gray-500">{brand.city} · {brand.eta}</small>
              </span>
            </Link>

            <nav className="flex flex-wrap items-center gap-4 sm:gap-6">
              {navLinks.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `text-sm font-semibold transition-colors no-underline ${
                      isActive ? 'text-orange-500' : 'text-gray-700 hover:text-orange-500'
                    }`
                  }
                  end={item.to === '/'}
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>

            <div className="flex items-center gap-3">
              {user ? (
                <>
                  <Link
                    to="/dashboard"
                    className="rounded-full border border-orange-200 bg-orange-50 px-4 py-2 text-sm font-semibold text-orange-700 no-underline transition-colors hover:bg-orange-100"
                  >
                    My Account
                  </Link>
                  <button
                    type="button"
                    className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
                    onClick={logout}
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  className="rounded-full bg-gray-900 px-4 py-2 text-sm font-semibold text-white no-underline transition-colors hover:bg-orange-600"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
