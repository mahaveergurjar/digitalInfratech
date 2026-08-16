import { Link } from 'react-router-dom';
import { serviceCards } from '../../data/siteContent';

export default function Services() {
  return (
    <div className='page-stack'>
      <section className='section-head'>
        <div>
          <span className='eyebrow'>Services</span>
          <h1>Fast local service cards</h1>
          <p className='muted'>Simple service sections for repairs, site visits and finishing support.</p>
        </div>
      </section>

      <section className='service-grid service-grid--wide'>
        {serviceCards.map((service) => (
          <Link to={`/services/${service.slug}`} key={service.slug} className='service-card card'>
            <img src={service.image} alt={service.name} />
            <div>
              <span className='tag'>From ₹{service.priceFrom}</span>
              <h3>{service.name}</h3>
              <p>{service.summary}</p>
              <div className='price-row'>
                <strong>{service.turnaround}</strong>
                <span>Lucknow support</span>
              </div>
            </div>
          </Link>
        ))}
      </section>
    </div>
  );
}
