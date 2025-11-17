import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/Navbar.css";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout, isShopkeeper, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
    setIsOpen(false);
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark">
      <div className="container-fluid px-4">
        <Link className="navbar-brand" to="/" onClick={() => setIsOpen(false)}>
          ✨ Luxe Jewelry Store ✨
        </Link>
        <button 
          className="navbar-toggler" 
          type="button" 
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className={`collapse navbar-collapse ${isOpen ? 'show' : ''}`} id="navbarNav">
          <div className="navbar-nav ms-auto">
            <Link className="nav-link" to="/" onClick={() => setIsOpen(false)}>Home</Link>
            <Link className="nav-link" to="/products" onClick={() => setIsOpen(false)}>Products</Link>
            <Link className="nav-link" to="/categories" onClick={() => setIsOpen(false)}>Categories</Link>
            
            {isShopkeeper() && (
              <Link className="nav-link" to="/dashboard" onClick={() => setIsOpen(false)}>
                📊 Dashboard
              </Link>
            )}

            {isAuthenticated() && (
              <>
                <Link className="nav-link" to="/cart" onClick={() => setIsOpen(false)}>
                  🛒 Cart
                </Link>
                <Link className="nav-link" to="/orders" onClick={() => setIsOpen(false)}>
                  📦 My Orders
                </Link>
                <Link className="nav-link" to="/profile" onClick={() => setIsOpen(false)}>
                  👤 Profile
                </Link>
                <div className="nav-link dropdown">
                  <span className="user-menu">
                    👤 {user?.name}
                  </span>
                  <div className="dropdown-menu">
                    <button 
                      className="dropdown-item logout-btn"
                      onClick={handleLogout}
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </>
            )}

            {!isAuthenticated() && (
              <>
                <Link className="nav-link auth-link" to="/login" onClick={() => setIsOpen(false)}>
                  Login
                </Link>
                <Link className="nav-link auth-link register" to="/register" onClick={() => setIsOpen(false)}>
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
