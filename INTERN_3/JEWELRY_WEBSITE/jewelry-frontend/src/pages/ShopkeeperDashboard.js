import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";
import "../styles/Dashboard.css";

export default function ShopkeeperDashboard() {
  const { user, isShopkeeper, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    imageUrl: "",
    stock: ""
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get("/products");
      // Filter products added by this shopkeeper
      const myProducts = response.data.filter(p => p.addedBy === user?._id);
      setProducts(myProducts);
    } catch (err) {
      setError("Failed to load products");
    } finally {
      setLoading(false);
    }
  }, [user?._id]);

  useEffect(() => {
    if (!isAuthenticated() || !isShopkeeper()) {
      navigate("/");
      return;
    }
    fetchProducts();
  }, [isAuthenticated, isShopkeeper, navigate, fetchProducts]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.name || !formData.price) {
      setError("Name and price are required");
      return;
    }

    if (formData.stock === "" || formData.stock < 0) {
      setError("Stock must be a non-negative number");
      return;
    }

    try {
      if (editingId) {
        // Update product
        await api.put(`/products/${editingId}`, formData);
        setSuccess("Product updated successfully!");
      } else {
        // Create product
        await api.post("/products", formData);
        setSuccess("Product added successfully!");
      }

      setFormData({ name: "", description: "", price: "", category: "", imageUrl: "", stock: "" });
      setEditingId(null);
      setShowForm(false);
      fetchProducts();
    } catch (err) {
      setError(err.response?.data?.message || "Error saving product");
    }
  };

  const handleEdit = (product) => {
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      imageUrl: product.imageUrl,
      stock: product.stock || 0
    });
    setEditingId(product._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await api.delete(`/products/${id}`);
        setSuccess("Product deleted successfully!");
        fetchProducts();
      } catch (err) {
        setError("Failed to delete product");
      }
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({ name: "", description: "", price: "", category: "", imageUrl: "", stock: "" });
    setError("");
  };

  const getStockStatus = (stock) => {
    if (stock === 0) return <span className="stock-status out-of-stock">Out of Stock</span>;
    if (stock < 5) return <span className="stock-status low-stock">Low Stock</span>;
    return <span className="stock-status in-stock">In Stock</span>;
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>🏪 Shopkeeper Dashboard</h1>
        <p>Welcome, {user?.name}! Manage your jewelry products and stock here.</p>
      </div>

      <div className="dashboard-content">
        {/* Add/Edit Product Form */}
        <div className="form-section">
          <div className="form-header">
            <h2>{editingId ? "Edit Product" : "Add New Product"}</h2>
            {!showForm && (
              <button 
                className="btn btn-primary"
                onClick={() => setShowForm(true)}
              >
                ➕ Add Product
              </button>
            )}
          </div>

          {(error || success) && (
            <div className={`alert ${error ? "alert-danger" : "alert-success"}`}>
              {error || success}
            </div>
          )}

          {showForm && (
            <form onSubmit={handleSubmit} className="product-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name">Product Name *</label>
                  <input
                    id="name"
                    type="text"
                    name="name"
                    className="form-control"
                    placeholder="e.g., Gold Ring"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="price">Price (₹) *</label>
                  <input
                    id="price"
                    type="number"
                    name="price"
                    className="form-control"
                    placeholder="e.g., 5000"
                    value={formData.price}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="stock">Stock Quantity *</label>
                  <input
                    id="stock"
                    type="number"
                    name="stock"
                    className="form-control"
                    placeholder="e.g., 10"
                    value={formData.stock}
                    onChange={handleInputChange}
                    min="0"
                    step="1"
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="category">Category</label>
                  <input
                    id="category"
                    type="text"
                    name="category"
                    className="form-control"
                    placeholder="e.g., Rings, Earrings, Necklaces"
                    value={formData.category}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="imageUrl">Image URL</label>
                  <input
                    id="imageUrl"
                    type="url"
                    name="imageUrl"
                    className="form-control"
                    placeholder="https://example.com/image.jpg"
                    value={formData.imageUrl}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  name="description"
                  className="form-control"
                  rows="4"
                  placeholder="Describe your product..."
                  value={formData.description}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-actions">
                <button type="submit" className="btn btn-success">
                  {editingId ? "Update Product" : "Add Product"}
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
          )}
        </div>

        {/* Products List */}
        <div className="products-section">
          <h2>Your Products ({products.length})</h2>
          
          {loading ? (
            <div className="loading">Loading your products...</div>
          ) : products.length === 0 ? (
            <div className="empty-state">
              <p>No products yet. Add your first product to get started!</p>
            </div>
          ) : (
            <div className="products-table">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Price (₹)</th>
                    <th>Stock</th>
                    <th>Status</th>
                    <th>Description</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(product => (
                    <tr key={product._id}>
                      <td className="product-name">{product.name}</td>
                      <td>{product.category || "-"}</td>
                      <td className="price">₹{product.price}</td>
                      <td className="stock-qty"><strong>{product.stock || 0}</strong></td>
                      <td>{getStockStatus(product.stock)}</td>
                      <td className="description">{product.description?.substring(0, 50) || "-"}...</td>
                      <td className="actions">
                        <button 
                          className="btn btn-sm btn-warning"
                          onClick={() => handleEdit(product)}
                          title="Edit product"
                        >
                          ✏️
                        </button>
                        <button 
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDelete(product._id)}
                          title="Delete product"
                        >
                          🗑️
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
