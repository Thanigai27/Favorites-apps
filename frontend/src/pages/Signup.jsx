import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function Signup() {
  const [form, setForm] = useState({username:"", email:"", password:""});
  const navigate = useNavigate();

  const onChange = e => setForm(prev => ({...prev, [e.target.name]: e.target.value}));

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await API.post("/auth/signup", form);
      alert("Signup successful!");
      navigate("/login");
    } catch(err) {
      console.error(err);
      alert(err.response?.data?.error || "Signup failed");
    }
  };

  return (
    <div className="container mt-5" style={{maxWidth:400}}>
      <h2 className="mb-4">Signup</h2>
      <form onSubmit={handleSubmit} className="shadow-sm p-4 bg-light rounded">
        <div className="mb-3">
          <label>Username</label>
          <input name="username" className="form-control" value={form.username} onChange={onChange} required/>
        </div>
        <div className="mb-3">
          <label>Email</label>
          <input name="email" type="email" className="form-control" value={form.email} onChange={onChange} required/>
        </div>
        <div className="mb-3">
          <label>Password</label>
          <input name="password" type="password" className="form-control" value={form.password} onChange={onChange} required/>
        </div>
        <button className="btn btn-primary w-100">Signup</button>
      </form>
    </div>
  );
}

export default Signup;
