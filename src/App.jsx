import { useMemo, useState } from "react";
import "./styles/main.css";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Stats from "./components/Stats";
import Services from "./components/Services";
import JobsSection from "./components/JobsSection";
import HowItWorks from "./components/HowItWorks";
import Footer from "./components/Footer";
import PostJobModal from "./components/PostJobModal";

import { initialJobs, emptyForm } from "./data/jobs";

function App() {
  const [role, setRole] = useState("Customer");
  const [jobs, setJobs] = useState(initialJobs);
  const [category, setCategory] = useState("All Services");
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [notice, setNotice] = useState("");
  const [form, setForm] = useState(emptyForm);

  const visibleJobs = useMemo(() => {
    return jobs.filter((job) => {
      const matchesCategory =
        category === "All Services" || job.category === category;
      const text = `${job.title} ${job.location} ${job.description}`.toLowerCase();
      return matchesCategory && text.includes(search.toLowerCase());
    });
  }, [jobs, category, search]);

  function updateForm(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  function postJob(event) {
    event.preventDefault();

    const newJob = {
      ...form,
      id: Date.now(),
      budget: Number(form.budget),
      status: "Open",
    };

    setJobs((current) => [newJob, ...current]);
    setCategory("All Services");
    setSearch("");
    setShowForm(false);
    setForm(emptyForm);
    setNotice("Your job has been posted!");
  }

  function acceptJob(id) {
    setJobs((current) =>
      current.map((job) =>
        job.id === id ? { ...job, status: "Accepted" } : job
      )
    );
    setNotice("Job accepted in this demo!");
  }

  return (
    <div className="app">
      <Navbar role={role} setRole={setRole} onPostJob={() => setShowForm(true)} />

      <main id="home">
        <Hero setRole={setRole} onPostJob={() => setShowForm(true)} />
        <Stats jobCount={jobs.length} />
        <Services category={category} setCategory={setCategory} />
        <JobsSection
          role={role}
          category={category}
          setCategory={setCategory}
          search={search}
          setSearch={setSearch}
          visibleJobs={visibleJobs}
          notice={notice}
          setNotice={setNotice}
          onPostJob={() => setShowForm(true)}
          onAccept={acceptJob}
        />
        <HowItWorks />
      </main>

      <Footer />

      {showForm && (
        <PostJobModal
          form={form}
          updateForm={updateForm}
          onSubmit={postJob}
          onClose={() => setShowForm(false)}
        />
      )}
    </div>
  );
}

export default App;