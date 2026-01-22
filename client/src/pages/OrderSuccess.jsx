import { Link, useParams } from 'react-router-dom';

function OrderSuccess() {
  const { orderId } = useParams();

  return (
    <div className="order-success">
      <div className="checkmark">✓</div>
      <h1>Order Placed Successfully!</h1>
      <p>Thank you for your purchase. You will receive a confirmation email shortly.</p>
      <div className="order-id">
        <strong>Order ID:</strong> {orderId}
      </div>
      <Link to="/products">
        <button className="continue-shopping-btn">Continue Shopping</button>
      </Link>
    </div>
  );
}

export default OrderSuccess;