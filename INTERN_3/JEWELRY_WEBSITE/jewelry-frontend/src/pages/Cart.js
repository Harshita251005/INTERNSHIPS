import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/Cart.css";

export default function Cart() {
  const { isAuthenticated, isCustomer } = useAuth();
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/login");
      return;
    }

    if (!isCustomer()) {
      alert("Only customers can access the cart");
      navigate("/");
      return;
    }

    loadCart();
  }, []);

  useEffect(() => {
    calculateTotal();
  }, [cartItems]);

  const loadCart = () => {
    try {
      const savedCart = localStorage.getItem("cart");
      if (savedCart) {
        setCartItems(JSON.parse(savedCart));
      }
    } catch (error) {
      console.error("Error loading cart:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateTotal = () => {
    const sum = cartItems.reduce((acc, item) => {
      return acc + (item.price * item.quantity);
    }, 0);
    setTotal(sum);
  };

  const handleQuantityChange = (id, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(id);
      return;
    }

    const updatedCart = cartItems.map(item => {
      if (item._id === id) {
        const available = item.stock || 0;
        if (newQuantity > available) {
          alert(`Only ${available} items available in stock for ${item.name}`);
          return { ...item, quantity: available };
        }
        return { ...item, quantity: newQuantity };
      }
      return item;
    });
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const removeFromCart = (id) => {
    const updatedCart = cartItems.filter(item => item._id !== id);
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const handleCheckout = () => {
    // Ask user to confirm and then send order to backend
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }

    if (!isCustomer()) {
      alert('Only customers can place orders');
      return;
    }

    if (cartItems.length === 0) {
      alert('Your cart is empty');
      return;
    }

    if (!window.confirm('Place order now?')) return;

    // Validate live stock by fetching each product
    const validatePromises = cartItems.map(ci =>
      fetch(`http://localhost:5000/api/products/${ci._id}`).then(res => {
        if (!res.ok) return { ok: false, id: ci._id };
        return res.json();
      })
    );

    Promise.all(validatePromises)
      .then(results => {
        const shortages = [];
        const refreshedItems = cartItems.map((ci, idx) => {
          const prod = results[idx];
          if (!prod || prod.ok === false) {
            shortages.push({ id: ci._id, reason: 'not_found' });
            return ci;
          }
          if (prod.stock < ci.quantity) {
            shortages.push({ id: ci._id, reason: 'insufficient', available: prod.stock });
            return { ...ci, stock: prod.stock, quantity: Math.min(ci.quantity, prod.stock) };
          }
          return { ...ci, stock: prod.stock };
        });

        if (shortages.length > 0) {
          // Update cart with refreshed quantities/stock and inform user
          setCartItems(refreshedItems);
          localStorage.setItem('cart', JSON.stringify(refreshedItems));
          const messages = shortages.map(s => {
            if (s.reason === 'not_found') return `A product in your cart is no longer available.`;
            return `Only ${s.available} available for an item in your cart.`;
          });
          alert('Stock issue: ' + messages.join(' '));
          return;
        }

        // All good, build payload and place order
        const payload = {
          items: cartItems.map(i => ({ product: i._id, quantity: i.quantity })),
          shippingAddress: {},
          paymentMethod: 'cod'
        };

        const token = localStorage.getItem('token');

        fetch('http://localhost:5000/api/orders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {})
          },
          body: JSON.stringify(payload)
        })
          .then(async res => {
            const data = await res.json();
            if (!res.ok) {
              const msg = data && data.message ? data.message : 'Failed to place order';
              throw new Error(msg);
            }
            return data;
          })
          .then(order => {
            alert(`Order placed successfully! Order ID: ${order._id}`);
            setCartItems([]);
            localStorage.removeItem('cart');
            navigate('/products');
          })
          .catch(err => {
            console.error('Order error:', err);
            alert('Could not place order: ' + err.message);
          });
      })
      .catch(err => {
        console.error('Validation error:', err);
        alert('Could not validate stock before placing order. Try again.');
      });
  };

  const handleClearCart = () => {
    if (window.confirm("Are you sure you want to clear your cart?")) {
      setCartItems([]);
      localStorage.removeItem("cart");
    }
  };

  if (loading) {
    return <div className="loading">Loading your cart...</div>;
  }

  return (
    <div className="cart-container">
      <div className="cart-header">
        <h1>🛒 Your Shopping Cart</h1>
        <p>Review your selected jewelry items</p>
      </div>

      <div className="cart-content">
        {cartItems.length === 0 ? (
          <div className="empty-cart">
            <div className="empty-icon">🛒</div>
            <h2>Your cart is empty</h2>
            <p>Explore our jewelry collection and add items to your cart.</p>
            <button 
              className="btn btn-primary"
              onClick={() => navigate("/products")}
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="cart-wrapper">
            {/* Cart Items */}
            <div className="cart-items-section">
              <h2>Items in Cart ({cartItems.length})</h2>
              <div className="cart-items">
                {cartItems.map(item => (
                  <div key={item._id} className="cart-item">
                    <div className="item-image">
                      <img 
                        src={item.imageUrl || "https://via.placeholder.com/100x100?text=Jewelry"}
                        alt={item.name}
                      />
                    </div>

                    <div className="item-details">
                      <h4>{item.name}</h4>
                      <p className="category">{item.category || "Jewelry"}</p>
                      <p className="description">{item.description?.substring(0, 100)}</p>
                      <div className="price-section">
                        <span className="item-price">₹{item.price}</span>
                        {item.quantity > 1 && (
                          <span className="item-total">
                            Subtotal: ₹{item.price * item.quantity}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="quantity-control">
                      <label>Quantity:</label>
                      <div className="quantity-selector">
                        <button 
                          className="qty-btn"
                          onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                        >
                          −
                        </button>
                        <input 
                          type="number" 
                          value={item.quantity}
                          onChange={(e) => handleQuantityChange(item._id, parseInt(e.target.value) || 1)}
                          min="1"
                        />
                        <button 
                          className="qty-btn"
                          onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div className="item-actions">
                      <button 
                        className="btn btn-danger btn-sm"
                        onClick={() => removeFromCart(item._id)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="order-summary">
              <h3>Order Summary</h3>
              
              <div className="summary-item">
                <span>Subtotal:</span>
                <span>₹{total.toFixed(2)}</span>
              </div>

              <div className="summary-item">
                <span>Tax (18% GST):</span>
                <span>₹{(total * 0.18).toFixed(2)}</span>
              </div>

              <div className="summary-item">
                <span>Shipping:</span>
                <span className="free">FREE</span>
              </div>

              <div className="summary-divider"></div>

              <div className="summary-total">
                <span>Total Amount:</span>
                <span>₹{(total * 1.18).toFixed(2)}</span>
              </div>

              <div className="checkout-section">
                <button 
                  className="btn btn-success btn-lg"
                  onClick={handleCheckout}
                >
                  💳 Checkout
                </button>

                <button 
                  className="btn btn-secondary"
                  onClick={() => navigate("/products")}
                >
                  Continue Shopping
                </button>

                <button 
                  className="btn btn-outline-danger"
                  onClick={handleClearCart}
                >
                  Clear Cart
                </button>
              </div>

              <div className="security-info">
                <p>🔒 Your transaction is secure and encrypted</p>
                <p>✓ We support all major payment methods</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
