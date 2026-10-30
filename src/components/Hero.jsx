export default function Hero({ setRole, onPostJob }) {
  const findWork = () => {
    setRole("Worker");
    document.getElementById("jobs")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="hero">
      <div className="hero-content">
        <span className="eyebrow">YOUR NEIGHBOURHOOD, CONNECTED</span>
        <h1>
          Need a hand?
          <br />
          <span>Find the right person.</span>
        </h1>
        <p>
          From drivers to electricians, find trusted local professionals
          or discover your next job, all in one place.
        </p>

        <div className="hero-actions">
          <button
            className="button primary"
            onClick={() => {
              setRole("Customer");
              onPostJob();
            }}
          >
            Post a job <span>↗</span>
          </button>
          <button className="button secondary" onClick={findWork}>
            Find work →
          </button>
        </div>

        <div className="trust-row">
          <span>✓ Flexible work</span>
          <span>✓ Local services</span>
          <span>✓ Cash or UPI</span>
        </div>
      </div>

      <div className="hero-art" aria-label="Marketplace overview">
        <div className="art-orbit orbit-one" />
        <div className="art-orbit orbit-two" />
        <div className="hero-center">
          <span className="hero-emoji">🤝</span>
          <strong>Work, made easier.</strong>
          <span>People helping people.</span>
        </div>
        <div className="float-card float-top">
          <span className="float-icon">🚗</span>
          <span><strong>Driver needed</strong><small>Find local work</small></span>
          <span className="online-dot" />
        </div>
        <div className="float-card float-bottom">
          <span className="float-icon">🔧</span>
          <span><strong>Service requested</strong><small>Help is nearby</small></span>
          <span className="online-dot" />
        </div>
      </div>
    </section>
  );
}