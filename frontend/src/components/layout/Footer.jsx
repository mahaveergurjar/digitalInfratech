import { Link } from 'react-router-dom';
import { brand, navLinks } from '../../data/siteContent';

export default function Footer() {
  return (
    <footer className='site-footer'>
      <div className='site-footer__inner'>
        <div>
          <h3>{brand.name}</h3>
          <p>{brand.tagline}</p>
        </div>
        <div>
          <h4>Explore</h4>
          {navLinks.map((item) => (
            <Link key={item.to} to={item.to}>{item.label}</Link>
          ))}
        </div>
        <div>
          <h4>Delivery</h4>
          <p>{brand.city} city pricing</p>
          <p>{brand.eta} on selected areas</p>
        </div>
        <div>
          <h4>Contact</h4>
          <p>Digital InfraTech Support</p>
          <p>Lucknow, Uttar Pradesh</p>
        </div>
      </div>
      <div className='site-footer__bottom'>© 2026 {brand.name}. Clean product storefront for Lucknow.</div>
    </footer>
  );
}
