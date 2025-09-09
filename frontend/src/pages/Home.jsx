import { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

function Home() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        console.log("Token being sent:", token);
        const res = await API.get("/entries/mine", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEntries(res.data.items || []);
      } catch (err) {
        console.error("Error fetching entries:", err);
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchEntries();
  }, [token]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this entry?")) return;
    try {
      await API.delete(`/entries/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEntries((prev) => prev.filter((e) => e.id !== id));
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  const handleEdit = (entry) => {
    navigate(`/edit/${entry.id}`, { state: { entry } });
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="container my-4">
      <h2 className="mb-4">My Entries</h2>
      {entries.length === 0 ? (
        <p>No entries found.</p>
      ) : (
        <div className="entries-grid d-flex flex-wrap gap-3">
          {entries.map((entry) => (
            <div
              key={entry.id}
              className="entry-card card shadow-sm"
              style={{ width: "250px" }}
            >
              {entry.poster ? (
                <img
                  src={`http://localhost:4000${entry.poster}`}
                  alt={entry.title}
                  className="card-img-top"
                  style={{
                    height: "180px",
                    objectFit: "cover",
                  }}
                />
              ) : (
                <div
                  className="no-image d-flex align-items-center justify-content-center bg-light text-muted"
                  style={{ height: "180px" }}
                >
                  No Image
                </div>
              )}
            <div className="card-body">
  <h5 className="card-title">{entry.title}</h5>
  <p className="card-text"><strong>Type:</strong> {entry.type}</p>
  {entry.director && <p className="card-text"><strong>Director:</strong> {entry.director}</p>}
  {entry.budget && <p className="card-text"><strong>Budget:</strong> {entry.budget}</p>}
  {entry.location && <p className="card-text"><strong>Location:</strong> {entry.location}</p>}
  {entry.duration && <p className="card-text"><strong>Duration:</strong> {entry.duration}</p>}
  {entry.year && <p className="card-text"><strong>Year:</strong> {entry.year}</p>}
  
  <div className="d-flex justify-content-between mt-2">
    <button
      className="btn btn-sm btn-primary"
      onClick={() => handleEdit(entry)}
    >
      Edit
    </button>
    <button
      className="btn btn-sm btn-danger"
      onClick={() => handleDelete(entry.id)}
    >
      Delete
    </button>
  </div>
</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;
