import { useNavigate, useParams } from 'react-router-dom';
import { useState, useMemo } from 'react';
import { productCatalog, primaryServices } from '../../data/siteContent';
import { useAuth } from '../../hooks/useAuth';
import Input from '../../components/common/Input';
import './Checkout.css';

export default function Checkout({ type = 'product' }) {
  const { id, slug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    email: user?.email || '',
    address: '',
    apartment: '',
    city: 'Lucknow',
    state: 'Uttar Pradesh',
    pincode: '',
    quantity: 1
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  const item = useMemo(() => {
    if (type === 'product') {
      return productCatalog.find((p) => p.id === parseInt(id));
    } else {
      return primaryServices.find((s) => s.slug === slug);
    }
  }, [id, slug, type]);

  if (!item) {
    return (
      <div className='checkout-page error-page'>
        <div className='error-container card'>
          <h2>Item Not Found</h2>
          <p>The item you're trying to checkout doesn't exist.</p>
          <button className='btn' onClick={() => navigate('/')}>Go Home</button>
        </div>
      </div>
    );
  }

  const calculateTotal = () => {
    if (type === 'product') {
      return item.price * form.quantity;
    }
    return item.priceFrom ? parseInt(item.priceFrom.replace(/[^\d]/g, '')) : 0;
  };

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!form.address.trim() || !form.pincode.trim()) {
      setError('Please fill in all address details');
      return;
    }

    setIsProcessing(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      // Here you would typically make an API call to create the order
      console.log('Order Details:', {
        type,
        item,
        form,
        total: calculateTotal()
      });

      // Redirect to order confirmation or dashboard
      navigate('/dashboard', { 
        state: { 
          orderPlaced: true,
          itemName: item.name,
          orderTotal: calculateTotal()
        }
      });
    } catch (err) {
      setError('Failed to place order. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const total = calculateTotal();
  const delivery = total > 1000 ? 'FREE' : 60;
  const finalTotal = typeof delivery === 'number' ? total + delivery : total;

  return (
    <div className='checkout-page'>
      <section className='checkout-container'>
        <div className='checkout-form-section card'>
          <div className='checkout-header'>
            <h1>Checkout</h1>
            <span className='checkout-type'>{type === 'product' ? 'Purchase' : 'Book Service'}</span>
          </div>

          <form onSubmit={handleSubmit} className='checkout-form'>
            {error && <div className='error-message'>{error}</div>}

            <fieldset>
              <legend>Delivery Address</legend>
              <Input
                label='Full Name'
                value={form.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder='Your name'
                required
              />
              <Input
                label='Phone Number'
                value={form.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                placeholder='10-digit mobile number'
                required
              />
              <Input
                label='Email'
                value={form.email}
                onChange={(e) => handleChange('email', e.target.value)}
                type='email'
                placeholder='your@email.com'
                required
              />
              <Input
                label='Street Address'
                value={form.address}
                onChange={(e) => handleChange('address', e.target.value)}
                placeholder='House number and street name'
                required
              />
              <Input
                label='Apartment/Suite (Optional)'
                value={form.apartment}
                onChange={(e) => handleChange('apartment', e.target.value)}
                placeholder='Apartment, suite, etc.'
              />
              
              <div className='address-row'>
                <div className='form-group'>
                  <label>City</label>
                  <select 
                    value={form.city}
                    onChange={(e) => handleChange('city', e.target.value)}
                    className='form-select'
                  >
                    <option value='Lucknow'>Lucknow</option>
                    <option value='Faizabad'>Faizabad</option>
                    <option value='Kanpur'>Kanpur</option>
                  </select>
                </div>
                <div className='form-group'>
                  <label>State</label>
                  <select 
                    value={form.state}
                    onChange={(e) => handleChange('state', e.target.value)}
                    className='form-select'
                  >
                    <option value='Uttar Pradesh'>Uttar Pradesh</option>
                    <option value='Bihar'>Bihar</option>
                    <option value='Jharkhand'>Jharkhand</option>
                  </select>
                </div>
                <div className='form-group'>
                  <label>Pincode</label>
                  <input
                    type='text'
                    value={form.pincode}
                    onChange={(e) => handleChange('pincode', e.target.value)}
                    placeholder='6-digit pincode'
                    className='form-input'
                    required
                  />
                </div>
              </div>
            </fieldset>

            {type === 'product' && (
              <fieldset>
                <legend>Quantity</legend>
                <div className='quantity-selector'>
                  <button
                    type='button'
                    onClick={() => handleChange('quantity', Math.max(1, form.quantity - 1))}
                    className='qty-btn'
                  >
                    −
                  </button>
                  <input
                    type='number'
                    value={form.quantity}
                    onChange={(e) => handleChange('quantity', Math.max(1, parseInt(e.target.value) || 1))}
                    className='qty-input'
                    min='1'
                  />
                  <button
                    type='button'
                    onClick={() => handleChange('quantity', form.quantity + 1)}
                    className='qty-btn'
                  >
                    +
                  </button>
                </div>
              </fieldset>
            )}

            <button 
              type='submit'
              className='btn btn-checkout'
              disabled={isProcessing}
            >
              {isProcessing ? 'Processing...' : 'Place Order'}
            </button>
          </form>
        </div>

        <div className='checkout-summary card'>
          <div className='summary-header'>
            <h2>Order Summary</h2>
          </div>

          <div className='summary-item'>
            <div className='item-image'>
              <img src={item.image} alt={item.name} />
            </div>
            <div className='item-details'>
              <strong>{item.name}</strong>
              <span className='item-category'>
                {type === 'product' ? item.category : item.coverage}
              </span>
              {type === 'product' && (
                <span className='item-pack'>{item.pack}</span>
              )}
            </div>
          </div>

          <div className='summary-pricing'>
            <div className='pricing-row'>
              <span>Subtotal</span>
              <strong>Rs. {total}</strong>
            </div>
            {type === 'product' && (
              <div className='pricing-row'>
                <span>Quantity: {form.quantity}</span>
              </div>
            )}
            <div className='pricing-row'>
              <span>Delivery</span>
              <strong>{typeof delivery === 'string' ? delivery : `Rs. ${delivery}`}</strong>
            </div>

            {total > 1000 && (
              <div className='discount-badge'>
                ✓ Free delivery on orders above Rs. 1000
              </div>
            )}
          </div>

          <div className='summary-total'>
            <span>Total Amount</span>
            <strong className='total-amount'>Rs. {finalTotal}</strong>
          </div>

          <div className='delivery-info'>
            <div className='info-item'>
              <span className='info-icon'>🚚</span>
              <span>60 min fast delivery in selected areas</span>
            </div>
            <div className='info-item'>
              <span className='info-icon'>🔄</span>
              <span>7-day easy returns</span>
            </div>
            <div className='info-item'>
              <span className='info-icon'>✓</span>
              <span>100% genuine products</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
