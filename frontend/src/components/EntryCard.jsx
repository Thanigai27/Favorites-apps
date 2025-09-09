export default function EntryCard({ entry }) {
  return (
    <div className="card mb-3" style={{ maxWidth: "540px" }}>
      <div className="row g-0">
        {entry.poster && (
          <div className="col-md-4">
            <img src={`http://localhost:4000${entry.poster}`} className="img-fluid rounded-start" alt={entry.title}/>
          </div>
        )}
        <div className="col-md-8">
          <div className="card-body">
            <h5 className="card-title">{entry.title}</h5>
            <p className="card-text">
              <strong>Type:</strong> {entry.type}<br/>
              <strong>Director:</strong> {entry.director || "-"}<br/>
              <strong>Budget:</strong> {entry.budget || "-"}<br/>
              <strong>Location:</strong> {entry.location || "-"}<br/>
              <strong>Duration:</strong> {entry.duration || "-"}<br/>
              <strong>Year:</strong> {entry.year || "-"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
