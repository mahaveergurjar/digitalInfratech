export default function PageHero({ image, kicker, title, description, pills = [], actions }) {
  return (
    <section className="page-hero">
      <img src={image} alt="" className="page-hero-image" />
      <div className="page-hero-overlay" aria-hidden="true" />
      <div className="page-hero-content">
        {kicker && <p className="page-hero-kicker">{kicker}</p>}
        <h1 className="page-hero-title">{title}</h1>
        {description && <p className="page-hero-description">{description}</p>}
        {pills.length > 0 && (
          <div className="page-hero-pills">
            {pills.map((pill) => (
              <span key={pill} className="page-hero-pill">{pill}</span>
            ))}
          </div>
        )}
        {actions}
      </div>
    </section>
  );
}
