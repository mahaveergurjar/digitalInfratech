import { Link } from 'react-router-dom';
import { featuredProducts } from '../../data/siteContent';

export default function PriceLists() {
  return (
    <div className='page-stack'>
      <section className='section-head'>
        <div>
          <span className='eyebrow'>Price list</span>
          <h1>Lucknow base pricing</h1>
          <p className='muted'>Quick snapshot for your product categories and starting prices.</p>
        </div>
      </section>

      <section className='price-table card'>
        {featuredProducts.slice(0, 10).map((item) => (
          <div key={item.slug} className='price-table__row'>
            <div>
              <strong>{item.name}</strong>
              <span>{item.pack}</span>
            </div>
            <div>₹{item.price} / {item.unit}</div>
            <Link to={`/product/${item.slug}`}>View</Link>
          </div>
        ))}
      </section>
    </div>
  );
}
