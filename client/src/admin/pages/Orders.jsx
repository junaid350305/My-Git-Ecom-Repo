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
  DialogActions,
  Button,
  useTheme,
  Alert,
  CircularProgress,
  IconButton,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Avatar,
  Tooltip,
  Card,
  CardContent,
  TablePagination,
  Divider,
  Stepper,
  Step,
  StepLabel,
} from '@mui/material';
import {
  Close as CloseIcon,
  Visibility,
  Search,
  ShoppingCart,
  LocalShipping,
  CheckCircle,
  Pending,
  Cancel,
  Refresh,
  AttachMoney,
  Person,
  Email,
  Phone,
  LocationOn,
  CalendarToday,
  Receipt,
  TrendingUp,
  Schedule,
} from '@mui/icons-material';
import AdminLayout from '../components/AdminLayout';

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [statusDialog, setStatusDialog] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const theme = useTheme();

  const API_URL = 'http://localhost:3001/api/admin';

  const getAuthHeaders = () => ({
    'Content-Type': 'application/json',
    Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
  });

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/orders`, {
        headers: getAuthHeaders(),
      });
      
      if (response.ok) {
        const data = await response.json();
        setOrders(Array.isArray(data) ? data : []);
      } else {
        throw new Error('Failed to fetch orders');
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      setError('Failed to fetch orders');
    } finally {
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

  const handleStatusClick = (order) => {
    setSelectedOrder(order);
    setNewStatus(order.status || 'pending');
    setStatusDialog(true);
  };

  const handleStatusUpdate = async () => {
    try {
      // Note: You'll need to add this endpoint to your server.js
      const response = await fetch(`${API_URL}/orders/${selectedOrder.id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        setSuccess('Order status updated successfully');
        setOrders(orders.map(o => 
          o.id === selectedOrder.id ? { ...o, status: newStatus } : o
        ));
        setStatusDialog(false);
        setSelectedOrder(null);
      } else {
        throw new Error('Failed to update status');
      }
    } catch (error) {
      setError('Failed to update order status');
    }
  };

  const getStatusConfig = (status) => {
    const configs = {
      pending: { color: 'warning', icon: <Pending sx={{ fontSize: 14 }} />, label: 'Pending' },
      processing: { color: 'info', icon: <Schedule sx={{ fontSize: 14 }} />, label: 'Processing' },
      shipped: { color: 'primary', icon: <LocalShipping sx={{ fontSize: 14 }} />, label: 'Shipped' },
      delivered: { color: 'success', icon: <CheckCircle sx={{ fontSize: 14 }} />, label: 'Delivered' },
      cancelled: { color: 'error', icon: <Cancel sx={{ fontSize: 14 }} />, label: 'Cancelled' },
    };
    return configs[status?.toLowerCase()] || configs.pending;
  };

  const getStatusStep = (status) => {
    const steps = ['pending', 'processing', 'shipped', 'delivered'];
    if (status === 'cancelled') return -1;
    return steps.indexOf(status?.toLowerCase()) || 0;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const isWithinDays = (dateString, days) => {
    if (!dateString) return false;
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = now - date;
    const diffDays = diffTime / (1000 * 60 * 60 * 24);
    return diffDays <= days;
  };

  // Filter orders
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.shippingAddress?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerEmail?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || order.status?.toLowerCase() === statusFilter;

    let matchesDate = true;
    if (dateFilter === 'today') {
      matchesDate = isWithinDays(order.createdAt, 1);
    } else if (dateFilter === 'week') {
      matchesDate = isWithinDays(order.createdAt, 7);
    } else if (dateFilter === 'month') {
      matchesDate = isWithinDays(order.createdAt, 30);
    }

    return matchesSearch && matchesStatus && matchesDate;
  });

  // Pagination
  const paginatedOrders = filteredOrders.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  // Stats
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, o) => sum + (o.totalAmount || o.total || 0), 0);
  const pendingOrders = orders.filter((o) => o.status?.toLowerCase() === 'pending').length;
  const completedOrders = orders.filter((o) => o.status?.toLowerCase() === 'delivered').length;

  const getCustomerName = (order) => {
    return order.customerName || order.customer?.name || order.shippingAddress?.fullName || 'Unknown';
  };

  const getCustomerEmail = (order) => {
    return order.customerEmail || order.customer?.email || order.shippingAddress?.email || 'N/A';
  };

  const getOrderTotal = (order) => {
    return order.totalAmount || order.total || 0;
  };

  if (loading) {
    return (
      <AdminLayout>
        <Container sx={{ py: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
          <Box sx={{ textAlign: 'center' }}>
            <CircularProgress size={48} />
            <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
              Loading orders...
            </Typography>
          </Box>
        </Container>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Header */}
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
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              Orders Management
            </Typography>
            <Typography variant="body2" color="textSecondary">
              View and manage all customer orders
            </Typography>
          </Box>
          <Tooltip title="Refresh">
            <IconButton onClick={fetchOrders} color="primary">
              <Refresh />
            </IconButton>
          </Tooltip>
        </Box>

        {/* Stats Cards */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr 1fr', md: 'repeat(4, 1fr)' },
            gap: 2,
            mb: 3,
          }}
        >
          <Card>
            <CardContent sx={{ py: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <ShoppingCart sx={{ color: 'primary.main' }} />
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 700 }}>
                    {totalOrders}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Total Orders
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
          <Card>
            <CardContent sx={{ py: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <AttachMoney sx={{ color: 'success.main' }} />
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 700 }}>
                    ${totalRevenue.toFixed(2)}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Total Revenue
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
          <Card>
            <CardContent sx={{ py: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Pending sx={{ color: 'warning.main' }} />
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 700 }}>
                    {pendingOrders}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Pending
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
          <Card>
            <CardContent sx={{ py: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CheckCircle sx={{ color: 'success.main' }} />
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 700 }}>
                    {completedOrders}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Completed
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>

        {/* Alerts */}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>
            {success}
          </Alert>
        )}

        {/* Search and Filters */}
        <Paper sx={{ p: 2, mb: 3 }}>
          <Box
            sx={{
              display: 'flex',
              gap: 2,
              flexWrap: 'wrap',
              alignItems: 'center',
            }}
          >
            <TextField
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{ flexGrow: 1, minWidth: 200 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
            />
            <FormControl sx={{ minWidth: 150 }}>
              <InputLabel>Status</InputLabel>
              <Select
                value={statusFilter}
                label="Status"
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <MenuItem value="all">All Status</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="processing">Processing</MenuItem>
                <MenuItem value="shipped">Shipped</MenuItem>
                <MenuItem value="delivered">Delivered</MenuItem>
                <MenuItem value="cancelled">Cancelled</MenuItem>
              </Select>
            </FormControl>
            <FormControl sx={{ minWidth: 150 }}>
              <InputLabel>Date Range</InputLabel>
              <Select
                value={dateFilter}
                label="Date Range"
                onChange={(e) => setDateFilter(e.target.value)}
              >
                <MenuItem value="all">All Time</MenuItem>
                <MenuItem value="today">Today</MenuItem>
                <MenuItem value="week">This Week</MenuItem>
                <MenuItem value="month">This Month</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Paper>

        {/* Orders Table */}
        <TableContainer component={Paper} sx={{ backgroundColor: theme.palette.background.paper }}>
          <Table>
            <TableHead sx={{ backgroundColor: theme.palette.action.hover }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>Order ID</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Customer</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Date</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Items</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700 }}>Amount</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                <TableCell align="center" sx={{ fontWeight: 700 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedOrders.length > 0 ? (
                paginatedOrders.map((order) => {
                  const statusConfig = getStatusConfig(order.status);
                  return (
                    <TableRow key={order.id} hover>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          #{order.id?.slice(-8) || order.id}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main', fontSize: 14 }}>
                            {getCustomerName(order).charAt(0)}
                          </Avatar>
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                              {getCustomerName(order)}
                            </Typography>
                            <Typography variant="caption" color="textSecondary">
                              {getCustomerEmail(order)}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {formatDate(order.createdAt)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={`${order.items?.length || 0} items`}
                          size="small"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="body2" sx={{ fontWeight: 700 }}>
                          ${getOrderTotal(order).toFixed(2)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          icon={statusConfig.icon}
                          label={statusConfig.label}
                          size="small"
                          color={statusConfig.color}
                          onClick={() => handleStatusClick(order)}
                          sx={{ cursor: 'pointer' }}
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Tooltip title="View Details">
                          <IconButton
                            size="small"
                            onClick={() => handleViewOrder(order)}
                            color="primary"
                          >
                            <Visibility sx={{ fontSize: 20 }} />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                    <ShoppingCart sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
                    <Typography color="textSecondary">No orders found</Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          <TablePagination
            component="div"
            count={filteredOrders.length}
            page={page}
            onPageChange={(e, newPage) => setPage(newPage)}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={(e) => {
              setRowsPerPage(parseInt(e.target.value, 10));
              setPage(0);
            }}
            rowsPerPageOptions={[5, 10, 25, 50]}
          />
        </TableContainer>

        {/* Order Details Dialog */}
        <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
          <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Receipt />
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Order #{selectedOrder?.id?.slice(-8) || selectedOrder?.id}
              </Typography>
            </Box>
            <IconButton onClick={handleCloseDialog} size="small">
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent dividers>
            {selectedOrder && (
              <Box>
                {/* Order Status Stepper */}
                {selectedOrder.status?.toLowerCase() !== 'cancelled' && (
                  <Box sx={{ mb: 4 }}>
                    <Stepper activeStep={getStatusStep(selectedOrder.status)} alternativeLabel>
                      {['Pending', 'Processing', 'Shipped', 'Delivered'].map((label) => (
                        <Step key={label}>
                          <StepLabel>{label}</StepLabel>
                        </Step>
                      ))}
                    </Stepper>
                  </Box>
                )}

                {selectedOrder.status?.toLowerCase() === 'cancelled' && (
                  <Alert severity="error" sx={{ mb: 3 }}>
                    This order has been cancelled.
                  </Alert>
                )}

                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
                    gap: 3,
                  }}
                >
                  {/* Customer Info */}
                  <Paper sx={{ p: 2 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Person /> Customer Information
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Avatar sx={{ width: 40, height: 40, bgcolor: 'primary.main' }}>
                          {getCustomerName(selectedOrder).charAt(0)}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {getCustomerName(selectedOrder)}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            Customer
                          </Typography>
                        </Box>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Email sx={{ fontSize: 18, color: 'text.secondary' }} />
                        <Typography variant="body2">
                          {getCustomerEmail(selectedOrder)}
                        </Typography>
                      </Box>
                      {(selectedOrder.shippingAddress?.phone || selectedOrder.phone) && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Phone sx={{ fontSize: 18, color: 'text.secondary' }} />
                          <Typography variant="body2">
                            {selectedOrder.shippingAddress?.phone || selectedOrder.phone}
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  </Paper>

                  {/* Shipping Info */}
                  <Paper sx={{ p: 2 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                      <LocalShipping /> Shipping Information
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                        <LocationOn sx={{ fontSize: 18, color: 'text.secondary', mt: 0.3 }} />
                        <Typography variant="body2">
                          {selectedOrder.shippingAddress?.address || 'N/A'}
                          {selectedOrder.shippingAddress?.city && `, ${selectedOrder.shippingAddress.city}`}
                          {selectedOrder.shippingAddress?.state && `, ${selectedOrder.shippingAddress.state}`}
                          {selectedOrder.shippingAddress?.zipCode && ` ${selectedOrder.shippingAddress.zipCode}`}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CalendarToday sx={{ fontSize: 18, color: 'text.secondary' }} />
                        <Typography variant="body2">
                          Ordered on {formatDateTime(selectedOrder.createdAt)}
                        </Typography>
                      </Box>
                    </Box>
                  </Paper>
                </Box>

                {/* Order Items */}
                <Paper sx={{ p: 2, mt: 3 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <ShoppingCart /> Order Items
                  </Typography>
                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 700 }}>Product</TableCell>
                          <TableCell align="center" sx={{ fontWeight: 700 }}>Quantity</TableCell>
                          <TableCell align="right" sx={{ fontWeight: 700 }}>Price</TableCell>
                          <TableCell align="right" sx={{ fontWeight: 700 }}>Total</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {selectedOrder.items?.map((item, idx) => (
                          <TableRow key={idx}>
                            <TableCell>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                {item.image && (
                                  <Avatar src={item.image} variant="rounded" sx={{ width: 40, height: 40 }} />
                                )}
                                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                  {item.name || item.productName || 'Product'}
                                </Typography>
                              </Box>
                            </TableCell>
                            <TableCell align="center">{item.quantity || 1}</TableCell>
                            <TableCell align="right">${(item.price || 0).toFixed(2)}</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 600 }}>
                              ${((item.price || 0) * (item.quantity || 1)).toFixed(2)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>

                  <Divider sx={{ my: 2 }} />

                  {/* Order Summary */}
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 0.5 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', width: 200 }}>
                      <Typography variant="body2" color="textSecondary">Subtotal:</Typography>
                      <Typography variant="body2">${(getOrderTotal(selectedOrder) - (selectedOrder.shipping || 0)).toFixed(2)}</Typography>
                    </Box>
                    {selectedOrder.shipping > 0 && (
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', width: 200 }}>
                        <Typography variant="body2" color="textSecondary">Shipping:</Typography>
                        <Typography variant="body2">${selectedOrder.shipping.toFixed(2)}</Typography>
                      </Box>
                    )}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', width: 200, mt: 1 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>Total:</Typography>
                      <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'primary.main' }}>
                        ${getOrderTotal(selectedOrder).toFixed(2)}
                      </Typography>
                    </Box>
                  </Box>
                </Paper>
              </Box>
            )}
          </DialogContent>
          <DialogActions sx={{ p: 2, gap: 1 }}>
            <Button onClick={handleCloseDialog}>Close</Button>
            <Button
              variant="contained"
              onClick={() => {
                handleCloseDialog();
                handleStatusClick(selectedOrder);
              }}
            >
              Update Status
            </Button>
          </DialogActions>
        </Dialog>

        {/* Status Update Dialog */}
        <Dialog open={statusDialog} onClose={() => setStatusDialog(false)} maxWidth="xs" fullWidth>
          <DialogTitle>Update Order Status</DialogTitle>
          <DialogContent>
            <Box sx={{ pt: 1 }}>
              <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                Order #{selectedOrder?.id?.slice(-8) || selectedOrder?.id}
              </Typography>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={newStatus}
                  label="Status"
                  onChange={(e) => setNewStatus(e.target.value)}
                >
                  <MenuItem value="pending">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Pending sx={{ color: 'warning.main' }} /> Pending
                    </Box>
                  </MenuItem>
                  <MenuItem value="processing">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Schedule sx={{ color: 'info.main' }} /> Processing
                    </Box>
                  </MenuItem>
                  <MenuItem value="shipped">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <LocalShipping sx={{ color: 'primary.main' }} /> Shipped
                    </Box>
                  </MenuItem>
                  <MenuItem value="delivered">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CheckCircle sx={{ color: 'success.main' }} /> Delivered
                    </Box>
                  </MenuItem>
                  <MenuItem value="cancelled">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Cancel sx={{ color: 'error.main' }} /> Cancelled
                    </Box>
                  </MenuItem>
                </Select>
              </FormControl>
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 2, gap: 1 }}>
            <Button onClick={() => setStatusDialog(false)}>Cancel</Button>
            <Button variant="contained" onClick={handleStatusUpdate}>
              Update Status
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </AdminLayout>
  );
}

export default Orders;