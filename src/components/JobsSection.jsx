import JobCard from "./JobCard";
import { categories } from "../data/jobs";

export default function JobsSection({
  role,
  category,
  setCategory,
  search,
  setSearch,
  visibleJobs,
  notice,
  setNotice,
  onPostJob,
  onAccept,
}) {
  return (
    <section className="jobs-section section" id="jobs">
      <div className="section-heading jobs-heading">
        <div>
          <span className="eyebrow">
            {role === "Worker" ? "YOUR NEXT OPPORTUNITY" : "LOCAL OPPORTUNITIES"}
          </span>
          <h2>{role === "Worker" ? "Jobs you can take" : "Recently posted jobs"}</h2>
          <p>
            {role === "Worker"
              ? "Find a job that matches your skills and availability."
              : "Browse requests from people who need a helping hand."}
          </p>
        </div>
        {role === "Customer" && (
          <button className="button primary" onClick={onPostJob}>
            + Post a Job
          </button>
        )}
      </div>

      <div className="filters">
        <label className="search-box">
          <span>⌕</span>
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search service or location..."
          />
        </label>
        <select value={category} onChange={(event) => setCategory(event.target.value)}>
          {categories.map((item) => <option key={item}>{item}</option>)}
        </select>
      </div>

      {notice && (
        <div className="notice" role="status">
          {notice}
          <button onClick={() => setNotice("")} aria-label="Dismiss message">×</button>
        </div>
      )}

      <div className="job-grid">
        {visibleJobs.map((job) => (
          <JobCard key={job.id} job={job} role={role} onAccept={onAccept} />
        ))}
      </div>

      {visibleJobs.length === 0 && (
        <div className="empty-state">
          <span>🔎</span>
          <h3>No matching jobs yet</h3>
          <p>Try another category or search term.</p>
          <button
            className="button secondary"
            onClick={() => {
              setCategory("All Services");
              setSearch("");
            }}
          >
            Clear filters
          </button>
        </div>
      )}
    </section>
  );
}