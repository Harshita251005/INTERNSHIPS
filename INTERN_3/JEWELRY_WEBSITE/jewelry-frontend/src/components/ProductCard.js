import React from "react";
import { useAuth } from "../context/AuthContext";
import "../styles/ProductCard.css";

export default function ProductCard({ product }) {
  const { isAuthenticated, isCustomer } = useAuth();

  const handleAddToCart = () => {
    if (!isAuthenticated()) {
      alert("Please login to add items to cart");
      return;
    }

    if (!product.stock || product.stock <= 0) {
      alert(`❌ This product (${product.name}) is out of stock. Please check back later!`);
      return;
    }

    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existingItem = cart.find(item => item._id === product._id);

    if (existingItem) {
      if (existingItem.quantity >= product.stock) {
        alert(`Only ${product.stock} items available in stock`);
        return;
      }
      existingItem.quantity += 1;
    } else {
      cart.push({
        ...product,
        quantity: 1
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    alert("Added to cart!");
  };

  const getStockBadge = () => {
    if (!product.stock || product.stock === 0) {
      return <span className="stock-badge out-of-stock">Out of Stock</span>;
    }
    if (product.stock < 5) {
      return <span className="stock-badge low-stock">Only {product.stock} left!</span>;
    }
    return <span className="stock-badge in-stock">In Stock</span>;
  };

  return (
    <div className="product-card-wrapper">
      <div className="product-card">
        <div className="product-image">
          <img 
            src={product.imageUrl || "https://via.placeholder.com/300x300?text=Jewelry"} 
            alt={product.name} 
            className="img-fluid"
          />
          {getStockBadge()}
          <div className="product-overlay">
            {isAuthenticated() && isCustomer() && (product.stock > 0) && (
              <button className="btn btn-gold" onClick={handleAddToCart}>
                🛒 Add to Cart
              </button>
            )}
            {(!product.stock || product.stock === 0) && (
              <div className="out-of-stock-message">
                <span className="stock-icon">📦</span>
                <p>Out of Stock</p>
              </div>
            )}
          </div>
        </div>
        <div className="product-info">
          <h5 className="product-name">{product.name}</h5>
          <p className="product-description">{product.description}</p>
          <div className="product-footer">
            <span className="price-tag">₹{product.price}</span>
            <div className="product-rating">
              <span className="stars">★★★★★</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
