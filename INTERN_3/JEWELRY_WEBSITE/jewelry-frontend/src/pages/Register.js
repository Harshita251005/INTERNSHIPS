import React, { useState } from "react";
import api from "../utils/api";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/users/register", form);
      alert("Registration successful!");
      console.log(res.data);
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "400px" }}>
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
        <input type="text" className="form-control mb-2" placeholder="Name"
               value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        <input type="email" className="form-control mb-2" placeholder="Email"
               value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
        <input type="password" className="form-control mb-2" placeholder="Password"
               value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
        <button type="submit" className="btn btn-dark w-100">Register</button>
      </form>
    </div>
  );
}
