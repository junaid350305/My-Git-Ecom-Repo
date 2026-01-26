import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  FormControlLabel,
  Checkbox,
  Divider,
  Stepper,
  Step,
  StepLabel,
  Alert,
  CircularProgress,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { ArrowBack, CheckCircle } from '@mui/icons-material';
import { CartContext } from '../context/CartContext';

const steps = ['Shipping', 'Payment', 'Review'];

function Checkout() {
  const { cart, clearCart } = useContext(CartContext);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState('');

  // Form States
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    cardNumber: '',
    cardExpiry: '',
    cardCVC: '',
  });

  const [sameAsShipping, setSameAsShipping] = useState(true);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  // Calculate totals
  const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
  const shipping = subtotal > 100 ? 0 : 10;
  const tax = subtotal * 0.1;
  const total = subtotal + shipping + tax;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNextStep = () => {
    if (activeStep < steps.length - 1) {
      setActiveStep(activeStep + 1);
    }
  };

  const handlePreviousStep = () => {
    if (activeStep > 0) {
      setActiveStep(activeStep - 1);
    }
  };

  const handlePlaceOrder = async () => {
    if (!agreedToTerms) {
      alert('Please agree to the terms and conditions');
      return;
    }

    setLoading(true);

    const orderData = {
      customer: {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        shipping: {
          street: formData.street,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          country: formData.country,
        },
      },
      items: cart,
      subtotal: subtotal,
      shipping: shipping,
      tax: tax,
      total: total,
      status: 'pending',
    };

    try {
      const response = await fetch('http://localhost:3001/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      const data = await response.json();
      setOrderId(data.id);
      setOrderPlaced(true);
      clearCart();

      setTimeout(() => {
        navigate(`/order-success/${data.id}`);
      }, 2000);
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Error placing order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0 && !orderPlaced) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="warning">
          Your cart is empty. Please add items before checking out.
        </Alert>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/products')}
          sx={{ mt: 2 }}
        >
          Back to Products
        </Button>
      </Container>
    );
  }

  if (orderPlaced) {
    return (
      <Box
        sx={{
          backgroundColor: theme.palette.background.default,
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
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
          <CheckCircle
            sx={{
              fontSize: 80,
              color: theme.palette.success.main,
              mb: 2,
            }}
          />
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
            Order Placed Successfully!
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
            Your order ID: <strong>{orderId}</strong>
          </Typography>
          {loading && <CircularProgress sx={{ mb: 2 }} />}
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
            onClick={() => navigate('/cart')}
            variant="text"
            color="primary"
          >
            Back to Cart
          </Button>
          <Typography variant="h3" sx={{ fontWeight: 700 }}>
            Checkout
          </Typography>
        </Box>

        {/* Stepper */}
        <Card sx={{ mb: 4, backgroundColor: theme.palette.background.paper, p: 2 }}>
          <Stepper activeStep={activeStep}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Card>

        <Grid container spacing={3}>
          {/* Checkout Form */}
          <Grid item xs={12} md={8}>
            <Card sx={{ backgroundColor: theme.palette.background.paper, p: 3 }}>
              {/* Shipping Step */}
              {activeStep === 0 && (
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
                    Shipping Information
                  </Typography>

                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="First Name"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Last Name"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Street Address"
                        name="street"
                        value={formData.street}
                        onChange={handleInputChange}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="City"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="State"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Zip Code"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleInputChange}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Country"
                        name="country"
                        value={formData.country}
                        onChange={handleInputChange}
                        variant="outlined"
                      />
                    </Grid>
                  </Grid>
                </Box>
              )}

              {/* Payment Step */}
              {activeStep === 1 && (
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
                    Payment Information
                  </Typography>

                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Card Number"
                        name="cardNumber"
                        placeholder="1234 5678 9012 3456"
                        value={formData.cardNumber}
                        onChange={handleInputChange}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Expiry Date"
                        name="cardExpiry"
                        placeholder="MM/YY"
                        value={formData.cardExpiry}
                        onChange={handleInputChange}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="CVC"
                        name="cardCVC"
                        placeholder="123"
                        value={formData.cardCVC}
                        onChange={handleInputChange}
                        variant="outlined"
                      />
                    </Grid>
                  </Grid>

                  <Divider sx={{ my: 3 }} />

                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={sameAsShipping}
                        onChange={(e) => setSameAsShipping(e.target.checked)}
                      />
                    }
                    label="Billing address same as shipping"
                  />
                </Box>
              )}

              {/* Review Step */}
              {activeStep === 2 && (
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
                    Order Review
                  </Typography>

                  <Alert severity="info" sx={{ mb: 3 }}>
                    Please review your order details before placing the order.
                  </Alert>

                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
                      Shipping To:
                    </Typography>
                    <Typography variant="body2">
                      {formData.firstName} {formData.lastName}
                    </Typography>
                    <Typography variant="body2">
                      {formData.street}, {formData.city}, {formData.state} {formData.zipCode}
                    </Typography>
                    <Typography variant="body2">{formData.country}</Typography>
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={agreedToTerms}
                        onChange={(e) => setAgreedToTerms(e.target.checked)}
                      />
                    }
                    label="I agree to the terms and conditions"
                  />
                </Box>
              )}

              {/* Navigation Buttons */}
              <Box sx={{ display: 'flex', gap: 2, mt: 4, justifyContent: 'space-between' }}>
                <Button
                  variant="outlined"
                  onClick={handlePreviousStep}
                  disabled={activeStep === 0}
                >
                  Previous
                </Button>

                {activeStep === steps.length - 1 ? (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handlePlaceOrder}
                    disabled={loading || !agreedToTerms}
                  >
                    {loading ? <CircularProgress size={24} /> : 'Place Order'}
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleNextStep}
                  >
                    Next
                  </Button>
                )}
              </Box>
            </Card>
          </Grid>

          {/* Order Summary Sidebar */}
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

              <Box sx={{ maxHeight: '300px', overflowY: 'auto', mb: 3 }}>
                {cart.map((item) => (
                  <Box key={item.id} sx={{ mb: 2, pb: 2, borderBottom: '1px solid #eee' }}>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {item.name}
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="caption" color="textSecondary">
                        Qty: {item.quantity}
                      </Typography>
                      <Typography variant="caption" sx={{ fontWeight: 600 }}>
                        ${(item.price * item.quantity).toFixed(2)}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="body2">Subtotal:</Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  ${subtotal.toFixed(2)}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="body2">Shipping:</Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  ${shipping.toFixed(2)}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="body2">Tax:</Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  ${tax.toFixed(2)}
                </Typography>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
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
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default Checkout;