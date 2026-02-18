import React from 'react';
import { useContext } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box,
  Rating,
  Chip,
  useTheme,
} from '@mui/material';
import { ShoppingCart, FavoriteBorder, Favorite } from '@mui/icons-material';
import { CartContext } from '../context/CartContext';

function ProductCard({ product }) {
  const { addToCart } = useContext(CartContext);
  const theme = useTheme();
  const [isFavorite, setIsFavorite] = React.useState(false);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  };

  const handleToggleFavorite = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  const stockStatus = product.stock > 0 ? 'In Stock' : 'Out of Stock';
  const stockColor = product.stock > 0 ? 'success' : 'error';
  const categoryLabel = product.category ? product.category : 'General';
  const imageUrl = product.image ? product.image : '/images/placeholder.jpg';

  return (
    <Card
      component={RouterLink}
      to={`/product/${product.id}`}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.3s ease',
        cursor: 'pointer',
        textDecoration: 'none',
        color: 'inherit',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: theme.palette.mode === 'dark'
            ? '0 8px 24px rgba(255,107,122,0.3)'
            : '0 8px 24px rgba(233,69,96,0.2)',
        },
      }}
    >
      {/* Image Container */}
      <Box sx={{ position: 'relative', overflow: 'hidden' }}>
        <CardMedia
          component="img"
          height="220"
          image={imageUrl}
          alt={product.name}
          sx={{
            objectFit: 'cover',
            transition: 'transform 0.3s ease',
            backgroundColor: theme.palette.grey[100],
          }}
        />

        {/* Stock Chip */}
        <Chip
          label={stockStatus}
          color={stockColor}
          size="small"
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            fontWeight: 600,
            fontSize: '0.7rem',
          }}
        />

        {/* Favorite Button */}
        <Button
          onClick={handleToggleFavorite}
          sx={{
            position: 'absolute',
            top: 8,
            left: 8,
            minWidth: 'auto',
            padding: '6px',
            backgroundColor: 'rgba(255,255,255,0.9)',
            borderRadius: '50%',
            '&:hover': {
              backgroundColor: 'white',
            },
          }}
        >
          {isFavorite ? (
            <Favorite sx={{ color: theme.palette.error.main, fontSize: 20 }} />
          ) : (
            <FavoriteBorder sx={{ color: theme.palette.text.secondary, fontSize: 20 }} />
          )}
        </Button>
      </Box>

      {/* Content */}
      <CardContent sx={{ flexGrow: 1, p: 2 }}>
        <Typography
          variant="caption"
          color="textSecondary"
          sx={{ mb: 0.5, display: 'block', textTransform: 'uppercase', letterSpacing: 0.5 }}
        >
          {categoryLabel}
        </Typography>
        <Typography
          variant="subtitle1"
          sx={{
            fontWeight: 600,
            minHeight: '2.8rem',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            mb: 1,
            lineHeight: 1.4,
          }}
        >
          {product.name}
        </Typography>

        {/* Rating */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
          <Rating value={4} readOnly size="small" />
          <Typography variant="caption" color="textSecondary">
            (48)
          </Typography>
        </Box>

        {/* Price */}
        <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              color: theme.palette.primary.main,
            }}
          >
            ${Number(product.price).toFixed(2)}
          </Typography>
          {product.originalPrice && (
            <Typography
              variant="body2"
              sx={{
                textDecoration: 'line-through',
                color: 'text.secondary',
              }}
            >
              ${Number(product.originalPrice).toFixed(2)}
            </Typography>
          )}
        </Box>
      </CardContent>

      {/* Actions */}
      <CardActions sx={{ p: 2, pt: 0 }}>
        <Button
          fullWidth
          variant="contained"
          color="primary"
          size="small"
          startIcon={<ShoppingCart />}
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          sx={{
            fontWeight: 600,
            textTransform: 'none',
            py: 1,
          }}
        >
          Add to Cart
        </Button>
      </CardActions>
    </Card>
  );
}

export default ProductCard;