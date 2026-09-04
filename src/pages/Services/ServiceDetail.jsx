import { Link, useParams } from 'react-router-dom';
import { serviceCards } from '../../data/siteContent';

export default function ServiceDetail() {
  const { slug } = useParams();
  const service = serviceCards.find((item) => item.slug === slug);

  if (!service) {
    return (
      <div className='empty-state card'>
        <h2>Service not found</h2>
        <Link to='/services' className='btn-primary'>Back to services</Link>
      </div>
    );
  }

  return (
    <div className='detail-layout'>
      <section className='detail-media card'>
        <img src={service.image} alt={service.name} />
      </section>
      <section className='detail-copy card'>
        <span className='eyebrow'>Service</span>
        <h1>{service.name}</h1>
        <p>{service.summary}</p>
        <div className='detail-price'>
          <strong>From ₹{service.priceFrom}</strong>
          <span>{service.turnaround}</span>
        </div>
        <div className='detail-meta'>
          <div>
            <span>Type</span>
            <strong>{service.type}</strong>
          </div>
          <div>
            <span>Coverage</span>
            <strong>Lucknow city</strong>
          </div>
          <div>
            <span>Booking</span>
            <strong>Phone only</strong>
          </div>
        </div>
        <div className='hero__actions'>
          <Link to='/services' className='btn-secondary'>Back</Link>
          <button type='button' className='btn-primary'>Book now</button>
        </div>
      </section>
    </div>
  );
}
