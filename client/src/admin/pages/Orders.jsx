import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  useTheme,
  Alert,
  CircularProgress,
  Grid,
  IconButton,
} from '@mui/material';
import { Close as CloseIcon, Visibility } from '@mui/icons-material';
import AdminLayout from '../components/AdminLayout';

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [error, setError] = useState('');
  const theme = useTheme();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      // Mock data for now - replace with actual API call
      setOrders([
        {
          id: 'ORD001',
          customerName: 'John Doe',
          customerEmail: 'john@example.com',
          createdAt: new Date().toISOString(),
          totalAmount: 299.99,
          status: 'delivered',
          items: [{ name: 'Product 1', quantity: 1, price: 299.99 }],
        },
        {
          id: 'ORD002',
          customerName: 'Jane Smith',
          customerEmail: 'jane@example.com',
          createdAt: new Date().toISOString(),
          totalAmount: 599.99,
          status: 'processing',
          items: [{ name: 'Product 2', quantity: 2, price: 299.99 }],
        },
      ]);
      setLoading(false);
    } catch (error) {
      setError('Failed to fetch orders');
      setLoading(false);
    }
  };

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedOrder(null);
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'warning',
      processing: 'info',
      shipped: 'primary',
      delivered: 'success',
      cancelled: 'error',
    };
    return colors[status] || 'default';
  };

  if (loading) {
    return (
      <AdminLayout>
        <Container sx={{ py: 4, display: 'flex', justifyContent: 'center' }}>
          <CircularProgress />
        </Container>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Header */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Orders Management
          </Typography>
          <Typography variant="body2" color="textSecondary">
            View and manage all customer orders
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        {/* Orders Table */}
        <TableContainer component={Paper} sx={{ backgroundColor: theme.palette.background.paper }}>
          <Table>
            <TableHead sx={{ backgroundColor: theme.palette.action.hover }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>Order ID</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Customer</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Date</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700 }}>
                  Amount
                </TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                <TableCell align="center" sx={{ fontWeight: 700 }}>
                  Action
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.length > 0 ? (
                orders.map((order) => (
                  <TableRow key={order.id} hover>
                    <TableCell sx={{ fontWeight: 600 }}>{order.id}</TableCell>
                    <TableCell>{order.customerName}</TableCell>
                    <TableCell>
                      {new Date(order.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell align="right" sx={{ fontWeight: 600 }}>
                      ${order.totalAmount.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        color={getStatusColor(order.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        size="small"
                        onClick={() => handleViewOrder(order)}
                        color="primary"
                        title="View Details"
                      >
                        <Visibility sx={{ fontSize: 20 }} />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                    <Typography color="textSecondary">No orders found</Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Order Details Dialog */}
        <Dialog
          open={openDialog}
          onClose={handleCloseDialog}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            Order Details
            <IconButton onClick={handleCloseDialog} size="small">
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent sx={{ pt: 2 }}>
            {selectedOrder && (
              <Grid container spacing={2}>
                <Grid size={12}>
                  <Typography variant="body2" color="textSecondary">
                    Order ID
                  </Typography>
                  <Typography sx={{ fontWeight: 600 }}>
                    {selectedOrder.id}
                  </Typography>
                </Grid>
                <Grid size={12}>
                  <Typography variant="body2" color="textSecondary">
                    Customer
                  </Typography>
                  <Typography sx={{ fontWeight: 600 }}>
                    {selectedOrder.customerName}
                  </Typography>
                  <Typography variant="body2">{selectedOrder.customerEmail}</Typography>
                </Grid>
                <Grid size={12}>
                  <Typography variant="body2" color="textSecondary">
                    Order Date
                  </Typography>
                  <Typography>
                    {new Date(selectedOrder.createdAt).toLocaleString()}
                  </Typography>
                </Grid>
                <Grid size={12}>
                  <Typography variant="body2" color="textSecondary">
                    Status
                  </Typography>
                  <Chip
                    label={selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
                    color={getStatusColor(selectedOrder.status)}
                  />
                </Grid>
                <Grid size={12}>
                  <Typography variant="body2" color="textSecondary">
                    Items
                  </Typography>
                  {selectedOrder.items?.map((item, idx) => (
                    <Box key={idx} sx={{ mt: 1, p: 1, backgroundColor: theme.palette.action.hover, borderRadius: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {item.name}
                      </Typography>
                      <Typography variant="caption">
                        Qty: {item.quantity} × ${item.price}
                      </Typography>
                    </Box>
                  ))}
                </Grid>
                <Grid size={12}>
                  <Typography variant="body2" color="textSecondary">
                    Total Amount
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: theme.palette.primary.main }}>
                    ${selectedOrder.totalAmount.toFixed(2)}
                  </Typography>
                </Grid>
              </Grid>
            )}
          </DialogContent>
        </Dialog>
      </Container>
    </AdminLayout>
  );
}

export default Orders;