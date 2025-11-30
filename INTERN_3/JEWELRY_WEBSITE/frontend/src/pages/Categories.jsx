import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { categoryAPI } from '../utils/api';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await categoryAPI.getAll();
      setCategories(response.data.data.categories);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryIcon = (categoryName) => {
    if (categoryName === 'Rings') return '💍';
    if (categoryName === 'Necklaces') return '📿';
    if (categoryName === 'Earrings') return '✨';
    if (categoryName === 'Bracelets') return '⚜️';
    
    // Fallback for custom categories
    const name = categoryName.toLowerCase();
    if (name.includes('ring')) return '💍';
    if (name.includes('necklace') || name.includes('pendant')) return '📿';
    if (name.includes('earring')) return '✨';
    if (name.includes('bracelet') || name.includes('bangle') || name.includes('anklet')) return '⚜️';
    return '💎';
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <div className="mb-6">
            <Link to="/" className="text-primary-600 hover:underline">
              Home
            </Link>
            <span className="mx-2">/</span>
            <span className="text-gray-700">All Categories</span>
          </div>

          <h1 className="text-4xl font-bold mb-4 gradient-text">All Categories</h1>
          <p className="text-gray-600 mb-8">
            Explore our complete collection of jewelry categories
          </p>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="card p-6 shimmer h-32"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {categories.map((category) => (
                <Link
                  key={category._id}
                  to={`/category/${category._id}`}
                  className="card p-6 text-center hover:shadow-glow transition-all group"
                >
                  <div className="text-5xl mb-3 transform group-hover:scale-110 transition-transform">
                    {getCategoryIcon(category.name)}
                  </div>
                  <h3 className="font-semibold text-lg mb-1">{category.name}</h3>
                  <p className="text-sm text-gray-500 line-clamp-2">
                    {category.description}
                  </p>
                </Link>
              ))}
            </div>
          )}

          {!loading && categories.length === 0 && (
            <div className="text-center py-16">
              <p className="text-xl text-gray-600">No categories available at the moment.</p>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Categories;
