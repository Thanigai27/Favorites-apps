import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

const handleSubmit = async (e) => {
  e.preventDefault();
  try {
   const res = await API.post("/auth/login", { email, password });
localStorage.setItem("token", res.data.token);
alert("Login successful!");
navigate("/");
  } catch (err) {
    console.error(err);
    alert("Login failed");
  }
};


  return (
    <div className="container mt-5" style={{maxWidth:400}}>
      <h2 className="mb-4">Login</h2>
      <form onSubmit={handleSubmit} className="shadow-sm p-4 bg-light rounded">
        <div className="mb-3">
          <label>Email:</label>
          <input type="email" className="form-control" value={email} onChange={e=>setEmail(e.target.value)} required/>
        </div>
        <div className="mb-3">
          <label>Password:</label>
          <input type="password" className="form-control" value={password} onChange={e=>setPassword(e.target.value)} required/>
        </div>
        <button type="submit" className="btn btn-primary w-100">Login</button>
      </form>
    </div>
  );
}

export default Login;
