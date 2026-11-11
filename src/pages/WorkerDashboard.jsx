
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../services/api";

export default function WorkerDashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const [profile, setProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [jobs, setJobs] = useState([]);
  const [jobsLoading, setJobsLoading] = useState(true);
  const [jobsError, setJobsError] = useState("");

  const [applications, setApplications] = useState([]);
  const [applicationsLoading, setApplicationsLoading] = useState(true);

  const [applicationMessages, setApplicationMessages] = useState({});
  const [applyingJobId, setApplyingJobId] = useState(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({
    skills: "",
    experienceYears: "",
    serviceCategory: "",
    availability: "",
    bio: "",
  });

  async function fetchProfile() {
    setProfileLoading(true);

    try {
      const data = await apiRequest("/worker/profile");
      setProfile(data);
    } catch (err) {
      setProfile(null);
      setError(err.message);
    } finally {
      setProfileLoading(false);
    }
  }

  async function fetchJobs() {
    setJobsLoading(true);
    setJobsError("");

    try {
      const data = await apiRequest("/worker/jobs");
      setJobs(data || []);
    } catch (err) {
      setJobsError(err.message);
    } finally {
      setJobsLoading(false);
    }
  }

  async function fetchApplications() {
    setApplicationsLoading(true);

    try {
      const data = await apiRequest("/worker/applications");
      setApplications(data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setApplicationsLoading(false);
    }
  }

  useEffect(() => {
    fetchProfile();
    fetchJobs();
    fetchApplications();
  }, []);

  function handleChange(event) {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  }

  async function handleProfileSubmit(event) {
    event.preventDefault();

    setError("");
    setSuccess("");
    setSubmitting(true);

    const profileData = {
      ...form,
      experienceYears: Number(form.experienceYears),
    };

    try {
      const data = await apiRequest("/worker/profile", {
        method: "POST",
        body: JSON.stringify(profileData),
      });

      setProfile(data);
      setSuccess("Worker profile created successfully!");
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleApply(jobId) {
    setError("");
    setSuccess("");
    setApplyingJobId(jobId);

    try {
      await apiRequest("/worker/applications", {
        method: "POST",
        body: JSON.stringify({
          jobId: jobId,
          message: applicationMessages[jobId] || "",
        }),
      });

      setSuccess("Application submitted successfully!");

      setApplicationMessages((previous) => ({
        ...previous,
        [jobId]: "",
      }));

      await Promise.all([fetchJobs(), fetchApplications()]);
    } catch (err) {
      setError(err.message);
    } finally {
      setApplyingJobId(null);
    }
  }

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  }

  function formatDate(date) {
    if (!date) return "Not specified";

    return new Date(date).toLocaleString();
  }

  const appliedJobIds = new Set(
    applications.map((application) => application.jobId)
  );

  return (
    <div className="auth-page worker-dashboard">
      
      <div
        className="auth-card"
        style={{
          width: "100%",
          maxWidth: "1000px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "12px",
          }}
        >
          <h1>Worker Dashboard</h1>

          <div style={{ display: "flex", gap: "10px" }}>
            <button
              className="button primary"
              onClick={() => navigate("/")}
            >
              Home
            </button>

            <button
              className="button"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </div>

        <p>Welcome, {user?.fullName || "Worker"}!</p>

        <hr />

        {/* WORKER PROFILE */}

        <h2>My Worker Profile</h2>

        {profileLoading ? (
          <p>Loading worker profile...</p>
        ) : profile ? (
          <div>
            <p><strong>Name:</strong> {profile.fullName}</p>
            <p><strong>Skills:</strong> {profile.skills}</p>
            <p>
              <strong>Experience:</strong>{" "}
              {profile.experienceYears} years
            </p>
            <p>
              <strong>Service:</strong> {profile.serviceCategory}
            </p>
            <p>
              <strong>Availability:</strong> {profile.availability}
            </p>
            <p>
              <strong>About:</strong> {profile.bio || "Not provided"}
            </p>

            <p style={{ color: "green" }}>
              Your worker profile is ready!
            </p>
          </div>
        ) : (
          <div>
            <p>
              Create your worker profile before applying for jobs.
            </p>

            <form onSubmit={handleProfileSubmit}>
              <label>Skills</label>
              <input
                name="skills"
                placeholder="Example: Plumbing, Pipe repair"
                value={form.skills}
                onChange={handleChange}
                required
              />

              <label>Experience (Years)</label>
              <input
                type="number"
                name="experienceYears"
                min="0"
                placeholder="Enter experience"
                value={form.experienceYears}
                onChange={handleChange}
                required
              />

              <label>Service Category</label>
              <select
                name="serviceCategory"
                value={form.serviceCategory}
                onChange={handleChange}
                required
              >
                <option value="">Select service</option>
                <option value="DRIVER">Driver</option>
                <option value="PLUMBER">Plumber</option>
                <option value="ELECTRICIAN">Electrician</option>
                <option value="MECHANIC">Mechanic</option>
                <option value="CARPENTER">Carpenter</option>
                <option value="CLEANER">Cleaner</option>
                <option value="PAINTER">Painter</option>
                <option value="OTHER">Other</option>
              </select>

              <label>Availability</label>
              <select
                name="availability"
                value={form.availability}
                onChange={handleChange}
                required
              >
                <option value="">Select availability</option>
                <option value="FULL_TIME">Full Time</option>
                <option value="PART_TIME">Part Time</option>
                <option value="WEEKENDS">Weekends</option>
                <option value="FLEXIBLE">Flexible</option>
              </select>

              <label>About You</label>
              <textarea
                name="bio"
                placeholder="Tell customers about your experience..."
                value={form.bio}
                onChange={handleChange}
              />

              <button
                type="submit"
                className="button primary"
                disabled={submitting}
              >
                {submitting ? "Saving..." : "Create Profile"}
              </button>
            </form>
          </div>
        )}

        {error && (
          <p style={{ color: "red" }}>{error}</p>
        )}

        {success && (
          <p style={{ color: "green" }}>{success}</p>
        )}

        <hr />

        {/* AVAILABLE JOBS */}

        <h2>Available Jobs</h2>

        <button
          className="button"
          onClick={fetchJobs}
          disabled={jobsLoading}
        >
          {jobsLoading ? "Loading..." : "Refresh Jobs"}
        </button>

        {jobsLoading ? (
          <p>Loading available jobs...</p>
        ) : jobsError ? (
          <p style={{ color: "red" }}>{jobsError}</p>
        ) : jobs.length === 0 ? (
          <p>No available jobs at the moment.</p>
        ) : (
          jobs.map((job) => (
            <div
              key={job.jobId}
              style={{
                border: "1px solid #ddd",
                borderRadius: "10px",
                padding: "18px",
                marginTop: "15px",
              }}
            >
              <h3>{job.title}</h3>

              <p>
                <strong>Category:</strong> {job.serviceCategory}
              </p>

              <p>
                <strong>Description:</strong> {job.description}
              </p>

              <p>
                <strong>Location:</strong> {job.location}
              </p>

              <p>
                <strong>Scheduled:</strong>{" "}
                {formatDate(job.scheduledAt)}
              </p>

              <p>
                <strong>Budget:</strong> ₹{job.budget}
              </p>

              {appliedJobIds.has(job.jobId) ? (
                <p style={{ color: "green" }}>
                  You have already applied for this job.
                </p>
              ) : (
                <>
                  <label>Application Message (Optional)</label>

                  <textarea
                    placeholder="Tell the customer why you are suitable for this job..."
                    value={applicationMessages[job.jobId] || ""}
                    onChange={(event) =>
                      setApplicationMessages((previous) => ({
                        ...previous,
                        [job.jobId]: event.target.value,
                      }))
                    }
                    disabled={!profile}
                  />

                  <button
                    className="button primary"
                    onClick={() => handleApply(job.jobId)}
                    disabled={
                      !profile ||
                      applyingJobId === job.jobId
                    }
                  >
                    {applyingJobId === job.jobId
                      ? "Applying..."
                      : "Apply for Job"}
                  </button>

                  {!profile && (
                    <p style={{ color: "red" }}>
                      Create your worker profile first to apply.
                    </p>
                  )}
                </>
              )}
            </div>
          ))
        )}

        <hr />

        {/* MY APPLICATIONS */}

        <h2>My Applications</h2>

        <button
          className="button"
          onClick={fetchApplications}
          disabled={applicationsLoading}
        >
          {applicationsLoading ? "Loading..." : "Refresh Applications"}
        </button>

        {applicationsLoading ? (
          <p>Loading your applications...</p>
        ) : applications.length === 0 ? (
          <p>You haven't applied for any jobs yet.</p>
        ) : (
          applications.map((application) => (
            <div
              key={application.applicationId}
              style={{
                border: "1px solid #ddd",
                borderRadius: "10px",
                padding: "15px",
                marginTop: "12px",
              }}
            >
              <h3>Job ID: {application.jobId}</h3>

              <p>
                <strong>Application ID:</strong>{" "}
                {application.applicationId}
              </p>

              <p>
                <strong>Message:</strong>{" "}
                {application.message || "No message"}
              </p>

              <p>
                <strong>Applied At:</strong>{" "}
                {formatDate(application.appliedAt)}
              </p>

              <p>
                <strong>Status:</strong>{" "}
                {application.status}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
