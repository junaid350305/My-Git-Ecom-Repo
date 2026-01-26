import { Link as RouterLink, useParams } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Button,
  Paper,
  useTheme,
} from '@mui/material';
import { CheckCircle } from '@mui/icons-material';

function OrderSuccess() {
  const { orderId } = useParams();
  const theme = useTheme();

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '60vh',
          py: 4,
        }}
      >
        <Paper
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: 4,
            textAlign: 'center',
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
          <Typography variant="h2" sx={{ mb: 2 }}>
            Order Placed Successfully!
          </Typography>
          <Typography
            variant="body1"
            color="textSecondary"
            sx={{ mb: 3 }}
          >
            Thank you for your purchase. You will receive a confirmation email
            shortly.
          </Typography>

          <Box
            sx={{
              backgroundColor: theme.palette.mode === 'dark' ? '#2a2a3e' : '#f5f5f5',
              padding: 2,
              borderRadius: 1,
              mb: 3,
              width: '100%',
            }}
          >
            <Typography variant="body2" color="textSecondary">
              Order ID
            </Typography>
            <Typography
              variant="h6"
              sx={{ fontFamily: 'monospace', fontWeight: 600 }}
            >
              {orderId}
            </Typography>
          </Box>

          <Button
            component={RouterLink}
            to="/products"
            variant="contained"
            color="primary"
            size="large"
            sx={{ width: '100%' }}
          >
            Continue Shopping
          </Button>
        </Paper>
      </Box>
    </Container>
  );
}

export default OrderSuccess;