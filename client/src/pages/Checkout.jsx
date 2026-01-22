import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

function Checkout() {
  const navigate = useNavigate();
  const { cart, cartTotal, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    address: '',
    city: '',
    zip: '',
    cardNumber: '',
    expiry: '',
    cvv: ''
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('http://localhost:3001/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cart,
          customer: {
            name: form.name,
            email: form.email,
            address: `${form.address}, ${form.city} ${form.zip}`
          },
          total: cartTotal
        })
      });

      const order = await response.json();
      clearCart();
      navigate(`/order-success/${order.id}`);
    } catch (error) {
      console.error(error);
      alert('Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="checkout-page">
      <form className="checkout-form" onSubmit={handleSubmit}>
        <h2>Shipping Information</h2>
        
        <div className="form-group">
          <label>Full Name</label>
          <input name="name" value={form.name} onChange={handleChange} required />
        </div>
        
        <div className="form-group">
          <label>Email</label>
          <input type="email" name="email" value={form.email} onChange={handleChange} required />
        </div>
        
        <div className="form-group">
          <label>Address</label>
          <input name="address" value={form.address} onChange={handleChange} required />
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label>City</label>
            <input name="city" value={form.city} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>ZIP Code</label>
            <input name="zip" value={form.zip} onChange={handleChange} required />
          </div>
        </div>

        <h2 style={{ marginTop: '2rem' }}>Payment Information</h2>
        
        <div className="form-group">
          <label>Card Number</label>
          <input name="cardNumber" placeholder="1234 5678 9012 3456" value={form.cardNumber} onChange={handleChange} required />
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label>Expiry</label>
            <input name="expiry" placeholder="MM/YY" value={form.expiry} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>CVV</label>
            <input name="cvv" placeholder="123" value={form.cvv} onChange={handleChange} required />
          </div>
        </div>

        <button type="submit" className="place-order-btn" disabled={loading}>
          {loading ? 'Processing...' : 'Place Order'}
        </button>
      </form>

      <div className="order-summary">
        <h2>Order Summary</h2>
        {cart.map(item => (
          <div key={item.id} className="order-item">
            <span>{item.name} × {item.quantity}</span>
            <span>${(item.price * item.quantity).toFixed(2)}</span>
          </div>
        ))}
        <div className="order-total">
          <span>Total</span>
          <span>${cartTotal.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}

export default Checkout;