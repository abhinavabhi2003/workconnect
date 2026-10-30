export default function Stats({ jobCount }) {
  return (
    <section className="stats">
      <div><strong>{jobCount}</strong><span>Demo job listings</span></div>
      <div><strong>8+</strong><span>Service categories</span></div>
      <div><strong>2</strong><span>Ways to pay</span></div>
    </section>
  );
}