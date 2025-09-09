import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import API from "../services/api";

function EditEntry() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { id } = useParams();

  const [form, setForm] = useState({
    title: state?.entry?.title || "",
    type: state?.entry?.type || "",
    director: state?.entry?.director || "",
    budget: state?.entry?.budget || "",
    location: state?.entry?.location || "",
    duration: state?.entry?.duration || "",
    year: state?.entry?.year || "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.put(`/entries/${id}`, form); // token handled automatically
      navigate("/");
    } catch (err) {
      console.error(err);
      alert("Update failed");
    }
  };

  return (
    <div className="container" style={{ maxWidth: 720 }}>
      <h3 className="mb-4">Edit Entry</h3>
      <form onSubmit={handleSubmit} className="shadow-sm p-4 bg-light rounded">
        <input
          type="text"
          name="title"
          className="form-control mb-2"
          value={form.title}
          onChange={handleChange}
          placeholder="Title"
          required
        />
        <input
          type="text"
          name="type"
          className="form-control mb-2"
          value={form.type}
          onChange={handleChange}
          placeholder="Type"
          required
        />
        <input
          type="text"
          name="director"
          className="form-control mb-2"
          value={form.director}
          onChange={handleChange}
          placeholder="Director"
        />
        <input
          type="text"
          name="budget"
          className="form-control mb-2"
          value={form.budget}
          onChange={handleChange}
          placeholder="Budget"
        />
        <input
          type="text"
          name="location"
          className="form-control mb-2"
          value={form.location}
          onChange={handleChange}
          placeholder="Location"
        />
        <input
          type="text"
          name="duration"
          className="form-control mb-2"
          value={form.duration}
          onChange={handleChange}
          placeholder="Duration"
        />
        <input
          type="text"
          name="year"
          className="form-control mb-3"
          value={form.year}
          onChange={handleChange}
          placeholder="Year"
        />
        <button className="btn btn-success w-100">Update</button>
      </form>
    </div>
  );
}

export default EditEntry;
