import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import "../styles/Categories.css";

export default function Categories() {
  const { isAuthenticated, isCustomer, isShopkeeper } = useAuth();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [success, setSuccess] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    description: ""
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await api.get("/categories");
      setCategories(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.name.trim()) {
      setError("Category name is required");
      return;
    }

    try {
      if (editingId) {
        // Update category
        await api.put(`/categories/${editingId}`, formData);
        setSuccess("Category updated successfully!");
      } else {
        // Create category
        await api.post("/categories", formData);
        setSuccess("Category added successfully!");
      }

      setFormData({ name: "", description: "" });
      setEditingId(null);
      setShowForm(false);
      fetchCategories();
    } catch (err) {
      setError(err.response?.data?.message || "Error saving category");
    }
  };

  const handleEdit = (category) => {
    setFormData({
      name: category.name,
      description: category.description
    });
    setEditingId(category._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        await api.delete(`/categories/${id}`);
        setSuccess("Category deleted successfully!");
        fetchCategories();
      } catch (err) {
        setError("Failed to delete category");
      }
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({ name: "", description: "" });
    setError("");
  };

  const categoryEmojis = {
    'rings': '💍',
    'earrings': '👂',
    'bangles': '📿',
    'necklaces': '🔗',
    'bracelets': '🖤',
    'anklets': '⚡',
    'pendants': '✨',
    'sets': '🎁',
    'watch': '⌚',
    'brooch': '🔴',
    'chain': '⛓️',
    'locket': '💝'
  };

  return (
    <div className="categories-page">
      <div className="categories-header">
        <div className="header-content">
          <h1>Shop by Category</h1>
          <p>Find the perfect jewelry for any occasion</p>
        </div>
        
        {isAuthenticated() && isShopkeeper() && (
          <button 
            className="btn btn-primary"
            onClick={() => setShowForm(true)}
          >
            ➕ Add New Category
          </button>
        )}
      </div>

      <div className="container categories-container">
        {/* Add/Edit Form */}
        {isAuthenticated() && isShopkeeper() && showForm && (
          <div className="category-form-section">
            <h2>{editingId ? "Edit Category" : "Add New Category"}</h2>
            
            {(error || success) && (
              <div className={`alert ${error ? "alert-danger" : "alert-success"}`}>
                {error || success}
              </div>
            )}

            <form onSubmit={handleSubmit} className="category-form">
              <div className="form-group">
                <label htmlFor="name">Category Name *</label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  className="form-control"
                  placeholder="e.g., Rings, Earrings, Necklaces"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  name="description"
                  className="form-control"
                  rows="3"
                  placeholder="Describe this category..."
                  value={formData.description}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-actions">
                <button type="submit" className="btn btn-success">
                  {editingId ? "Update Category" : "Add Category"}
                </button>
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={handleCancel}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Categories List */}
        <div className="categories-list">
          {loading ? (
            <div className="loading">
              <div className="spinner"></div>
              <p>Loading categories...</p>
            </div>
          ) : error && !showForm ? (
            <div className="error-message">
              <p>{error}</p>
            </div>
          ) : categories.length === 0 ? (
            <div className="empty-state">
              <p>No categories available yet.</p>
              {isAuthenticated() && isShopkeeper() && (
                <button 
                  className="btn btn-primary"
                  onClick={() => setShowForm(true)}
                >
                  Create the first category
                </button>
              )}
            </div>
          ) : (
            <div className="row">
              {categories.map((cat) => (
                <div key={cat._id} className="col-md-6 col-lg-4 mb-4">
                  <div className="category-card">
                    <div className="category-emoji">
                      {categoryEmojis[cat.name.toLowerCase()] || '💎'}
                    </div>
                    <h4 className="category-name">{cat.name}</h4>
                    <p className="category-description">
                      {cat.description || "Explore this category"}
                    </p>
                    
                    <div className="category-actions">
                      {isAuthenticated() && isCustomer() ? (
                        <a href={`/products?category=${cat._id}`} className="btn btn-primary btn-sm">
                          Explore
                        </a>
                      ) : (
                        <button 
                          className="btn btn-primary btn-sm"
                          onClick={() => navigate('/login')}
                        >
                          Login to Explore
                        </button>
                      )}

                      {isAuthenticated() && isShopkeeper() && (
                        <>
                          <button 
                            className="btn btn-warning btn-sm"
                            onClick={() => handleEdit(cat)}
                            title="Edit category"
                          >
                            ✏️
                          </button>
                          <button 
                            className="btn btn-danger btn-sm"
                            onClick={() => handleDelete(cat._id)}
                            title="Delete category"
                          >
                            🗑️
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
