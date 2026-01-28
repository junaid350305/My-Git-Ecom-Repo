import { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Button,
  Grid,
  CircularProgress,
  Card,
  useTheme,
} from '@mui/material';
import { ArrowForward, LocalShipping, VerifiedUser, Headset } from '@mui/icons-material';
import Slider from '../components/Slider';
import ProductCard from '../components/ProductCard';

function Home() {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();

  // Slider banners with enhanced data
  const slides = [
    {
      id: 1,
      image: '/images/banner1.jpg',
      title: 'Big Sale!',
      subtitle: 'Limited Time Offer',
      description: 'Get up to 50% off on selected items',
      cta: 'Shop Now',
      ctaLink: '/products',
    },
    {
      id: 2,
      image: '/images/banner2.jpg',
      title: 'New Arrivals',
      subtitle: 'Fresh Collection',
      description: 'Discover the latest products just added to our store',
      cta: 'Explore',
      ctaLink: '/products',
    },
    {
      id: 3,
      image: '/images/banner3.jpg',
      title: 'Trending Now',
      subtitle: 'Popular Picks',
      description: 'Check out what customers love the most',
      cta: 'View Trending',
      ctaLink: '/products',
    },
  ];

  useEffect(() => {
    fetch('http://localhost:3001/api/products')
      .then((res) => res.json())
      .then((data) => {
        setFeatured(data.slice(0, 8));
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching products:', err);
        setLoading(false);
      });
  }, []);

  return (
    <Box sx={{ backgroundColor: theme.palette.background.default, minHeight: '100vh' }}>
      {/* Custom Slider Section */}
      <Box sx={{ mb: 6 }}>
        <Slider slides={slides} autoplay={true} autoplaySpeed={5000} height="400px" />
      </Box>

      {/* Welcome Section */}
      <Container maxWidth="lg">
        <Box
          sx={{
            textAlign: 'center',
            py: { xs: 4, md: 6 },
            mb: { xs: 4, md: 6 },
          }}
        >
          <Typography variant="h2" sx={{ mb: 2, fontWeight: 700 }}>
            Welcome to ShopEase
          </Typography>
          <Typography
            variant="h6"
            color="textSecondary"
            sx={{ mb: 3, fontSize: { xs: '0.95rem', md: '1.2rem' } }}
          >
            Discover amazing products at great prices
          </Typography>
          <Button
            component={RouterLink}
            to="/products"
            variant="contained"
            color="primary"
            size="large"
            endIcon={<ArrowForward />}
            sx={{
              px: 4,
              py: 1.5,
              fontSize: '1rem',
              fontWeight: 600,
            }}
          >
            Shop Now
          </Button>
        </Box>

        {/* Features Section */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(4, 1fr)' },
            gap: 3,
            mb: { xs: 4, md: 6 },
          }}
        >
          <Card
            sx={{
              p: 3,
              textAlign: 'center',
              backgroundColor: theme.palette.background.paper,
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-8px)',
                boxShadow: theme.palette.mode === 'dark'
                  ? '0 8px 24px rgba(255,107,122,0.3)'
                  : '0 8px 24px rgba(233,69,96,0.15)',
              },
            }}
          >
            <LocalShipping
              sx={{
                fontSize: 48,
                color: theme.palette.primary.main,
                mb: 1,
              }}
            />
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
              Free Shipping
            </Typography>
            <Typography variant="body2" color="textSecondary">
              On orders over $100
            </Typography>
          </Card>

          <Card
            sx={{
              p: 3,
              textAlign: 'center',
              backgroundColor: theme.palette.background.paper,
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-8px)',
                boxShadow: theme.palette.mode === 'dark'
                  ? '0 8px 24px rgba(255,107,122,0.3)'
                  : '0 8px 24px rgba(233,69,96,0.15)',
              },
            }}
          >
            <VerifiedUser
              sx={{
                fontSize: 48,
                color: theme.palette.primary.main,
                mb: 1,
              }}
            />
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
              Secure Payment
            </Typography>
            <Typography variant="body2" color="textSecondary">
              100% safe transactions
            </Typography>
          </Card>

          <Card
            sx={{
              p: 3,
              textAlign: 'center',
              backgroundColor: theme.palette.background.paper,
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-8px)',
                boxShadow: theme.palette.mode === 'dark'
                  ? '0 8px 24px rgba(255,107,122,0.3)'
                  : '0 8px 24px rgba(233,69,96,0.15)',
              },
            }}
          >
            <Headset
              sx={{
                fontSize: 48,
                color: theme.palette.primary.main,
                mb: 1,
              }}
            />
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
              24/7 Support
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Always here to help
            </Typography>
          </Card>

          <Card
            sx={{
              p: 3,
              textAlign: 'center',
              backgroundColor: theme.palette.background.paper,
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-8px)',
                boxShadow: theme.palette.mode === 'dark'
                  ? '0 8px 24px rgba(255,107,122,0.3)'
                  : '0 8px 24px rgba(233,69,96,0.15)',
              },
            }}
          >
            <Box
              sx={{
                fontSize: 48,
                mb: 1,
                color: theme.palette.primary.main,
              }}
            >
              🎁
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
              Easy Returns
            </Typography>
            <Typography variant="body2" color="textSecondary">
              30-day return policy
            </Typography>
          </Card>
        </Box>

        {/* Featured Products Section */}
        <Box sx={{ mb: { xs: 4, md: 6 } }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 3,
              flexWrap: 'wrap',
              gap: 2,
            }}
          >
            <Typography
              variant="h3"
              sx={{
                fontWeight: 700,
                borderBottom: `3px solid ${theme.palette.primary.main}`,
                pb: 1,
                display: 'inline-block',
              }}
            >
              Featured Products
            </Typography>
            <Button
              component={RouterLink}
              to="/products"
              variant="text"
              color="primary"
              sx={{ fontWeight: 600 }}
            >
              View All →
            </Button>
          </Box>

          {loading ? (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '400px',
              }}
            >
              <CircularProgress color="primary" size={60} />
            </Box>
          ) : (
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: '1fr',
                  sm: 'repeat(2, 1fr)',
                  md: 'repeat(3, 1fr)',
                  lg: 'repeat(4, 1fr)',
                },
                gap: 3,
              }}
            >
              {featured.map((product) => (
                <Box key={product.id}>
                  <ProductCard product={product} />
                </Box>
              ))}
            </Box>
          )}
        </Box>

        {/* Categories Section */}
        <Box sx={{ mb: { xs: 4, md: 6 } }}>
          <Typography
            variant="h3"
            sx={{
              mb: 3,
              fontWeight: 700,
              borderBottom: `3px solid ${theme.palette.primary.main}`,
              pb: 1,
              display: 'inline-block',
            }}
          >
            Shop by Category
          </Typography>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
              gap: 2,
              mt: 2,
            }}
          >
            {['Electronics', 'Fashion', 'Home & Garden', 'Sports'].map((category) => (
              <Card
                key={category}
                component={RouterLink}
                to={`/products?category=${category.toLowerCase()}`}
                sx={{
                  p: 3,
                  textAlign: 'center',
                  backgroundColor: theme.palette.background.paper,
                  cursor: 'pointer',
                  textDecoration: 'none',
                  color: 'inherit',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    backgroundColor: theme.palette.primary.main,
                    color: 'white',
                    transform: 'scale(1.05)',
                  },
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  {category}
                </Typography>
              </Card>
            ))}
          </Box>
        </Box>

        {/* CTA Section */}
        <Box
          sx={{
            backgroundColor: theme.palette.primary.main,
            color: 'white',
            py: 6,
            px: { xs: 2, md: 4 },
            borderRadius: 2,
            textAlign: 'center',
            mb: 4,
            backgroundImage: 'linear-gradient(135deg, #e94560 0%, #c41e3a 100%)',
          }}
        >
          <Typography variant="h4" sx={{ mb: 2, fontWeight: 700 }}>
            Exclusive Deals Every Day
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, opacity: 0.9, fontSize: '1.1rem' }}>
            Sign up for our newsletter to get special offers and updates delivered to your inbox
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              color="inherit"
              size="large"
              sx={{
                backgroundColor: 'white',
                color: theme.palette.primary.main,
                fontWeight: 600,
                '&:hover': {
                  backgroundColor: '#f0f0f0',
                },
              }}
            >
              View All Deals
            </Button>
            <Button
              variant="outlined"
              size="large"
              sx={{
                borderColor: 'white',
                color: 'white',
                fontWeight: 600,
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  borderColor: 'white',
                },
              }}
            >
              Subscribe Now
            </Button>
          </Box>
        </Box>

        {/* Newsletter Section */}
        <Box
          sx={{
            backgroundColor: theme.palette.background.paper,
            p: 4,
            borderRadius: 2,
            textAlign: 'center',
            mb: 4,
          }}
        >
          <Typography variant="h5" sx={{ mb: 2, fontWeight: 700 }}>
            Stay Updated
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
            Get the latest updates on new products and upcoming sales
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}

export default Home;