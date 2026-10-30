import { serviceCards } from "../data/jobs";

export default function Services({ category, setCategory }) {
  return (
    <section className="services section" id="services">
      <div className="section-heading">
        <div>
          <span className="eyebrow">WHAT DO YOU NEED?</span>
          <h2>One place. Many services.</h2>
          <p>Choose a service to find matching requests.</p>
        </div>
      </div>

      <div className="category-grid">
        {serviceCards.map(([emoji, name]) => (
          <button
            className={`category-card ${category === name ? "selected" : ""}`}
            key={name}
            onClick={() => {
              setCategory(name);
              document.getElementById("jobs")?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            <span className="category-emoji">{emoji}</span>
            <strong>{name}</strong>
            <span className="category-arrow">↗</span>
          </button>
        ))}
      </div>
    </section>
  );
}