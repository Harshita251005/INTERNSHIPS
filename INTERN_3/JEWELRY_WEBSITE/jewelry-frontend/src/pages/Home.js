import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import "../styles/Home.css";

export default function Home() {
  const { isAuthenticated, isCustomer } = useAuth();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get("/categories");
        setCategories(res.data.slice(0, 3)); // Show only first 3 categories
        setLoadingCategories(false);
      } catch (err) {
        console.error("Error fetching categories:", err);
        setLoadingCategories(false);
      }
    };
    
    fetchCategories();
  }, []);
  
  const features = [
    {
      icon: "💎",
      title: "Premium Quality",
      description: "Handpicked, authentic jewelry pieces"
    },
    {
      icon: "🚚",
      title: "Free Shipping",
      description: "On orders above ₹500"
    },
    {
      icon: "🔒",
      title: "Secure Payment",
      description: "100% safe transactions"
    },
    {
      icon: "↩️",
      title: "Easy Returns",
      description: "30-day money-back guarantee"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      text: "Beautiful jewelry! The quality exceeded my expectations.",
      rating: 5
    },
    {
      name: "Emma Williams",
      text: "Excellent customer service and fast delivery.",
      rating: 5
    },
    {
      name: "Lisa Chen",
      text: "Love the collection! Perfect for every occasion.",
      rating: 5
    }
  ];

  const categoryEmojis = {
    'rings': '💍',
    'earrings': '👂',
    'bangles': '📿',
    'finger rings': '💍',
    'chain pendant': '🔗',
    'necklaces': '🔗',
    'bracelets': '✨',
  };

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>✨ Luxe Jewelry Store ✨</h1>
          <p>Elevate Your Style with Timeless Elegance</p>
          <p className="hero-subtitle">Discover exquisite jewelry pieces crafted with passion and precision</p>
          <div className="hero-buttons">
            {isAuthenticated() && isCustomer() ? (
              <a href="/products" className="btn btn-primary">Shop Now</a>
            ) : (
              <a href="/login" className="btn btn-primary">Login to Shop</a>
            )}
            <a href="/categories" className="btn btn-secondary">Explore Categories</a>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section container">
        <h2 className="section-title">Why Choose Us?</h2>
        <div className="row">
          {features.map((feature, index) => (
            <div key={index} className="col-md-6 col-lg-3 mb-4">
              <div className="feature-box">
                <div className="feature-icon">{feature.icon}</div>
                <h5>{feature.title}</h5>
                <p>{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Collections Preview */}
      <section className="collections-section container">
        <h2 className="section-title">Explore Collections</h2>
        {loadingCategories ? (
          <div className="loading">
            <div className="spinner"></div>
            <p>Loading collections...</p>
          </div>
        ) : categories.length === 0 ? (
          <div className="empty-state">
            <p>No collections available at the moment.</p>
          </div>
        ) : (
          <div className="row">
            {categories.map((category) => (
              <div key={category._id} className="col-md-4 mb-4">
                <div className="collection-card">
                  <div className="collection-image">
                    {category.imageUrl ? (
                      <img
                        src={category.imageUrl}
                        alt={category.name}
                        className="img-fluid"
                      />
                    ) : (
                      <div className="collection-emoji" style={{fontSize: '48px'}}>
                        {categoryEmojis[category.name.toLowerCase()] || '💎'}
                      </div>
                    )}
                  </div>
                  <h4>{category.name}</h4>
                  <p>{category.description || "Explore this collection"}</p>
                  {isAuthenticated() && isCustomer() ? (
                    <a href={`/products?category=${category._id}`} className="btn btn-sm btn-primary">View</a>
                  ) : (
                    <button 
                      className="btn btn-sm btn-primary"
                      onClick={() => navigate('/login')}
                    >
                      Login to View
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="text-center mt-4">
          {isAuthenticated() && isCustomer() ? (
            <a href="/categories" className="btn btn-lg btn-outline-primary">Explore More</a>
          ) : (
            <button className="btn btn-lg btn-outline-primary" onClick={() => navigate('/login')}>Explore More</button>
          )}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section container">
        <h2 className="section-title">Customer Reviews</h2>
        <div className="row">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="col-md-4 mb-4">
              <div className="testimonial-card">
                <div className="testimonial-stars">
                  {"★".repeat(testimonial.rating)}
                </div>
                <p className="testimonial-text">"{testimonial.text}"</p>
                <p className="testimonial-name">- {testimonial.name}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <h2>Ready to Find Your Perfect Piece?</h2>
          <p>Browse our collection and discover timeless jewelry</p>
          {isAuthenticated() && isCustomer() ? (
            <a href="/products" className="btn btn-primary btn-lg">Start Shopping</a>
          ) : (
            <a href="/login" className="btn btn-primary btn-lg">Login to Start Shopping</a>
          )}
        </div>
      </section>
    </div>
  );
}
