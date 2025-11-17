import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import api from "../utils/api";
import ProductCard from "../components/ProductCard";
import "../styles/Products.css";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categoryName, setCategoryName] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const category = params.get("category");
    const url = category ? `/products?category=${category}` : "/products";

    setLoading(true);
    api.get(url)
      .then(res => {
        setProducts(res.data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.response?.data?.message || err.message);
        setLoading(false);
      });

    // Fetch category name if category filter is applied
    if (category) {
      api.get(`/categories/${category}`)
        .then(res => {
          setCategoryName(res.data.name);
        })
        .catch(err => {
          console.error("Error fetching category:", err);
        });
    } else {
      setCategoryName(null);
    }
  }, [location.search]);

  return (
    <div className="products-page">
      <div className="products-header">
        <h1>{categoryName ? `${categoryName} Collection` : "Our Exquisite Collection"}</h1>
        <p>{categoryName ? `Explore our beautiful ${categoryName.toLowerCase()} collection` : "Discover our handpicked jewelry pieces"}</p>
      </div>

      <div className="container products-container">
        {loading ? (
          <div className="loading">
            <div className="spinner"></div>
            <p>Loading products...</p>
          </div>
        ) : error ? (
          <div className="error-message">
            <p>Error loading products. Please try again later.</p>
          </div>
        ) : products.length === 0 ? (
          <div className="empty-state">
            <p>No products available at the moment.</p>
          </div>
        ) : (
          <div className="row">
            {products.map(product => (
              <div key={product._id} className="col-md-6 col-lg-4">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
