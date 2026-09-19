import { Link, NavLink } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext';

export default function AdminLayout({ title, children }) {
  const { admin, logout } = useAdminAuth();

  const navClass = ({ isActive }) =>
    `text-sm font-semibold px-4 py-2 rounded-xl no-underline transition-colors ${
      isActive
        ? 'bg-orange-600 text-white'
        : 'text-stone-300 hover:text-white hover:bg-stone-800'
    }`;

  return (
    <div className="min-h-screen bg-stone-100">
      <header className="surface-dark border-b border-stone-800">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-black text-white">{title}</h1>
            <p className="text-stone-400 text-sm">{admin?.email}</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <NavLink to="/admin" className={navClass} end>Orders</NavLink>
            <NavLink to="/admin/catalog" className={navClass}>Catalog</NavLink>
            <Link to="/" className="text-sm font-semibold text-stone-300 hover:text-white px-4 py-2 rounded-xl no-underline">
              Store
            </Link>
            <button
              type="button"
              onClick={logout}
              className="text-sm font-semibold text-white bg-orange-600 hover:bg-orange-500 px-4 py-2 rounded-xl transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
