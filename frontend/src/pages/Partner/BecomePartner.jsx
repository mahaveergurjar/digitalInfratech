import PartnerForm from '../../components/partner/PartnerForm';
import { partnerBenefits, primaryServices } from '../../data/siteContent';
import './BecomePartner.css';

export default function BecomePartner() {
  return (
    <div className='partner-page'>
      <section className='partner-hero card'>
        <div>
          <span className='section-kicker'>Partner with Harghar</span>
          <h1>Grow with a platform that now looks built for real service businesses.</h1>
          <p>Join as a construction crew, AC technician, plumber, electrician or painting specialist and show up in a stronger, more category-led marketplace experience.</p>
        </div>
        <div className='partner-highlight-grid'>
          {partnerBenefits.map((benefit) => (
            <div key={benefit} className='partner-highlight-card'>
              <p>{benefit}</p>
            </div>
          ))}
        </div>
      </section>

      <section className='partner-layout'>
        <div className='partner-services card'>
          <span className='section-kicker'>Active categories</span>
          <h2>Where partners can fit today.</h2>
          <div className='partner-service-list'>
            {primaryServices.map((service) => (
              <div key={service.slug} className='partner-service-item'>
                <img src={service.image} alt={service.name} />
                <div>
                  <h3>{service.name}</h3>
                  <p>{service.tagline}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className='partner-form-wrap card'>
          <h2>Register your service business</h2>
          <PartnerForm />
        </div>
      </section>
    </div>
  );
}
