import { Link, useParams } from 'react-router-dom';
import { serviceCards } from '../../data/siteContent';

export default function ServiceCategory() {
  const { slug } = useParams();
  const service = serviceCards.find((item) => item.slug === slug);

  if (!service) {
    return (
      <div className='empty-state card'>
        <h2>Category not found</h2>
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
        <span className='eyebrow'>Service category</span>
        <h1>{service.name}</h1>
        <p>{service.summary}</p>
        <div className='pill-row'>
          <span className='detail-pill'>Same day support</span>
          <span className='detail-pill'>Lucknow coverage</span>
          <span className='detail-pill'>Simple booking</span>
        </div>
        <div className='hero__actions'>
          <Link to='/services' className='btn-secondary'>Back</Link>
          <Link to={`/services/${service.slug}`} className='btn-primary'>Open service</Link>
        </div>
      </section>
    </div>
  );
}
