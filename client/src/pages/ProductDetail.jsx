import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:3001/api/products/${id}`)
      .then(res => {
        if (!res.ok) throw new Error('Product not found');
        return res.json();
      })
      .then(data => {
        setProduct(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    navigate('/cart');
  };

  if (loading) return <p className="loading">Loading...</p>;
  if (!product) return <p className="loading">Product not found</p>;

  return (
    <div className="product-detail">
      <img src={product.image} alt={product.name} />
      <div className="product-detail-info">
        <h1>{product.name}</h1>
        <p className="price">${product.price.toFixed(2)}</p>
        <p className="description">{product.description}</p>
        <p className="stock">✓ {product.stock} in stock</p>
        
        <div className="quantity-selector">
          <button onClick={() => setQuantity(q => Math.max(1, q - 1))}>-</button>
          <span>{quantity}</span>
          <button onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}>+</button>
        </div>
        
        <button className="add-to-cart-btn" onClick={handleAddToCart}>
          Add to Cart - ${(product.price * quantity).toFixed(2)}
        </button>
      </div>
    </div>
  );
}

export default ProductDetail;