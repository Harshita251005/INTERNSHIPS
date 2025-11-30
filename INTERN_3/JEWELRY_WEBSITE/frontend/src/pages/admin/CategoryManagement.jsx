import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import { categoryAPI } from '../../utils/api';
import { toast } from 'react-toastify';

const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    subcategories: [],
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await categoryAPI.getAll();
      setCategories(response.data.data.categories);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        await categoryAPI.update(editingCategory._id, formData);
        toast.success('Category updated successfully');
      } else {
        await categoryAPI.create(formData);
        toast.success('Category created successfully');
      }
      setShowModal(false);
      resetForm();
      fetchCategories();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
    }
  };

  const handleDelete = async (categoryId) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await categoryAPI.delete(categoryId);
        toast.success('Category deleted');
        fetchCategories();
      } catch (error) {
        toast.error('Delete failed');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      subcategories: [],
    });
    setEditingCategory(null);
  };

  const openEditModal = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description,
      subcategories: category.subcategories || [],
    });
    setShowModal(true);
  };

  const addSubcategory = () => {
    setFormData({
      ...formData,
      subcategories: [...formData.subcategories, { name: '', description: '' }],
    });
  };

  const updateSubcategory = (index, field, value) => {
    const updated = [...formData.subcategories];
    updated[index][field] = value;
    setFormData({ ...formData, subcategories: updated });
  };

  const removeSubcategory = (index) => {
    const updated = formData.subcategories.filter((_, i) => i !== index);
    setFormData({ ...formData, subcategories: updated });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Category Management</h1>
          <button
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
            className="btn-primary"
          >
            + Add Category
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600 mx-auto"></div>
          </div>
        ) : categories.length === 0 ? (
          <div className="card p-12 text-center">
            <p className="text-gray-600 mb-4">No categories yet</p>
            <button onClick={() => setShowModal(true)} className="btn-primary">
              Create First Category
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <div key={category._id} className="card p-6 hover:shadow-lg transition">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-gray-900">{category.name}</h3>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => openEditModal(category)}
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(category._id)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                <p className="text-gray-600 text-sm mb-4">{category.description}</p>

                {category.subcategories && category.subcategories.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase mb-2">
                      Subcategories ({category.subcategories.length})
                    </p>
                    <div className="space-y-1">
                      {category.subcategories.slice(0, 3).map((sub, idx) => (
                        <div key={idx} className="text-sm text-gray-700 flex items-center">
                          <span className="text-primary-600 mr-2">•</span>
                          {sub.name}
                        </div>
                      ))}
                      {category.subcategories.length > 3 && (
                        <p className="text-xs text-gray-500">
                          +{category.subcategories.length - 3} more
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Summary */}
        {categories.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="card p-6">
              <div className="text-gray-600 text-sm">Total Categories</div>
              <div className="text-3xl font-bold">{categories.length}</div>
            </div>
            <div className="card p-6">
              <div className="text-gray-600 text-sm">Total Subcategories</div>
              <div className="text-3xl font-bold text-purple-600">
                {categories.reduce((sum, cat) => sum + (cat.subcategories?.length || 0), 0)}
              </div>
            </div>
            <div className="card p-6">
              <div className="text-gray-600 text-sm">Avg Subcategories</div>
              <div className="text-3xl font-bold text-blue-600">
                {(
                  categories.reduce((sum, cat) => sum + (cat.subcategories?.length || 0), 0) /
                  categories.length
                ).toFixed(1)}
              </div>
            </div>
          </div>
        )}

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-screen overflow-y-auto p-8">
              <h2 className="text-2xl font-bold mb-6">
                {editingCategory ? 'Edit Category' : 'Add New Category'}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="e.g., Rings"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    rows="3"
                    placeholder="Describe this category..."
                    required
                  />
                </div>

                {/* Subcategories */}
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <label className="block text-sm font-medium text-gray-700">
                      Subcategories (Optional)
                    </label>
                    <button
                      type="button"
                      onClick={addSubcategory}
                      className="text-sm text-primary-600 hover:text-primary-800"
                    >
                      + Add Subcategory
                    </button>
                  </div>

                  {formData.subcategories.map((sub, index) => (
                    <div key={index} className="flex space-x-3 mb-3">
                      <input
                        type="text"
                        value={sub.name}
                        onChange={(e) => updateSubcategory(index, 'name', e.target.value)}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
                        placeholder="Subcategory name"
                      />
                      <input
                        type="text"
                        value={sub.description}
                        onChange={(e) => updateSubcategory(index, 'description', e.target.value)}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
                        placeholder="Description"
                      />
                      <button
                        type="button"
                        onClick={() => removeSubcategory(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex space-x-4 pt-4">
                  <button type="submit" className="btn-primary flex-1">
                    {editingCategory ? 'Update' : 'Create'} Category
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      resetForm();
                    }}
                    className="btn-outline flex-1"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryManagement;
