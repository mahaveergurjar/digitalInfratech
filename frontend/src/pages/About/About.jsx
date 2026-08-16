import { companyPrinciples, heroContent, trustStats } from '../../data/siteContent';
import './About.css';

export default function About() {
  return (
    <div className='about-page'>
      <section className='about-hero card'>
        <div>
          <span className='section-kicker'>About Harghar</span>
          <h1>Built to feel like a real city-ready home services brand.</h1>
          <p>We shifted the experience away from salon-style placeholders and toward the categories customers actually search for when they need serious home work done.</p>
        </div>
        <img src={heroContent.image} alt='Service professionals at work in a modern home' />
      </section>

      <section className='about-story'>
        <div className='about-story-copy'>
          <span className='section-kicker'>What changed</span>
          <h2>From a light sample layout to a broader marketplace story.</h2>
          <p>Harghar now emphasizes construction, AC servicing, plumbing, electrical support and painting and waterproofing. Those categories better fit a realistic Indian home-services website and create clearer routes for both customers and partners.</p>
          <p>The goal is not only to look bigger, but to help visitors understand scope, trust and service quality faster.</p>
        </div>
        <div className='about-stats-grid'>
          {trustStats.map((item) => (
            <div key={item.label} className='about-stat-card card'>
              <strong>{item.value}</strong>
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className='about-principles'>
        <div className='section-heading'>
          <span className='section-kicker'>Operating principles</span>
          <h2>Three ideas behind the redesign.</h2>
        </div>
        <div className='about-principle-grid'>
          {companyPrinciples.map((item) => (
            <article key={item.title} className='about-principle-card card'>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className='about-coverage card'>
        <div>
          <span className='section-kicker'>Coverage</span>
          <h2>Better suited for apartments, villas, office units and rental turnovers.</h2>
        </div>
        <div className='about-coverage-grid'>
          <div>
            <h3>Residential jobs</h3>
            <p>Everyday repair visits, preventive servicing and finishing work for occupied homes.</p>
          </div>
          <div>
            <h3>Project-based work</h3>
            <p>Renovation, repainting and room upgrades that need better coordination and page depth.</p>
          </div>
          <div>
            <h3>Partner growth</h3>
            <p>Category-specific pages make it easier for specialist technicians to appear credible.</p>
          </div>
        </div>
      </section>

      <section className='about-timeline'>
        <div className='section-heading'>
          <span className='section-kicker'>Journey</span>
          <h2>How the platform is positioned now.</h2>
        </div>
        <div className='about-timeline-list'>
          <article className='card'>
            <h3>Discover</h3>
            <p>Customers now land on category-led cards with strong images and clearer service intent.</p>
          </article>
          <article className='card'>
            <h3>Compare</h3>
            <p>Detail pages help them review deliverables, packages and typical turnaround before booking.</p>
          </article>
          <article className='card'>
            <h3>Convert</h3>
            <p>Partner and signup calls to action are now woven into the public browsing flow more naturally.</p>
          </article>
        </div>
      </section>
    </div>
  );
}
