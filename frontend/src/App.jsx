import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AddEntry from "./pages/AddEntry";
import EditEntry from "./pages/EditEntry";

function App() {
  return (
    <>
      <Navbar />
      <div className="container mt-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/add" element={<AddEntry />} />
          <Route path="/edit/:id" element={<EditEntry />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
