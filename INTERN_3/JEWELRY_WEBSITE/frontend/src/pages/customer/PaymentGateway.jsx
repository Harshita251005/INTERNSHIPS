import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { paymentAPI } from '../../utils/api';
import { toast } from 'react-toastify';

// Initialize Stripe
console.log('Stripe Key:', import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_placeholder');

const CheckoutForm = ({ orderId, amount, clientSecret }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setProcessing(true);
    setError(null);

    if (!stripe || !elements) {
      return;
    }

    const cardElement = elements.getElement(CardElement);

    try {
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
        },
      });

      if (error) {
        setError(error.message);
        toast.error(error.message);
        setProcessing(false);
      } else if (paymentIntent.status === 'succeeded') {
        // Verify payment on backend
        await paymentAPI.verify({
          orderId,
          paymentId: paymentIntent.id,
          status: 'success',
        });
        toast.success('Payment successful!');
        navigate('/payment/success', { state: { orderId } });
      }
    } catch (err) {
      console.error('Payment failed:', err);
      setError('Payment failed. Please try again.');
      toast.error('Payment failed');
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="p-4 border rounded-lg bg-gray-50">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#424770',
                '::placeholder': {
                  color: '#aab7c4',
                },
              },
              invalid: {
                color: '#9e2146',
              },
            },
          }}
        />
      </div>
      {error && <div className="text-red-600 text-sm">{error}</div>}
      <button
        type="submit"
        disabled={!stripe || processing}
        className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {processing ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            Processing...
          </>
        ) : (
          `Pay $${amount}`
        )}
      </button>
    </form>
  );
};

const PaymentGateway = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { orderId, amount, method } = location.state || {};
  const [clientSecret, setClientSecret] = useState('');
  const [loading, setLoading] = useState(true);
  const [upiDetails, setUpiDetails] = useState(null);

  useEffect(() => {
    if (!orderId) {
      toast.error('Invalid payment session');
      navigate('/cart');
      return;
    }

    const initializePayment = async () => {
      try {
        if (method === 'card') {
          const response = await paymentAPI.createPaymentIntent({ orderId });
          setClientSecret(response.data.clientSecret);
        } else if (method === 'upi') {
          const response = await paymentAPI.getUPIDetails(orderId);
          setUpiDetails(response.data.data);
        }
      } catch (error) {
        console.error('Error initializing payment:', error);
        toast.error('Failed to initialize payment');
      } finally {
        setLoading(false);
      }
    };

    initializePayment();
  }, [orderId, method, navigate]);

  const handleUPIPayment = () => {
    setLoading(true);
    // In a real app, you might poll for payment status here
    setTimeout(async () => {
      try {
        await paymentAPI.verify({
          orderId,
          paymentId: `UPI-${Date.now()}`,
          status: 'success',
        });
        navigate('/payment/success', { state: { orderId } });
      } catch (error) {
        toast.error('Payment verification failed');
        setLoading(false);
      }
    }, 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold mb-2">Secure Payment</h1>
          <p className="text-gray-500">Total Amount: <span className="font-bold text-black">${amount}</span></p>
          {upiDetails?.merchantName && (
             <p className="text-sm text-gray-400 mt-1">Paying: {upiDetails.merchantName}</p>
          )}
        </div>

        {method === 'upi' ? (
          <div className="text-center space-y-6">
            <div className="bg-white p-4 border-2 border-dashed border-gray-300 rounded-xl inline-block">
              {upiDetails?.upiQrCode ? (
                <img 
                  src={upiDetails.upiQrCode} 
                  alt="UPI QR Code" 
                  className="w-48 h-48 object-contain"
                />
              ) : (
                <div className="w-48 h-48 flex items-center justify-center bg-gray-100 text-gray-400">
                  No QR Code Available
                </div>
              )}
            </div>
            <div>
              <p className="font-medium text-gray-800">Scan to Pay</p>
              <p className="text-sm text-gray-500 mt-1">Use any UPI app to scan and pay</p>
              {upiDetails?.upiId && (
                 <p className="text-xs text-gray-400 mt-2 font-mono">{upiDetails.upiId}</p>
              )}
            </div>
            
            <button
              onClick={handleUPIPayment}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition flex items-center justify-center gap-2"
            >
              I have made the payment
            </button>
          </div>
        ) : (
          clientSecret && (
            <Elements stripe={stripePromise} options={{ clientSecret }}>
              <CheckoutForm orderId={orderId} amount={amount} clientSecret={clientSecret} />
            </Elements>
          )
        )}
        
        <div className="mt-6 text-center text-xs text-gray-400">
          <p>🔒 256-bit SSL Encrypted Payment</p>
          <p className="mt-1">Powered by Stripe & UPI</p>
        </div>
      </div>
    </div>
  );
};

export default PaymentGateway;
