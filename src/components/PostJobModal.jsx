import { categories } from "../data/jobs";

export default function PostJobModal({
  form,
  updateForm,
  onSubmit,
  onClose,
}) {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <form
        className="job-form"
        onSubmit={onSubmit}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="form-heading">
          <div>
            <span className="eyebrow">GET THE HELP YOU NEED</span>
            <h2>Post a job</h2>
          </div>
          <button type="button" className="close-button" onClick={onClose}>×</button>
        </div>

        <label>
          Job title
          <input name="title" required maxLength={100} value={form.title}
            onChange={updateForm} placeholder="e.g. Need a driver for a day" />
        </label>

        <div className="form-row">
          <label>
            Service category
            <select name="category" value={form.category} onChange={updateForm}>
              {categories.filter((item) => item !== "All Services")
                .map((item) => <option key={item}>{item}</option>)}
            </select>
          </label>
          <label>
            Budget (₹)
            <input name="budget" type="number" min="1" required value={form.budget}
              onChange={updateForm} placeholder="e.g. 1000" />
          </label>
        </div>

        <label>
          Location
          <input name="location" required maxLength={150} value={form.location}
            onChange={updateForm} placeholder="Area or town" />
        </label>
        <label>
          Date and time
          <input name="date" required maxLength={100} value={form.date}
            onChange={updateForm} placeholder="e.g. Tomorrow, 10 AM" />
        </label>
        <label>
          Describe the work
          <textarea name="description" required maxLength={1000} value={form.description}
            onChange={updateForm} placeholder="Explain what needs to be done..." rows="3" />
        </label>
        <label>
          Payment preference
          <select name="payment" value={form.payment} onChange={updateForm}>
            <option>Cash / UPI</option>
            <option>Cash</option>
            <option>UPI</option>
            <option>Online payment</option>
          </select>
        </label>
        <p className="form-note">
          The budget is a proposed amount. Agree on the final price with the worker before work begins.
        </p>
        <button className="button primary submit-button" type="submit">Publish job →</button>
      </form>
    </div>
  );
}