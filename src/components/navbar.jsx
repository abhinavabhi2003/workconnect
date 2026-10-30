export default function Navbar({ role, setRole, onPostJob }) {
  return (
    <header className="navbar">
      <a className="brand" href="#home">
        <span className="brand-icon">W</span>
        WorkConnect<span className="brand-dot">.</span>
      </a>

      <nav className="nav-links">
        <a href="#services">Services</a>
        <a href="#jobs">Find Jobs</a>
        <a href="#how">How it works</a>
      </nav>

      <div className="nav-actions">
        <select
          aria-label="Choose demo role"
          value={role}
          onChange={(event) => setRole(event.target.value)}
          className="role-select"
        >
          <option>Customer</option>
          <option>Worker</option>
        </select>
        {role === "Customer" && (
          <button className="button primary small" onClick={onPostJob}>
            + Post a Job
          </button>
        )}
      </div>
    </header>
  );
}