
import { useEffect, useMemo, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import "./styles/main.css";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Stats from "./components/Stats";
import Services from "./components/Services";
import JobsSection from "./components/JobsSection";
import HowItWorks from "./components/HowItWorks";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/Login";
import Register from "./pages/Register";
import CustomerDashboard from "./pages/CustomerDashboard";
import WorkerDashboard from "./pages/WorkerDashboard";

import { apiRequest } from "./services/api";

function Home() {
  const navigate = useNavigate();

  const storedUser = JSON.parse(
    localStorage.getItem("user") || "null"
  );

  const [role, setRole] = useState(
    storedUser?.role === "WORKER" ? "Worker" : "Customer"
  );

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [category, setCategory] = useState("All Services");
  const [search, setSearch] = useState("");
  const [notice, setNotice] = useState("");

  // Fetch real jobs from Spring Boot
  async function fetchJobs() {
    try {
      setError("");

      const data = await apiRequest("/worker/jobs");

      const formattedJobs = data.map((job) => ({
        id: job.jobId,
        category: job.serviceCategory,
        title: job.title,
        description: job.description,
        location: job.location,
        date: job.scheduledAt
          ? job.scheduledAt.replace("T", " ")
          : "Time to be agreed",
        payment: "See proposed budget",
        budget: job.budget,
        status: job.status,
      }));

      setJobs(formattedJobs);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchJobs();
  }, []);

  const visibleJobs = useMemo(() => {
    return jobs.filter((job) => {
      const matchesCategory =
        category === "All Services" ||
        job.category.toLowerCase() === category.toLowerCase();

      const text =
        `${job.title} ${job.location} ${job.description} ${job.category}`
          .toLowerCase();

      return (
        matchesCategory &&
        text.includes(search.toLowerCase())
      );
    });
  }, [jobs, category, search]);

  // Home page Post a Job buttons
  function handlePostJob() {
    const token = localStorage.getItem("token");
    const user = JSON.parse(
      localStorage.getItem("user") || "null"
    );

    if (!token || !user) {
      navigate("/login", {
        state: {
          message: "Please log in as a customer to post a job.",
        },
      });
      return;
    }

    if (user.role !== "CUSTOMER") {
      setNotice("Only customers can post jobs.");
      return;
    }

    navigate("/customer/dashboard");
  }

  function handleWorkerAction() {
    navigate("/worker/dashboard");
  }

  return (
    <div className="app">
      <Navbar
        role={role}
        setRole={setRole}
        onPostJob={handlePostJob}
      />

      <main id="home">
        <Hero
          setRole={setRole}
          onPostJob={handlePostJob}
        />

        <Stats jobCount={jobs.length} />

        <Services
          category={category}
          setCategory={setCategory}
        />

        <JobsSection
          role={role}
          category={category}
          setCategory={setCategory}
          search={search}
          setSearch={setSearch}
          visibleJobs={visibleJobs}
          notice={notice}
          setNotice={setNotice}
          onPostJob={handlePostJob}
          onAccept={handleWorkerAction}
          loading={loading}
          error={error}
        />

        <HowItWorks />
      </main>

      <Footer />
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route path="/login" element={<Login />} />

      <Route path="/register" element={<Register />} />

      <Route
        path="/customer/dashboard"
        element={
          <ProtectedRoute allowedRole="CUSTOMER">
            <CustomerDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/worker/dashboard"
        element={
          <ProtectedRoute allowedRole="WORKER">
            <WorkerDashboard />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
