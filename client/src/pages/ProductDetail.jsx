import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Grid,
  Typography,
  Button,
  Card,
  CardContent,
  TextField,
  Chip,
  Rating,
  Divider,
  CircularProgress,
  Alert,
  useTheme,
} from '@mui/material';
import {
  ShoppingCart,
  Favorite,
  FavoriteBorder,
  LocalShipping,
  VerifiedUser,
} from '@mui/icons-material';
import { CartContext } from '../context/CartContext';

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const theme = useTheme();

  useEffect(() => {
    fetch(`http://localhost:3001/api/products/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setProduct(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching product:', err);
        setLoading(false);
      });
  }, [id]);

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 3000);
  };

  const handleQuantityChange = (e) => {
    const value = Math.max(1, parseInt(e.target.value) || 1);
    setQuantity(Math.min(value, product.stock));
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate('/checkout');
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
        }}
      >
        <CircularProgress color="primary" size={60} />
      </Box>
    );
  }

  if (!product) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">Product not found</Alert>
      </Container>
    );
  }

  const stockStatus = product.stock > 0 ? 'In Stock' : 'Out of Stock';
  const stockColor = product.stock > 0 ? 'success' : 'error';

  return (
    <Box sx={{ backgroundColor: theme.palette.background.default, minHeight: '100vh', py: 4 }}>
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Product Image */}
          <Grid item xs={12} md={5}>
            <Card
              sx={{
                backgroundColor: theme.palette.background.paper,
                overflow: 'hidden',
              }}
            >
              <Box
                component="img"
                src={product.image}
                alt={product.name}
                sx={{
                  width: '100%',
                  height: 'auto',
                  maxHeight: '500px',
                  objectFit: 'cover',
                }}
              />
            </Card>
          </Grid>

          {/* Product Details */}
          <Grid item xs={12} md={7}>
            <Card
              sx={{
                backgroundColor: theme.palette.background.paper,
                p: 3,
              }}
            >
              <CardContent sx={{ p: 0 }}>
                {/* Category & Stock */}
                <Box sx={{ display: 'flex', gap: 2, mb: 2, alignItems: 'center' }}>
                  <Chip
                    label={product.category}
                    color="primary"
                    variant="outlined"
                  />
                  <Chip
                    label={stockStatus}
                    color={stockColor}
                    variant="filled"
                  />
                </Box>

                {/* Title */}
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
                  {product.name}
                </Typography>

                {/* Rating */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Rating value={4} readOnly />
                  <Typography variant="body2" color="textSecondary">
                    (48 reviews)
                  </Typography>
                </Box>

                <Divider sx={{ my: 2 }} />

                {/* Price */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                    Price
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 2 }}>
                    <Typography
                      variant="h3"
                      sx={{ fontWeight: 700, color: theme.palette.primary.main }}
                    >
                      ${product.price.toFixed(2)}
                    </Typography>
                    {product.originalPrice && (
                      <Typography
                        variant="h6"
                        sx={{
                          textDecoration: 'line-through',
                          color: 'textSecondary',
                        }}
                      >
                        ${product.originalPrice.toFixed(2)}
                      </Typography>
                    )}
                  </Box>
                </Box>

                {/* Description */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                    Description
                  </Typography>
                  <Typography variant="body1">{product.description}</Typography>
                </Box>

                {/* Stock Info */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                    Available Stock: {product.stock}
                  </Typography>
                </Box>

                <Divider sx={{ my: 2 }} />

                {/* Add to Cart Section */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                    Quantity
                  </Typography>
                  <TextField
                    type="number"
                    value={quantity}
                    onChange={handleQuantityChange}
                    inputProps={{ min: 1, max: product.stock }}
                    sx={{ width: '100px', mb: 2 }}
                  />
                </Box>

                {/* Add to Cart Alert */}
                {addedToCart && (
                  <Alert severity="success" sx={{ mb: 2 }}>
                    Product added to cart!
                  </Alert>
                )}

                {/* Action Buttons */}
                <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                  <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    size="large"
                    startIcon={<ShoppingCart />}
                    onClick={handleAddToCart}
                    disabled={product.stock === 0}
                    sx={{ fontWeight: 600 }}
                  >
                    Add to Cart
                  </Button>
                  <Button
                    fullWidth
                    variant="outlined"
                    color="primary"
                    size="large"
                    onClick={handleBuyNow}
                    disabled={product.stock === 0}
                    sx={{ fontWeight: 600 }}
                  >
                    Buy Now
                  </Button>
                </Box>

                <Button
                  fullWidth
                  variant="text"
                  startIcon={isFavorite ? <Favorite /> : <FavoriteBorder />}
                  onClick={() => setIsFavorite(!isFavorite)}
                  sx={{
                    color: isFavorite ? theme.palette.error.main : 'inherit',
                    fontWeight: 600,
                  }}
                >
                  {isFavorite ? 'Remove from Wishlist' : 'Add to Wishlist'}
                </Button>

                <Divider sx={{ my: 2 }} />

                {/* Shipping & Support Info */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <LocalShipping color="primary" />
                    <Typography variant="body2">
                      Free shipping on orders over $100
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <VerifiedUser color="primary" />
                    <Typography variant="body2">
                      Secure checkout & buyer protection
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default ProductDetail;