import { useState } from 'react';
import Input from '../common/Input';
import { createService } from '../../services/partner.service';
import { productCategoryCards, primaryServices } from '../../data/siteContent';
import './PartnerForm.css';

export default function PartnerForm() {
  const [form, setForm] = useState({ name: '', category: '', description: '', price: '' });
  const [result, setResult] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await createService({ ...form, price: parseFloat(form.price || 0) });
      setResult('Service request registered successfully.');
      setForm({ name: '', category: '', description: '', price: '' });
    } catch (err) {
      setResult('Failed to submit partner request.');
    }
  };

  return (
    <div className='partner-page'>
      {/* Product Categories Section */}
      <section className='partner-showcase card'>
        <div className='partner-showcase-head'>
          <span className='section-kicker'>Available Products</span>
          <h2>Add Products to Our Base</h2>
        </div>

        <div className='partner-tile-grid'>
          {productCategoryCards.slice(0, 12).map((item, index) => (
            <div key={`${item.name}-${index}`} className='partner-media-tile'>
              <div className='partner-media-frame'>
                <img src={item.image} alt={item.name} />
              </div>
              <strong>{item.name}</strong>
              <span>{item.note}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Services Section */}
      <section className='partner-showcase card'>
        <div className='partner-showcase-head'>
          <span className='section-kicker'>Available Services</span>
          <h2>Add Services to Our Base</h2>
        </div>

        <div className='partner-tile-grid'>
          {primaryServices.map((service) => (
            <div key={service.slug} className='partner-media-tile'>
              <div className='partner-media-frame'>
                <img src={service.image} alt={service.name} />
              </div>
              <strong>{service.name}</strong>
              <span>{service.priceFrom}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Partner Form */}
      <section className='partner-form-section card'>
        <div className='partner-form-head'>
          <span className='section-kicker'>Become a Partner</span>
          <h2>Register Your Offering</h2>
          <p>Select from above categories or add a new service/product to Harghar.</p>
        </div>

        <form onSubmit={onSubmit} className='partner-form'>
          <Input 
            label='Service/Product Name' 
            value={form.name} 
            onChange={(e) => setForm({ ...form, name: e.target.value })} 
            required 
          />
          <Input 
            label='Category' 
            value={form.category} 
            onChange={(e) => setForm({ ...form, category: e.target.value })} 
            placeholder='e.g., Plumbing, Electrical, Cement'
            required 
          />
          <Input 
            label='Description' 
            value={form.description} 
            onChange={(e) => setForm({ ...form, description: e.target.value })} 
            placeholder='Brief description of your offering'
            required 
          />
          <Input 
            label='Estimated Price (₹)' 
            type='number' 
            value={form.price} 
            onChange={(e) => setForm({ ...form, price: e.target.value })} 
            required 
          />
          <button className='btn partner-submit' type='submit'>Register as Partner</button>
        </form>
        {result && <p className='form-result'>{result}</p>}
      </section>
    </div>
  );
}
