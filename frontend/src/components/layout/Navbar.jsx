import { NavLink, Link } from 'react-router-dom';
import { brand, navLinks } from '../../data/siteContent';
import { useAuth } from '../../hooks/useAuth';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className='site-header'>
      <div className='site-header__brand'>
        <Link to='/' className='brand-lockup'>
          <span className='brand-mark'>DI</span>
          <span>
            <strong>{brand.name}</strong>
            <small>{brand.city} · {brand.eta}</small>
          </span>
        </Link>
      </div>

      <nav className='site-header__nav'>
        {navLinks.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
            end={item.to === '/'}
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className='site-header__actions'>
        {user ? (
          <>
            <Link to='/dashboard' className='chip chip--soft'>My Account</Link>
            <button type='button' className='chip chip--ghost' onClick={logout}>Logout</button>
          </>
        ) : (
          <Link to='/login' className='chip'>Login</Link>
        )}
      </div>
    </header>
  );
}
