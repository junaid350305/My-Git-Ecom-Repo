import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function Home() {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  // Slider banners (hardcoded for now)
  const slides = [
    { id: 1, image: "/images/banner1.jpg", title: "Big Sale!" },
    { id: 2, image: "/images/banner2.jpg", title: "New Arrivals" },
    { id: 3, image: "/images/banner3.jpg", title: "Trending Now" },
  ];

  useEffect(() => {
    fetch('http://localhost:3001/api/products')
      .then(res => res.json())
      .then(data => {
        setFeatured(data.slice(0, 3));
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  // Slider settings
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  return (
    <div className="home">
      {/* Slider Section */}
      <section style={{ marginBottom: '2rem' }}>
        <Slider {...sliderSettings}>
          {slides.map(slide => (
            <div key={slide.id} style={{ position: "relative" }}>
              <img
                src={slide.image}
                alt={slide.title}
                style={{ width: "100%", height: "400px", objectFit: "cover" }}
              />
              <h2 style={{
                position: "absolute",
                top: "30%",
                left: "10%",
                color: "white",
                fontSize: "2rem",
                fontWeight: "700",
                textShadow: "2px 2px 8px rgba(0,0,0,0.7)"
              }}>
                {slide.title}
              </h2>
            </div>
          ))}
        </Slider>
      </section>

      {/* Welcome Section */}
      <section style={{ textAlign: 'center', padding: '3rem 0' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Welcome to ShopEase</h1>
        <p style={{ fontSize: '1.2rem', color: '#666', marginBottom: '2rem' }}>
          Discover amazing products at great prices
        </p>
        <Link to="/products" style={{
          display: 'inline-block',
          padding: '1rem 2rem',
          background: '#e94560',
          color: 'white',
          borderRadius: '8px',
          fontWeight: '600'
        }}>
          Shop Now
        </Link>
      </section>

      {/* Featured Products Section */}
      <section style={{ padding: '0 2rem' }}>
        <h2 style={{ marginBottom: '1.5rem' }}>Featured Products</h2>
        {loading ? (
          <p className="loading">Loading...</p>
        ) : (
          <div className="products-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
            gap: '20px'
          }}>
            {featured.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default Home;
