import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { featuredProducts } from '../../data/siteContent';
import OrderForm from '../../components/common/OrderForm';
import PageSeo from '../../components/seo/PageSeo';
import { brand } from '../../data/siteContent';
import { productJsonLd } from '../../config/seo';

export default function ProductDetail() {
  const { id } = useParams();
  const [showOrderForm, setShowOrderForm] = useState(false);
  const product = featuredProducts.find((item) => item.slug === id);

  if (!product) {
    return (
      <>
        <PageSeo title="Product not found" description={`Browse paints in ${brand.city}.`} path="/products" noindex />
        <div className='empty-state card'>
          <h2>Product not found</h2>
          <Link to='/products' className='btn-primary'>Back to products</Link>
        </div>
      </>
    );
  }

  return (
    <>
    <PageSeo
      title={product.name}
      description={`${product.short} Order in ${brand.city} with ${brand.eta}.`}
      path={`/product/${product.slug}`}
      jsonLd={productJsonLd(product)}
    />
    <div className='detail-layout'>
      <section className='detail-media card'>
        <img src={product.image} alt={product.name} />
      </section>

      <section className='detail-copy card'>
        <span className='eyebrow'>{product.category}</span>
        <h1>{product.name}</h1>
        <p>{product.short}</p>
        <div className='detail-price'>
          <strong>₹{product.price}</strong>
          <span>per {product.unit}</span>
        </div>

        <div className='detail-meta'>
          <div>
            <span>Pack</span>
            <strong>{product.pack}</strong>
          </div>
          <div>
            <span>Delivery</span>
            <strong>40 min</strong>
          </div>
          <div>
            <span>Brand note</span>
            <strong>Lucknow price</strong>
          </div>
        </div>

        <div className='pill-row'>
          {product.highlights.map((item) => (
            <span key={item} className='detail-pill'>{item}</span>
          ))}
        </div>

        <div className='hero__actions'>
          <Link to='/products' className='btn-secondary'>Back</Link>
          <button 
            type='button' 
            className='btn-primary'
            onClick={() => setShowOrderForm(true)}
          >
            Order Now
          </button>
        </div>
      </section>

      {showOrderForm && (
        <OrderForm 
          product={product} 
          onClose={() => setShowOrderForm(false)}
        />
      )}
    </div>
    </>
  );
}
