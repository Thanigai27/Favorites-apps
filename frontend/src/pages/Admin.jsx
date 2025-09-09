import React, { useEffect, useState } from "react";
import api from "../api/client";

export default function Admin(){
  const [pending, setPending] = useState([]);

  async function loadPending(){
    try{
      // the backend exposes /entries and admin sees pending because role checked server-side
      const res = await api.get("/entries", { params: { limit: 100 }});
      // pending items are those with approved === false and not deleted
      setPending(res.data.items.filter(i=>!i.approved));
    }catch(err){
      console.error(err);
      alert("Failed to load");
    }
  }

  async function approve(id){
    try{
      await api.put(`/entries/${id}/approve`);
      setPending(p => p.filter(x => x.id !== id));
    }catch(err){ alert("Approve failed"); }
  }

  useEffect(()=>{ loadPending(); }, []);

  return (
    <div className="container">
      <h3>Admin — Approvals</h3>
      <table className="table">
        <thead><tr><th>Title</th><th>Type</th><th>By</th><th>Action</th></tr></thead>
        <tbody>
          {pending.map(p => (
            <tr key={p.id}>
              <td>{p.title}</td>
              <td>{p.type}</td>
              <td>{p.createdById}</td>
              <td><button className="btn btn-success" onClick={()=>approve(p.id)}>Approve</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
