import { spotlightProjects, trustStats } from '../../data/siteContent';
import './Projects.css';

const qualityChecks = [
  'Scope review before work starts',
  'Arrival discipline and technician verification',
  'Material and tooling clarity for bigger jobs',
  'Photo-based progress updates for managed work',
  'Cleaner completion and customer sign-off'
];

export default function Projects() {
  return (
    <div className='projects-page'>
      <section className='projects-hero card'>
        <span className='section-kicker'>Project showcase</span>
        <h1>Examples that make the website feel operational, not empty.</h1>
        <p>Project stories help construction, repair and maintenance categories feel believable and large enough for repeat visits.</p>
      </section>

      <section className='projects-grid'>
        {spotlightProjects.map((project) => (
          <article key={project.title} className='project-card card'>
            <img src={project.image} alt={project.title} />
            <div className='project-card-body'>
              <span>{project.location}</span>
              <h3>{project.title}</h3>
              <p>{project.result}</p>
            </div>
          </article>
        ))}
      </section>

      <section className='projects-quality card'>
        <div>
          <span className='section-kicker'>Execution checklist</span>
          <h2>What customers expect once a service site starts feeling real.</h2>
        </div>
        <div className='projects-quality-grid'>
          {qualityChecks.map((item) => (
            <div key={item} className='projects-quality-item'>
              <p>{item}</p>
            </div>
          ))}
        </div>
      </section>

      <section className='projects-stats'>
        {trustStats.map((item) => (
          <div key={item.label} className='projects-stat card'>
            <strong>{item.value}</strong>
            <span>{item.label}</span>
          </div>
        ))}
      </section>
    </div>
  );
}
