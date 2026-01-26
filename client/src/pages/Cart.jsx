import { useContext } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Divider,
  Alert,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { Delete, ShoppingBag, ArrowBack } from '@mui/icons-material';
import { CartContext } from '../context/CartContext';

function Cart() {
  const { cart, removeFromCart, updateQuantity, clearCart } = useContext(CartContext);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
  const shipping = subtotal > 100 ? 0 : 10;
  const tax = subtotal * 0.1;
  const total = subtotal + shipping + tax;

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity > 0) {
      updateQuantity(productId, newQuantity);
    }
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  if (cart.length === 0) {
    return (
      <Box
        sx={{
          backgroundColor: theme.palette.background.default,
          minHeight: '80vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          py: 4,
        }}
      >
        <Card
          sx={{
            textAlign: 'center',
            p: 4,
            maxWidth: '500px',
            backgroundColor: theme.palette.background.paper,
          }}
        >
          <ShoppingBag
            sx={{
              fontSize: 80,
              color: theme.palette.primary.main,
              mb: 2,
              opacity: 0.5,
            }}
          />
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
            Your Cart is Empty
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
            Start shopping and add items to your cart to proceed with checkout.
          </Typography>
          <Button
            component={RouterLink}
            to="/products"
            variant="contained"
            color="primary"
            size="large"
            startIcon={<ShoppingBag />}
          >
            Continue Shopping
          </Button>
        </Card>
      </Box>
    );
  }

  return (
    <Box sx={{ backgroundColor: theme.palette.background.default, minHeight: '100vh', py: 4 }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button
            startIcon={<ArrowBack />}
            onClick={() => navigate('/products')}
            variant="text"
            color="primary"
          >
            Continue Shopping
          </Button>
          <Typography variant="h3" sx={{ fontWeight: 700 }}>
            Shopping Cart
          </Typography>
        </Box>

        {/* Success Alert */}
        {cart.length > 0 && (
          <Alert severity="info" sx={{ mb: 3 }}>
            You have {cart.length} item(s) in your cart
          </Alert>
        )}

        <Grid container spacing={3}>
          {/* Cart Items */}
          <Grid item xs={12} md={8}>
            <Card sx={{ backgroundColor: theme.palette.background.paper }}>
              {isMobile ? (
                // Mobile View - Card Layout
                <Box sx={{ p: 2 }}>
                  {cart.map((item) => (
                    <Card
                      key={item.id}
                      sx={{
                        mb: 2,
                        p: 2,
                        backgroundColor: theme.palette.mode === 'dark' ? '#2a2a3e' : '#f9f9f9',
                      }}
                    >
                      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                        <Box
                          component="img"
                          src={item.image}
                          alt={item.name}
                          sx={{
                            width: '80px',
                            height: '80px',
                            objectFit: 'cover',
                            borderRadius: 1,
                          }}
                        />
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                            {item.name}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            ${item.price.toFixed(2)}
                          </Typography>
                        </Box>
                      </Box>

                      <Divider sx={{ my: 1 }} />

                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <TextField
                            type="number"
                            value={item.quantity}
                            onChange={(e) =>
                              handleQuantityChange(
                                item.id,
                                parseInt(e.target.value) || 1
                              )
                            }
                            inputProps={{ min: 1 }}
                            size="small"
                            sx={{ width: '60px' }}
                          />
                          <Typography variant="body2">
                            = ${(item.price * item.quantity).toFixed(2)}
                          </Typography>
                        </Box>
                        <IconButton
                          color="error"
                          onClick={() => removeFromCart(item.id)}
                          size="small"
                        >
                          <Delete />
                        </IconButton>
                      </Box>
                    </Card>
                  ))}
                </Box>
              ) : (
                // Desktop View - Table Layout
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow
                        sx={{
                          backgroundColor: theme.palette.mode === 'dark' ? '#2a2a3e' : '#f5f5f5',
                        }}
                      >
                        <TableCell sx={{ fontWeight: 700 }}>Product</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 700 }}>
                          Price
                        </TableCell>
                        <TableCell align="center" sx={{ fontWeight: 700 }}>
                          Quantity
                        </TableCell>
                        <TableCell align="right" sx={{ fontWeight: 700 }}>
                          Total
                        </TableCell>
                        <TableCell align="center" sx={{ fontWeight: 700 }}>
                          Action
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {cart.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                              <Box
                                component="img"
                                src={item.image}
                                alt={item.name}
                                sx={{
                                  width: '60px',
                                  height: '60px',
                                  objectFit: 'cover',
                                  borderRadius: 1,
                                }}
                              />
                              <Box>
                                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                  {item.name}
                                </Typography>
                                <Typography variant="caption" color="textSecondary">
                                  {item.category}
                                </Typography>
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell align="right">
                            ${item.price.toFixed(2)}
                          </TableCell>
                          <TableCell align="center">
                            <TextField
                              type="number"
                              value={item.quantity}
                              onChange={(e) =>
                                handleQuantityChange(
                                  item.id,
                                  parseInt(e.target.value) || 1
                                )
                              }
                              inputProps={{ min: 1 }}
                              size="small"
                              sx={{ width: '60px' }}
                            />
                          </TableCell>
                          <TableCell align="right">
                            ${(item.price * item.quantity).toFixed(2)}
                          </TableCell>
                          <TableCell align="center">
                            <IconButton
                              color="error"
                              onClick={() => removeFromCart(item.id)}
                              size="small"
                            >
                              <Delete />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </Card>

            {/* Clear Cart Button */}
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant="outlined"
                color="error"
                onClick={clearCart}
              >
                Clear Cart
              </Button>
            </Box>
          </Grid>

          {/* Order Summary */}
          <Grid item xs={12} md={4}>
            <Card
              sx={{
                backgroundColor: theme.palette.background.paper,
                p: 3,
                position: 'sticky',
                top: 20,
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
                Order Summary
              </Typography>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="body2">Subtotal:</Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  ${subtotal.toFixed(2)}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="body2">
                  Shipping: {shipping === 0 ? '(Free)' : ''}
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  ${shipping.toFixed(2)}
                </Typography>
              </Box>

              {shipping > 0 && (
                <Typography variant="caption" color="textSecondary" sx={{ mb: 2, display: 'block' }}>
                  Free shipping on orders over $100
                </Typography>
              )}

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="body2">Tax (10%):</Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  ${tax.toFixed(2)}
                </Typography>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  mb: 3,
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  Total:
                </Typography>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 700, color: theme.palette.primary.main }}
                >
                  ${total.toFixed(2)}
                </Typography>
              </Box>

              <Button
                fullWidth
                variant="contained"
                color="primary"
                size="large"
                onClick={handleCheckout}
                sx={{ fontWeight: 600, mb: 2 }}
              >
                Proceed to Checkout
              </Button>

              <Button
                fullWidth
                variant="outlined"
                color="primary"
                component={RouterLink}
                to="/products"
              >
                Continue Shopping
              </Button>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default Cart;