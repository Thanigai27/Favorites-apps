import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function AddEntry() {
  const [form, setForm] = useState({
    title: "",
    type: "Movie",
    director: "",
    budget: "",
    location: "",
    duration: "",
    year: "",
  });
  const [file, setFile] = useState(null);
  const nav = useNavigate();

  const onChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  async function submit(e) {
    e.preventDefault();
    try {
      const data = new FormData();
      Object.entries(form).forEach(([k, v]) => data.append(k, v));
      if (file) data.append("poster", file);

      await API.post("/entries", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Submitted for approval");
      nav("/");
    } catch (err) {
      alert(err.response?.data?.error || "Submit failed");
    }
  }

  return (
    <div className="container" style={{ maxWidth: 720 }}>
      <h3 className="mb-4">Add Entry</h3>
      <form onSubmit={submit} className="shadow-sm p-4 bg-light rounded">
        <input
          name="title"
          className="form-control mb-2"
          value={form.title}
          onChange={onChange}
          placeholder="Title"
          required
        />
        <select
          name="type"
          className="form-select mb-2"
          value={form.type}
          onChange={onChange}
        >
          <option>Movie</option>
          <option>TV Show</option>
        </select>
        <input
          name="director"
          className="form-control mb-2"
          value={form.director}
          onChange={onChange}
          placeholder="Director"
        />
        <input
          name="budget"
          className="form-control mb-2"
          value={form.budget}
          onChange={onChange}
          placeholder="Budget"
        />
        <input
          name="location"
          className="form-control mb-2"
          value={form.location}
          onChange={onChange}
          placeholder="Location"
        />
        <input
          name="duration"
          className="form-control mb-2"
          value={form.duration}
          onChange={onChange}
          placeholder="Duration"
        />
        <input
          name="year"
          className="form-control mb-2"
          value={form.year}
          onChange={onChange}
          placeholder="Year"
        />
        <input
          type="file"
          className="form-control mb-3"
          accept="image/*"
          onChange={(e) => setFile(e.target.files[0])}
        />
        <button className="btn btn-primary w-100">Submit</button>
      </form>
    </div>
  );
}

export default AddEntry;
