import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../styles/Orders.css';

export default function Orders() {
  const { isAuthenticated, isCustomer } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }

    if (!isCustomer()) {
      alert('Only customers can view their orders');
      navigate('/');
      return;
    }

    fetchOrders();
  }, [isAuthenticated, isCustomer]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token');

      const res = await fetch('http://localhost:5000/api/orders/myorders', {
        method: 'GET',
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        }
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to fetch orders');
      }

      setOrders(data);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="orders-loading">Loading your orders...</div>;
  }

  return (
    <div className="orders-container">
      <div className="orders-header">
        <h1>📦 My Orders</h1>
        <p>View your order history and status</p>
      </div>

      {error && <div className="error-message">{error}</div>}

      {orders.length === 0 ? (
        <div className="empty-orders">
          <div className="empty-icon">📭</div>
          <h2>No orders yet</h2>
          <p>You haven't placed any orders yet.</p>
          <button 
            className="btn btn-primary"
            onClick={() => navigate('/products')}
          >
            Start Shopping
          </button>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map(order => (
            <div key={order._id} className="order-card">
              <div className="order-header">
                <div className="order-info">
                  <h3>Order #{order._id.slice(-8).toUpperCase()}</h3>
                  <p className="order-date">
                    {new Date(order.createdAt).toLocaleDateString('en-IN', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
                <div className="order-status">
                  <span className={`status-badge ${order.status}`}>
                    {order.status.toUpperCase()}
                  </span>
                </div>
              </div>

              <div className="order-items">
                <h4>Items Ordered:</h4>
                <div className="items-list">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="order-item">
                      <div className="item-name">
                        {item.name || 'Product'}
                      </div>
                      <div className="item-qty">
                        Qty: {item.quantity}
                      </div>
                      <div className="item-price">
                        ₹{item.price} each
                      </div>
                      <div className="item-subtotal">
                        Subtotal: ₹{(item.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="order-footer">
                <div className="order-total">
                  <strong>Total Amount: ₹{order.totalAmount.toFixed(2)}</strong>
                </div>
                <div className="order-payment">
                  <span>Payment: {order.paymentMethod || 'N/A'}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
