import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import { categoryAPI } from '../utils/api';

const Home = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await categoryAPI.getAll();
      setCategories(response.data.data.categories.slice(0, 4)); // First 4 for homepage
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleShopClick = (path) => {
    if (isAuthenticated) {
      navigate(path);
    } else {
      navigate('/login', { state: { from: path } });
    }
  };

  const handleCategoryClick = (categoryId) => {
    if (isAuthenticated) {
      navigate(`/category/${categoryId}`);
    } else {
      navigate('/login', { state: { from: `/category/${categoryId}` } });
    }
  };

  const getCategoryIcon = (categoryName) => {
    if (categoryName === 'Rings') return '💍';
    if (categoryName === 'Necklaces') return '📿';
    if (categoryName === 'Earrings') return '✨';
    if (categoryName === 'Bracelets') return '⚜️';
    if (categoryName === 'Jewelry Sets') return '💎';
    
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
      
      {/* Hero Section */}
      <section className="hero-gradient text-white py-20 animate-fade-in">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-slide-up">
            Discover Timeless Elegance
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-100">
            Exquisite jewelry pieces crafted with passion and precision
          </p>
          <div className="flex justify-center space-x-4">
            <button onClick={() => handleShopClick('/products')} className="btn-secondary">
              Shop Now
            </button>
            <Link to="/signup" className="btn-outline !border-white !text-white hover:!bg-white hover:!text-primary-600">
              Get Started
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-12 gradient-text">Why Choose Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card p-8 text-center hover:scale-105 transition-transform">
              <div className="text-5xl mb-4">💎</div>
              <h3 className="text-xl font-bold mb-3">Premium Quality</h3>
              <p className="text-gray-600">
                Handcrafted jewelry made with the finest materials and expert craftsmanship.
              </p>
            </div>
            <div className="card p-8 text-center hover:scale-105 transition-transform">
              <div className="text-5xl mb-4">🔒</div>
              <h3 className="text-xl font-bold mb-3">Secure Shopping</h3>
              <p className="text-gray-600">
                Safe and secure transactions with multiple payment options.
              </p>
            </div>
            <div className="card p-8 text-center hover:scale-105 transition-transform">
              <div className="text-5xl mb-4">🚚</div>
              <h3 className="text-xl font-bold mb-3">Fast Delivery</h3>
              <p className="text-gray-600">
                Quick and reliable shipping to your doorstep with order tracking.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-12 gradient-text">Shop by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((category) => (
              <button
                key={category._id}
                onClick={() => handleCategoryClick(category._id)}
                className="card p-6 text-center hover:shadow-glow transition-all group cursor-pointer"
              >
                <div className="text-4xl mb-3 transform group-hover:scale-110 transition-transform">
                  {getCategoryIcon(category.name)}
                </div>
                <h3 className="font-semibold text-lg">{category.name}</h3>
              </button>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link to="/categories" className="btn-outline">
              View More Categories
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-jewelry text-white py-16">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Find Your Perfect Piece?
          </h2>
          <p className="text-lg mb-8">
            Join thousands of satisfied customers who found their dream jewelry with us.
          </p>
          <button onClick={() => handleShopClick('/products')} className="btn-secondary !bg-white !text-primary-600 hover:!bg-gray-100">
            Browse Collection
          </button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
