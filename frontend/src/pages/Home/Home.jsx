import { Link } from 'react-router-dom';
import { brand, heroStats, categoryRibbon, categoryCards, featuredProducts, priceHighlights, serviceCards } from '../../data/siteContent';

export default function Home() {
  const featured = featuredProducts.slice(0, 6);
  const servicePreview = serviceCards.slice(0, 3);

  return (
    <div className='page-stack'>
      <section className='hero card'>
        <div className='hero__content'>
          <span className='eyebrow'>{brand.city} paint store</span>
          <h1>{brand.name}</h1>
          <p className='hero__lead'>
            Premium paint products, primers, putty and finishing supplies. All authentic brands with guaranteed quality and 40 min local delivery in Lucknow.
          </p>
          <div className='hero__actions'>
            <Link to='/products' className='btn-primary'>Browse paint products</Link>
            <Link to='/services' className='btn-secondary'>See painting services</Link>
          </div>
          <div className='hero__stats'>
            {heroStats.map((item) => (
              <div key={item.label} className='hero__stat'>
                <strong>{item.value}</strong>
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className='hero__visual'>
          <div className='hero__badge'>40 min delivery</div>
          <div className='hero__stack'>
            {featured.slice(0, 3).map((product, index) => (
              <div key={product.slug} className={`hero__stack-card hero__stack-card--${index + 1}`}>
                <img src={product.image} alt={product.name} />
              </div>
            ))}
          </div>
          <div className='hero__mini-note'>
            <strong>Best prices</strong>
            <span>Premium quality at Lucknow base rates.</span>
          </div>
        </div>
      </section>

      <section className='card ribbon'>
        <div className='ribbon__image'>
          <img src={categoryRibbon.image} alt='Paint categories' />
        </div>
        <div className='ribbon__copy'>
          <span className='eyebrow'>{categoryRibbon.title}</span>
          <h2>{categoryRibbon.subtitle}</h2>
          <div className='category-pills'>
            {categoryCards.map((item) => (
              <div key={item.name} className='category-pill'>
                <strong>{item.name}</strong>
                <span>{item.note}</span>
                <em>{item.accent}</em>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className='section-head'>
        <div>
          <span className='eyebrow'>Paint collection</span>
          <h2>Authentic paint products in all varieties</h2>
        </div>
        <Link to='/products' className='text-link'>View all products →</Link>
      </section>

      <section className='product-grid'>
        {featured.map((product) => (
          <Link to={`/product/${product.slug}`} key={product.slug} className='product-card card'>
            <div className='product-card__image'>
              <img src={product.image} alt={product.name} />
            </div>
            <div className='product-card__body'>
              <span className='tag'>{product.category}</span>
              <h3>{product.name}</h3>
              <p>{product.short}</p>
              <div className='price-row'>
                <strong>₹{product.price}</strong>
                <span>per {product.unit}</span>
              </div>
              <button type='button' className='btn-mini'>View & Buy</button>
            </div>
          </Link>
        ))}
      </section>

      <section className='section-head'>
        <div>
          <span className='eyebrow'>Professional services</span>
          <h2>Expert painting services for your home</h2>
        </div>
        <Link to='/services' className='text-link'>Open services →</Link>
      </section>

      <section className='service-grid'>
        {servicePreview.map((service) => (
          <Link to={`/services/${service.slug}`} key={service.slug} className='service-card card'>
            <img src={service.image} alt={service.name} />
            <div>
              <h3>{service.name}</h3>
              <p>{service.summary}</p>
              <div className='price-row'>
                <strong>From ₹{service.priceFrom}</strong>
                <span>{service.turnaround}</span>
              </div>
            </div>
          </Link>
        ))}
      </section>

      <section className='benefit-bar card'>
        {priceHighlights.map((item) => (
          <div key={item.title} className='benefit-item'>
            <strong>{item.title}</strong>
            <span>{item.text}</span>
          </div>
        ))}
      </section>
    </div>
  );
}
