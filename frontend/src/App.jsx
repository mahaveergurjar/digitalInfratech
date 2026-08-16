import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const assetModules = import.meta.glob('./assets/*.{png,jpg,jpeg,webp}', {
  eager: true,
  import: 'default',
});

const heroPaint = assetModules['./assets/hero-paint-reference.png'] || Object.values(assetModules)[0];
const servicePainting = assetModules['./assets/service-painting.png'] || heroPaint;

const money = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });

const productNames = [
  'Royal Interior Emulsion',
  'Premium Wall Primer',
  'Exterior Weather Coat',
  'Waterproof Sealant',
  'Wood Finish Enamel',
  'Metal Protector Paint',
  'Acrylic Wall Finish',
  'Anti-Fungal Paint',
  'Designer Wall Colour',
  'High Gloss Enamel',
  'Luxury Interior Paint',
  'Smart Protection Coat',
  'Home Decor Finish',
  'Weather Shield Paint',
  'Bright Wall Primer',
  'Stone Texture Paint',
  'Concrete Seal Coat',
  'Premium Roof Paint',
  'Wallcare Putty',
  'Decorative Finish',
  'Exterior Primer',
  'Waterproof Membrane',
  'Wood Protector',
  'Metal Surface Paint',
  'Emulsion Deluxe',
  'Smooth Finish Paint',
  'Eco Interior Coating',
  'Anti-Scratch Finish',
  'Long Lasting Exterior',
  'Modern Wall Paint',
  'Home Refresh Colour'
];

const uploadedImages = Object.entries(assetModules).map(([key, src], index) => {
  const name = productNames[index % productNames.length];
  const categoryList = ['Interior Paint', 'Exterior Paint', 'Waterproofing', 'Wood & Metal', 'Decorative Finish'];

  return {
    id: `paint-${index + 1}`,
    type: 'product',
    category: categoryList[index % categoryList.length],
    name: name,
    pack: 'Approx. 5L / 10L pack',
    price: 550 + (index % 8) * 220,
    originalPrice: 650 + (index % 9) * 260,
    image: src,
  };
});

const heroSlides = [
  { id: 'hero-1', image: uploadedImages[0]?.image || heroPaint, title: 'Luxury wall finishes', text: 'Diwali 15% OFF on premium painting essentials' },
];

const categories = [
  { id: 'interior', name: 'Interior Finishes', image: uploadedImages[2]?.image || heroPaint },
  { id: 'exterior', name: 'Exterior Protection', image: uploadedImages[3]?.image || heroPaint },
  { id: 'waterproof', name: 'Waterproofing', image: uploadedImages[4]?.image || heroPaint },
  { id: 'wooden', name: 'Wood & Metal', image: uploadedImages[5]?.image || heroPaint },
];

const products = uploadedImages.slice(0, Math.min(uploadedImages.length, 30));

const paintingServices = [
  { id: 'interior-service', type: 'service', name: 'Interior Painting', summary: '2BHK painting package', price: 7999, image: servicePainting },
  { id: 'exterior-service', type: 'service', name: 'Exterior Painting', summary: 'Weatherproof exterior finish', price: 11999, image: uploadedImages[6]?.image || servicePainting },
  { id: 'wall-repair-service', type: 'service', name: 'Wall Repair & Finish', summary: 'Surface prep + premium coating', price: 6999, image: uploadedImages[7]?.image || servicePainting },
];

