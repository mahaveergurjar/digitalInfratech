import { useState } from 'react';
import './OrderForm.css';

const GOOGLE_FORM_ID = '1FAIpQLSfDs-mBFJhVVIQq7sDkv3UeCVRre-P5gTIKncZoCdh7_oA0dA';

export default function OrderForm({ product, onClose }) {
  const [formData, setFormData] = useState({
    quantity: 1,
    customerName: '',
    email: '',
    phone: '',
    address: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const openGoogleForm = () => {
    try {
      // Build URL directly
      const baseUrl = `https://docs.google.com/forms/d/e/${GOOGLE_FORM_ID}/viewform`;
      const params = [
        `entry.1012119275=${encodeURIComponent(product.name)}`,
        `entry.2082113100=${encodeURIComponent(formData.quantity)}`,
        `entry.1779012947=${encodeURIComponent(formData.customerName)}`,
        `entry.1501106635=${encodeURIComponent(formData.email)}`,
        `entry.8936408891=${encodeURIComponent(formData.phone)}`,
        `entry.2195818000=${encodeURIComponent(formData.address)}`
      ].join('&');

      const fullUrl = `${baseUrl}?${params}`;
      console.log('Opening:', fullUrl);
      
      window.open(fullUrl, '_blank');
      onClose();
    } catch (err) {
      console.error('Error:', err);
      alert('Error opening form. Try again.');
    }
  };

  return (
    <div className='order-form-overlay'>
      <div className='order-form-modal'>
        <div className='order-form-header'>
          <h2>Order {product.name}</h2>
          <button className='close-btn' onClick={onClose}>×</button>
        </div>

        <div className='order-form'>
          <div className='form-group'>
            <label>Product</label>
            <div className='form-value'>{product.name}</div>
            <small>₹{product.price} per {product.unit}</small>
          </div>

          <div className='form-group'>
            <label htmlFor='quantity'>Quantity *</label>
            <input
              id='quantity'
              type='number'
              name='quantity'
              min='1'
              value={formData.quantity}
              onChange={handleChange}
              required
            />
          </div>

          <div className='form-group'>
            <label htmlFor='customerName'>Full Name *</label>
            <input
              id='customerName'
              type='text'
              name='customerName'
              placeholder='Enter your full name'
              value={formData.customerName}
              onChange={handleChange}
              required
            />
          </div>

          <div className='form-group'>
            <label htmlFor='email'>Email *</label>
            <input
              id='email'
              type='email'
              name='email'
              placeholder='your@email.com'
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className='form-group'>
            <label htmlFor='phone'>Phone Number *</label>
            <input
              id='phone'
              type='tel'
              name='phone'
              placeholder='+91 9999999999'
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>

          <div className='form-group'>
            <label htmlFor='address'>Delivery Address *</label>
            <textarea
              id='address'
              name='address'
              placeholder='Enter your complete delivery address'
              value={formData.address}
              onChange={handleChange}
              rows='3'
              required
            />
          </div>

          <div className='form-actions'>
            <button type='button' className='btn-secondary' onClick={onClose}>
              Cancel
            </button>
            <button type='button' className='btn-primary' onClick={openGoogleForm}>
              Place Order
            </button>
          </div>
        </div>

        <div className='form-note'>
          <small>✓ Your details will be sent to our order system</small>
        </div>
      </div>
    </div>
  );
}
