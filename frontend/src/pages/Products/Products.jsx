import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { featuredProducts } from '../../data/siteContent';
import OrderForm from '../../components/common/OrderForm';

const filters = ['All', 'Putty', 'Primer', 'Tools'];

export default function Products() {
  const [filter, setFilter] = useState('All');
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const products = useMemo(() => {
    return featuredProducts.filter((item) => filter === 'All' || item.category === filter);
  }, [filter]);

  return (
    <div className='page-stack'>
      <section className='section-head'>
        <div>
          <span className='eyebrow'>Products</span>
          <h1>Premium Paint Products</h1>
          <p className='muted'>Authentic paint products with best prices in Lucknow. Fast delivery, guaranteed quality.</p>
        </div>
      </section>

      <div className='filter-row'>
        {filters.map((item) => (
          <button key={item} type='button' className={`filter-chip${filter === item ? ' active' : ''}`} onClick={() => setFilter(item)}>
            {item}
          </button>
        ))}
      </div>

      <section className='product-grid product-grid--wide'>
        {products.map((product) => (
          <div key={product.slug} className='product-card card'>
            <Link to={`/product/${product.slug}`} className='product-card__image product-card__image--tall'>
              <img src={product.image} alt={product.name} />
            </Link>
            <div className='product-card__body'>
              <span className='tag'>{product.category}</span>
              <h3>{product.name}</h3>
              <p>{product.pack}</p>
              <div className='price-row'>
                <strong>₹{product.price}</strong>
                <span>Lucknow base</span>
              </div>
              <div className='product-card__actions'>
                <Link to={`/product/${product.slug}`} className='btn-mini'>Details</Link>
                <button 
                  type='button' 
                  className='btn-mini btn-order'
                  onClick={() => {
                    setSelectedProduct(product);
                    setShowOrderForm(true);
                  }}
                >
                  Order
                </button>
              </div>
            </div>
          </div>
        ))}
      </section>

      {showOrderForm && selectedProduct && (
        <OrderForm 
          product={selectedProduct} 
          onClose={() => {
            setShowOrderForm(false);
            setSelectedProduct(null);
          }}
        />
      )}
    </div>
  );
}
