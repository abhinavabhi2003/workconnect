
import { Link, useNavigate } from "react-router-dom";

export default function Navbar({ role, setRole, onPostJob }) {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "null");

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  }

  return (
    <header className="navbar">
      <Link className="brand" to="/">
        <span className="brand-icon">W</span>
        WorkConnect<span className="brand-dot">.</span>
      </Link>

      <nav className="nav-links">
        <a href="#services">Services</a>
        <a href="#jobs">Find Jobs</a>
        <a href="#how">How it works</a>
      </nav>

      <div className="nav-actions">
        {token && user ? (
          <>
            <span className="user-greeting">
              Hi, {user.fullName}
            </span>

            <button
              className="button secondary small"
              onClick={() =>
                navigate(
                  user.role === "CUSTOMER"
                    ? "/customer/dashboard"
                    : "/worker/dashboard"
                )
              }
            >
              Dashboard
            </button>

            <button
              className="button primary small"
              onClick={handleLogout}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="button secondary small">
              Login
            </Link>

            <Link to="/register" className="button primary small">
              Register
            </Link>
          </>
        )}
      </div>
    </header>
  );
}
