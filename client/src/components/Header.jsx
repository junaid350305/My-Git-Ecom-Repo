import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

function Header() {
  const { cartCount } = useCart();

  return (
    <header className="header">
      <div className="header-content">
        <Link to="/" className="logo">ShopEase</Link>
        <nav className="nav">
          <Link to="/">Home</Link>
          <Link to="/products">Products</Link>
          <Link to="/cart" className="cart-icon">
            🛒 Cart
            {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
          </Link>
        </nav>
      </div>
    </header>
  );
}

export default Header;