
import { money } from "../utils/money";

export default function JobCard({ job, role, onAccept }) {
  const isOpen = job.status === "OPEN";

  const statusClass = isOpen
    ? "open"
    : "accepted";

  return (
    <article className="job-card">
      <div className="job-card-top">
        <span className="job-category">
          {job.category}
        </span>

        <span className={`status ${statusClass}`}>
          {job.status.replaceAll("_", " ")}
        </span>
      </div>

      <h3>{job.title}</h3>

      <p className="job-description">
        {job.description}
      </p>

      <div className="job-detail">
        ⌖ <span>{job.location}</span>
      </div>

      <div className="job-detail">
        ◷ <span>{job.date || "Time to be agreed"}</span>
      </div>

      <div className="job-detail">
        ₹ <span>{job.payment}</span>
      </div>

      <div className="job-card-footer">
        <div>
          <small>Proposed budget</small>
          <strong>{money(job.budget)}</strong>
        </div>

        {role === "Worker" && isOpen ? (
          <button
            className="button primary small"
            onClick={() => onAccept(job.id)}
          >
            View job
          </button>
        ) : role === "Worker" ? (
          <button
            className="button secondary small"
            disabled
          >
            Unavailable
          </button>
        ) : (
          <span className="view-label">
            View details ↗
          </span>
        )}
      </div>
    </article>
  );
}
