import React from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4">
      <Link className="navbar-brand" to="/">💎 Jewelry Store</Link>
      <div className="navbar-nav">
        <Link className="nav-link" to="/products">Products</Link>
        <Link className="nav-link" to="/categories">Categories</Link>
        <Link className="nav-link" to="/login">Login</Link>
        <Link className="nav-link" to="/register">Register</Link>
      </div>
    </nav>
  );
}
