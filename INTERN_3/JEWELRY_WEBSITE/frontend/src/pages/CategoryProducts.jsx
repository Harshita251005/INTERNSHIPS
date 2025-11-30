import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { productAPI, categoryAPI } from '../utils/api';

const CategoryProducts = () => {
  const { categoryId } = useParams();
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategoryAndProducts();
  }, [categoryId]);

  const fetchCategoryAndProducts = async () => {
    try {
      setLoading(true);
      // Fetch category details
      const categoriesResponse = await categoryAPI.getAll();
      const categoryData = categoriesResponse.data.data.categories.find(
        (cat) => cat._id === categoryId
      );
      setCategory(categoryData);

      // Fetch products for this category
      const productsResponse = await productAPI.getAll({ category: categoryId });
      setProducts(productsResponse.data.data.products);
    } catch (error) {
      console.error('Error fetching category products:', error);
    } finally {
      setLoading(false);
    }
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
            <Link to="/categories" className="text-primary-600 hover:underline">
              Categories
            </Link>
            <span className="mx-2">/</span>
            <span className="text-gray-700">{category?.name || 'Loading...'}</span>
          </div>

          {/* Category Header */}
          {category && (
            <div className="mb-8">
              <h1 className="text-4xl font-bold mb-2 gradient-text">{category.name}</h1>
              <p className="text-gray-600">{category.description}</p>
            </div>
          )}

          {/* Products Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="card p-4 shimmer h-64"></div>
              ))}
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <Link
                  key={product._id}
                  to={`/products/${product._id}`}
                  className="product-card p-4"
                >
                  <div className="overflow-hidden rounded-lg mb-4">
                    <img
                      src={product.images[0] || 'https://via.placeholder.com/300'}
                      alt={product.title}
                      className="product-image w-full h-48 object-cover"
                    />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{product.title}</h3>
                  <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                    {product.description}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold gradient-gold-text">
                      ${product.price}
                    </span>
                    <span className="text-sm text-gray-500">
                      Stock: {product.stock}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-xl text-gray-600">No products found in this category.</p>
              <Link to="/categories" className="btn-primary mt-4 inline-block">
                Browse Other Categories
              </Link>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CategoryProducts;
