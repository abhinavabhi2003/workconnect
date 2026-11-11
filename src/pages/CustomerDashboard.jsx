
import { useEffect, useState } from "react";
import { apiRequest } from "../services/api";
import "../styles/WorkerDashboard.css";
export default function CustomerDashboard() {
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({
    serviceCategory: "",
    title: "",
    description: "",
    location: "",
    date: "",
    time: "",
    budget: "",
  });

  // Applicant management states
  const [applicants, setApplicants] = useState({});
  const [expandedJob, setExpandedJob] = useState(null);
  const [applicantLoading, setApplicantLoading] = useState({});
  const [processingId, setProcessingId] = useState(null);
  const [applicationError, setApplicationError] = useState("");

  // Fetch customer's jobs
  async function fetchJobs() {
    try {
      setError("");
      const data = await apiRequest("/customer/jobs");
      setJobs(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchJobs();
  }, []);

  function handleChange(event) {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  }

  // Post a new job
  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!form.date || !form.time) {
      setError("Please select the job date and time.");
      return;
    }

    setSubmitting(true);

    const jobData = {
      serviceCategory: form.serviceCategory,
      title: form.title,
      description: form.description,
      location: form.location,
      scheduledAt: `${form.date}T${form.time}`,
      budget: Number(form.budget),
    };

    try {
      await apiRequest("/customer/jobs", {
        method: "POST",
        body: JSON.stringify(jobData),
      });

      setSuccess("Your job has been posted successfully!");

      setForm({
        serviceCategory: "",
        title: "",
        description: "",
        location: "",
        date: "",
        time: "",
        budget: "",
      });

      await fetchJobs();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  // Fetch applicants for a particular job
  async function fetchApplicants(jobId) {
    setApplicantLoading((prev) => ({
      ...prev,
      [jobId]: true,
    }));

    setApplicationError("");

    try {
      const data = await apiRequest(
        `/customer/applications/job/${jobId}`
      );

      setApplicants((prev) => ({
        ...prev,
        [jobId]: data,
      }));
    } catch (err) {
      setApplicationError(err.message);
    } finally {
      setApplicantLoading((prev) => ({
        ...prev,
        [jobId]: false,
      }));
    }
  }

  // Open or close applicant section
  async function toggleApplicants(jobId) {
    if (expandedJob === jobId) {
      setExpandedJob(null);
      return;
    }

    setExpandedJob(jobId);

    await fetchApplicants(jobId);
  }

  // Accept or reject an application
  async function handleApplicationAction(applicationId, jobId, action) {
    setProcessingId(applicationId);
    setApplicationError("");
    setSuccess("");

    try {
      await apiRequest(
        `/customer/applications/${applicationId}/${action}`,
        {
          method: "PUT",
        }
      );

      setSuccess(
        action === "accept"
          ? "Worker accepted successfully!"
          : "Application rejected successfully!"
      );

      await fetchApplicants(jobId);
      await fetchJobs();
    } catch (err) {
      setApplicationError(err.message);
    } finally {
      setProcessingId(null);
    }
  }

  return (
    <div className="auth-page">
      <div
        className="auth-card"
        style={{ width: "100%", maxWidth: "850px" }}
      >
        <h1>Customer Dashboard</h1>

        <p>
          Welcome, {user?.fullName || "Customer"}!
          Post a job and find the right worker.
        </p>

        <h2>Post a New Job</h2>

        <form onSubmit={handleSubmit}>
          <label>Service Category</label>

          <select
            name="serviceCategory"
            value={form.serviceCategory}
            onChange={handleChange}
            required
          >
            <option value="">Select a service</option>
            <option value="DRIVER">Driver</option>
            <option value="PLUMBER">Plumber</option>
            <option value="ELECTRICIAN">Electrician</option>
            <option value="MECHANIC">Mechanic</option>
            <option value="CARPENTER">Carpenter</option>
            <option value="CLEANER">Cleaner</option>
            <option value="PAINTER">Painter</option>
            <option value="OTHER">Other</option>
          </select>

          <label>Job Title</label>

          <input
            name="title"
            placeholder="Example: Need an electrician"
            value={form.title}
            onChange={handleChange}
            required
          />

          <label>Description</label>

          <textarea
            name="description"
            placeholder="Describe the work..."
            value={form.description}
            onChange={handleChange}
            required
          />

          <label>Location</label>

          <input
            name="location"
            placeholder="Enter job location"
            value={form.location}
            onChange={handleChange}
            required
          />

          <label>Job Date</label>

          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            required
          />

          <label>Job Time</label>

          <input
            type="time"
            name="time"
            value={form.time}
            onChange={handleChange}
            required
          />

          <label>Budget (₹)</label>

          <input
            type="number"
            name="budget"
            placeholder="Enter your budget"
            min="1"
            step="0.01"
            value={form.budget}
            onChange={handleChange}
            required
          />

          {error && (
            <p style={{ color: "red" }}>{error}</p>
          )}

          {success && (
            <p style={{ color: "green" }}>{success}</p>
          )}

          <button
            type="submit"
            className="button primary"
            disabled={submitting}
          >
            {submitting ? "Posting..." : "Post Job"}
          </button>
        </form>

        <hr style={{ margin: "30px 0" }} />

        <h2>My Posted Jobs</h2>

        {loading ? (
          <p>Loading your jobs...</p>
        ) : jobs.length === 0 ? (
          <p>You haven't posted any jobs yet.</p>
        ) : (
          jobs.map((job) => (
            <div
              key={job.jobId}
              style={{
                border: "1px solid #ddd",
                borderRadius: "10px",
                padding: "18px",
                marginBottom: "20px",
                textAlign: "left",
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
                {job.scheduledAt?.replace("T", " ")}
              </p>

              <p>
                <strong>Budget:</strong> ₹{job.budget}
              </p>

              <p>
                <strong>Status:</strong> {job.status}
              </p>

              <button
                type="button"
                className="button primary"
                onClick={() => toggleApplicants(job.jobId)}
              >
                {expandedJob === job.jobId
                  ? "Hide Applicants"
                  : "View Applicants"}
              </button>

              {expandedJob === job.jobId && (
                <div
                  style={{
                    marginTop: "20px",
                    borderTop: "1px solid #ddd",
                    paddingTop: "15px",
                  }}
                >
                  <h3>Applications</h3>

                  {applicantLoading[job.jobId] ? (
                    <p>Loading applicants...</p>
                  ) : applicants[job.jobId]?.length === 0 ? (
                    <p>No workers have applied yet.</p>
                  ) : (
                    applicants[job.jobId]?.map((application) => (
                      <div
                        key={application.applicationId}
                        style={{
                          border: "1px solid #ddd",
                          borderRadius: "8px",
                          padding: "15px",
                          marginBottom: "12px",
                        }}
                      >
                        <h4>{application.workerName}</h4>

                        <p>
                          <strong>Application ID:</strong>{" "}
                          {application.applicationId}
                        </p>

                        <p>
                          <strong>Message:</strong>{" "}
                          {application.message || "No message provided"}
                        </p>

                        <p>
                          <strong>Applied At:</strong>{" "}
                          {application.appliedAt
                            ? application.appliedAt.replace("T", " ")
                            : "Not available"}
                        </p>

                        <p>
                          <strong>Status:</strong>{" "}
                          {application.status}
                        </p>

                        {application.status === "PENDING" &&
                          job.status === "OPEN" && (
                            <div
                              style={{
                                display: "flex",
                                gap: "10px",
                                flexWrap: "wrap",
                              }}
                            >
                              <button
                                type="button"
                                className="button primary"
                                disabled={processingId !== null}
                                onClick={() =>
                                  handleApplicationAction(
                                    application.applicationId,
                                    job.jobId,
                                    "accept"
                                  )
                                }
                              >
                                {processingId === application.applicationId
                                  ? "Processing..."
                                  : "Accept"}
                              </button>

                              <button
                                type="button"
                                className="button"
                                disabled={processingId !== null}
                                onClick={() =>
                                  handleApplicationAction(
                                    application.applicationId,
                                    job.jobId,
                                    "reject"
                                  )
                                }
                              >
                                {processingId === application.applicationId
                                  ? "Processing..."
                                  : "Reject"}
                              </button>
                            </div>
                          )}
                      </div>
                    ))
                  )}

                  {applicationError && (
                    <p style={{ color: "red" }}>
                      {applicationError}
                    </p>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