function App() {
  const navigate = useNavigate();
  const [heroIndex, setHeroIndex] = useState(0);
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [toast, setToast] = useState('');
  const [form, setForm] = useState({ name: '', email: '', phone: '', address: '', city: 'Lucknow', note: '' });

  useEffect(() => {
    if (heroSlides.length <= 1) return undefined;
    const timer = window.setInterval(() => {
      setHeroIndex((current) => (current + 1) % heroSlides.length);
    }, 3200);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!toast) return undefined;
    const timer = window.setTimeout(() => setToast(''), 2600);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const subtotal = useMemo(
    () => cart.reduce((sum, item) => sum + item.price * item.qty, 0),
    [cart]
  );
  const discount = subtotal > 0 ? Math.round(subtotal * 0.15) : 0;
  const total = subtotal - discount;

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const addToCart = (item) => {
    const entry = {
      id: item.id,
      type: item.type,
      name: item.name,
      pack: item.pack || item.summary || 'Painting service',
      price: item.price,
      image: item.image,
      qty: 1,
    };

    setCart((current) => {
      const existing = current.find((cartItem) => cartItem.id === item.id && cartItem.type === item.type);
      if (existing) {
        return current.map((cartItem) =>
          cartItem.id === item.id && cartItem.type === item.type
            ? { ...cartItem, qty: cartItem.qty + 1 }
            : cartItem
        );
      }
      return [...current, entry];
    });

    setCartOpen(true);
    setToast(`${item.name} added to cart`);
  };

  const updateQty = (id, type, change) => {
    setCart((current) =>
      current
        .map((item) => (item.id === id && item.type === type ? { ...item, qty: Math.max(0, item.qty + change) } : item))
        .filter((item) => item.qty > 0)
    );
  };

  const removeItem = (id, type) => {
    setCart((current) => current.filter((item) => !(item.id === id && item.type === type)));
  };

  const openCheckout = () => {
    if (cart.length === 0) {
      setToast('Add a product or service to your cart first');
      return;
    }
    setCheckoutOpen(true);
  };

  const handleSubmitOrder = (event) => {
    event.preventDefault();

    if (!form.name || !form.email || !form.phone || !form.address) {
      setToast('Please enter your name, email, phone, and address');
      return;
    }

    if (cart.length === 0) {
      setToast('Cart is empty');
      return;
    }

    // Open Google Form with cart items
    const GOOGLE_FORM_ID = '1FAIpQLSfDs-mBFJhVVIQq7sDkv3UeCVRre-P5gTIKncZoCdh7_oA0dA';
    const cartItems = cart.map(item => `${item.name} (x${item.qty})`).join(', ');
    
    const baseUrl = `https://docs.google.com/forms/d/e/${GOOGLE_FORM_ID}/viewform`;
    const params = [
      `entry.1012119275=${encodeURIComponent(cartItems)}`,
      `entry.1779012947=${encodeURIComponent(form.name)}`,
      `entry.1501106635=${encodeURIComponent(form.email)}`,
      `entry.8936408891=${encodeURIComponent(form.phone)}`,
      `entry.2195818000=${encodeURIComponent(form.address)}`
    ].join('&');

    const fullUrl = `${baseUrl}?${params}`;
    window.open(fullUrl, '_blank');
    
    // Clear checkout
    setCheckoutOpen(false);
    setCart([]);
    setToast('Opening order form in new tab...');
  };

  return (
    <div className="site-shell">
      <header className="topbar card">
        <button type="button" className="brand brand--minimal" onClick={() => scrollTo('home')}>
          <span className="brand-wordmark" aria-label="Digital InfraTech brand name">
            <span className="brand-wordmark__gold">DIGITAL</span>
            <span className="brand-wordmark__silver">INFRA</span>
            <span className="brand-wordmark__gold">TECH</span>
          </span>
        </button>

        <nav className="topnav" aria-label="Primary navigation">
          <button type="button" onClick={() => scrollTo('home')}>Home</button>
          <button type="button" onClick={() => scrollTo('products')}>Products</button>
          <button type="button" onClick={() => scrollTo('services')}>Services</button>
          <button type="button" onClick={() => setCartOpen(true)}>Cart ({cart.length})</button>
        </nav>

        <div className="topbar__actions">
          <label className="search-box" aria-label="Search products">
            <span className="search-box__icon">⌕</span>
            <input type="search" placeholder="Search paint" aria-label="Search products" />
          </label>
          <button type="button" className="ghost-btn ghost-btn--login" onClick={() => navigate('/login')}>
            Login
          </button>
        </div>
      </header>

      <div className="promo-benefits" aria-label="Benefits">
        <div className="promo-benefit">
          <span className="promo-benefit__icon">📦</span>
          <div>
            <strong>Pay on Delivery</strong>
            <small>Pay after you receive &amp; verify</small>
          </div>
        </div>
        <div className="promo-benefit">
          <span className="promo-benefit__icon">%</span>
          <div>
            <strong>1% Cashback</strong>
            <small>Assured 1% cashback on all orders</small>
          </div>
        </div>
        <div className="promo-benefit">
          <span className="promo-benefit__icon">🚚</span>
          <div>
            <strong>Free Delivery</strong>
            <small>On all orders above 500</small>
          </div>
        </div>
      </div>

      <main className="page-shell">
        <section id="home" className="hero-reference card">
          <div className="hero-reference__badge">
            <span className="brand-mark">🖌️</span>
            <span>LUCKNOW OFFER</span>
          </div>

          <h1 className="hero-reference__title">
            <span className="hero-reference__title-mark">✦</span>
            FREE DELIVERY ON FIRST 3 ORDERS
            <span className="hero-reference__title-mark hero-reference__title-mark--right">✦</span>
          </h1>

          <p className="hero-reference__sub">
            Order Rs. 500+ and get your first deliveries with a cleaner, sharper offer layout.
          </p>

          <div className="hero-reference__grid">
            <article className="hero-offer-card hero-offer-card--feature">
              <div className="hero-offer-card__paint-wrap">
                <img src={uploadedImages[0]?.image || heroPaint} alt="Premium paint tin" />
              </div>
              <div className="hero-offer-card__content">
                <span className="mini-roller">🖌️</span>
                <h3>FIRST 3 ORDERS<br />ABOVE RS. 500</h3>
              </div>
            </article>

            <article className="hero-order-card">
              <div className="order-card__icon">🧾</div>
              <div className="order-card__label">ORDER 1</div>
              <div className="order-card__delivery">🚚</div>
              <div className="order-card__text">FREE DELIVERY</div>
            </article>

            <article className="hero-order-card">
              <div className="order-card__icon">🧾</div>
              <div className="order-card__label">ORDER 2</div>
              <div className="order-card__delivery">🚚</div>
              <div className="order-card__text">FREE DELIVERY</div>
            </article>

            <article className="hero-order-card">
              <div className="order-card__icon">🧾</div>
              <div className="order-card__label">ORDER 3</div>
              <div className="order-card__delivery">🚚</div>
              <div className="order-card__text">FREE DELIVERY</div>
            </article>
          </div>

          <div className="hero-reference__bottom">
            <div className="status-pill">
              <span>✓</span> AUTO APPLIED ON CHECKOUT
            </div>
            <div className="status-pill">
              <span>◉</span> MINIMUM ORDER VALUE RS. 500
            </div>
          </div>
        </section>

        <section className="promo-strip card">
          <span>✓ 15% Diwali Offer</span>
          <span>✓ Trusted painting brands</span>
          <span>✓ Expert service booking</span>
          <span>✓ Lucknow doorstep delivery</span>
        </section>

        <section className="category-section panel card">
          <div className="section-head">
            <div>
              <p className="eyebrow">Categories</p>
              <h2>Explore painting materials</h2>
            </div>
          </div>

          <div className="category-grid">
            {categories.map((category) => (
              <article key={category.id} className="category-card">
                <img src={category.image} alt={category.name} />
                <div className="category-card__body">
                  <h3>{category.name}</h3>
                  <button type="button" className="inline-link" onClick={() => scrollTo('products')}>Browse now</button>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="products" className="panel card">
          <div className="section-head">
            <div>
              <p className="eyebrow">Products</p>
              <h2>All painting products in one place</h2>
            </div>
            <span className="offer-chip">Diwali 15% OFF</span>
          </div>

          <div className="product-grid">
            {products.map((product) => (
              <article key={product.id} className="product-card">
                <div className="product-card__image">
                  <img src={product.image} alt={product.name} />
                  <span className="tag">15% OFF</span>
                </div>
                <div className="product-card__body">
                  <div className="price-line">
                    <strong>{money.format(product.price)}</strong>
                    <span>{money.format(product.originalPrice)}</span>
                  </div>
                  <h3>{product.name}</h3>
                  <p>{product.pack}</p>
                  <div className="card-actions">
                    <button type="button" className="add-btn" onClick={() => addToCart(product)}>Add to cart</button>
                    <button type="button" className="buy-btn" onClick={() => { addToCart(product); setCartOpen(true); }}>Buy now</button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="services" className="panel card">
          <div className="section-head">
            <div>
              <p className="eyebrow">Painting services</p>
              <h2>Book a painting expert</h2>
            </div>
          </div>

          <div className="service-grid">
            {paintingServices.map((service) => (
              <article key={service.id} className="service-card">
                <img src={service.image} alt={service.name} />
                <div className="service-card__body">
                  <span>{service.summary}</span>
                  <h3>{service.name}</h3>
                  <div className="service-footer">
                    <strong>{money.format(service.price)}</strong>
                    <button type="button" className="buy-btn" onClick={() => addToCart(service)}>Book now</button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="features card">
          <article>
            <h3>Premium quality</h3>
            <p>Trusted brands with long-lasting coverage and vibrant colour finish.</p>
          </article>
          <article>
            <h3>Professional service</h3>
            <p>Skilled painters, smooth surface prep, and neat workmanship for every room.</p>
          </article>
          <article>
            <h3>Easy ordering</h3>
            <p>Choose products or service, add to cart, and send your order through email instantly.</p>
          </article>
        </section>

        <section className="info-footer" aria-label="Company footer information">
          <div className="info-footer__store">
            <div className="store-badge">
              <span className="store-badge__small">GET IT ON</span>
              <strong>Google Play</strong>
            </div>
            <div className="store-badge store-badge--apple">
              <span className="store-badge__small">Download on the</span>
              <strong>App Store</strong>
            </div>
          </div>

          <div className="info-footer__column">
            <h3>Company</h3>
            <ul>
              <li>About Us</li>
              <li>Contact</li>
              <li>Price Lists</li>
              <li>Knowledge Hub</li>
              <li>Shop by Category</li>
              <li>FAQ&apos;s</li>
            </ul>
          </div>

          <div className="info-footer__column">
            <h3>Policy</h3>
            <ul>
              <li>Refund Policy</li>
              <li>Privacy Policy</li>
              <li>Terms of Service</li>
              <li>Shipping Policy</li>
            </ul>
          </div>

          <div className="info-footer__column info-footer__column--contact">
            <h3>Contact Information</h3>
            <p>Email: <a href="mailto:mkv9336@gmail.com">mkv9336@gmail.com</a></p>
            <p>Address:</p>
            <p>BBD Lucknow 226028</p>
          </div>
        </section>

        <div className="bottom-strip">
          <p>Get a first peek at New Products, Special Offers, and so much more.</p>
        </div>
      </main>

      <aside className={cartOpen ? 'cart-drawer cart-drawer--open' : 'cart-drawer'}>
        <div className="cart-header">
          <h3>Cart</h3>
          <button type="button" className="close-btn" onClick={() => setCartOpen(false)}>✕</button>
        </div>

        {cart.length === 0 ? (
          <div className="empty-cart">
            <p>Your cart is empty.</p>
            <button type="button" className="primary-btn" onClick={() => scrollTo('products')}>Browse products</button>
          </div>
        ) : (
          <>
            <div className="cart-list">
              {cart.map((item) => (
                <div key={`${item.type}-${item.id}`} className="cart-item">
                  <img src={item.image} alt={item.name} />
                  <div className="cart-item__info">
                    <h4>{item.name}</h4>
                    <p>{item.pack}</p>
                    <div className="qty-box">
                      <button type="button" onClick={() => updateQty(item.id, item.type, -1)}>-</button>
                      <span>{item.qty}</span>
                      <button type="button" onClick={() => updateQty(item.id, item.type, 1)}>+</button>
                    </div>
                  </div>
                  <div className="cart-item__price">
                    <strong>{money.format(item.price * item.qty)}</strong>
                    <button type="button" className="remove-link" onClick={() => removeItem(item.id, item.type)}>Remove</button>
                  </div>
                </div>
              ))}
            </div>

            <div className="cart-summary">
              <div><span>Subtotal</span><strong>{money.format(subtotal)}</strong></div>
              <div><span>Diwali offer</span><strong>- {money.format(discount)}</strong></div>
              <div className="cart-summary__total"><span>Total</span><strong>{money.format(total)}</strong></div>
              <button type="button" className="primary-btn full-width" onClick={openCheckout}>Place order</button>
            </div>
          </>
        )}
      </aside>

      {checkoutOpen ? (
        <div className="modal-backdrop" onClick={() => setCheckoutOpen(false)}>
          <div className="checkout-modal card" onClick={(event) => event.stopPropagation()}>
            <div className="checkout-header">
              <div>
                <p className="eyebrow">Finalize order</p>
                <h3>Place Your Order</h3>
              </div>
              <button type="button" className="close-btn" onClick={() => setCheckoutOpen(false)}>✕</button>
            </div>

            <form className="checkout-form" onSubmit={handleSubmitOrder}>
              <div className="field-grid">
                <label>
                  Full name
                  <input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="Your full name" />
                </label>
                <label>
                  Email
                  <input type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} placeholder="you@example.com" />
                </label>
                <label>
                  Phone
                  <input value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} placeholder="Mobile number" />
                </label>
                <label>
                  City
                  <input value={form.city} onChange={(event) => setForm({ ...form, city: event.target.value })} placeholder="Your city" />
                </label>
              </div>

              <label>
                Delivery Address
                <input value={form.address} onChange={(event) => setForm({ ...form, address: event.target.value })} placeholder="House number and street address" required />
              </label>

              <label>
                Special notes
                <textarea value={form.note} onChange={(event) => setForm({ ...form, note: event.target.value })} rows="4" placeholder="Color preference, room size, service date, etc." />
              </label>

              <div className="checkout-summary-box">
                <h4>Order summary</h4>
                {cart.map((item) => (
                  <div key={`checkout-${item.type}-${item.id}`} className="checkout-line">
                    <span>{item.name} × {item.qty}</span>
                    <strong>{money.format(item.price * item.qty)}</strong>
                  </div>
                ))}
                <div className="checkout-total-line">
                  <span>Discount</span>
                  <strong>- {money.format(discount)}</strong>
                </div>
                <div className="checkout-total-line grand-total">
                  <span>Total</span>
                  <strong>{money.format(total)}</strong>
                </div>
              </div>

              <button type="submit" className="primary-btn full-width">Place Order</button>
            </form>
          </div>
        </div>
      ) : null}

      {toast ? <div className="toast">{toast}</div> : null}
    </div>
  );
}

export default App;
