import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Card,
  CardContent,
  useTheme,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Avatar,
  LinearProgress,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  ShoppingCart,
  People,
  Inventory2,
  TrendingUp,
  Visibility,
  LocalShipping,
  CheckCircle,
  Pending,
  Cancel,
  ArrowUpward,
  ArrowDownward,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../components/AdminLayout';
import StatsCard from '../components/StatsCard';

function AdminDashboard() {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalUsers: 0,
    totalProducts: 0,
    totalRevenue: 0,
    averageOrderValue: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();
  const navigate = useNavigate();

  const API_URL = 'http://localhost:3001/api/admin';

  const getAuthHeaders = () => ({
    'Content-Type': 'application/json',
    Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [summaryRes, ordersRes, productsRes, salesRes] = await Promise.all([
        fetch(`${API_URL}/reports/summary`, { headers: getAuthHeaders() }),
        fetch(`${API_URL}/orders`, { headers: getAuthHeaders() }),
        fetch(`${API_URL}/reports/top-products`, { headers: getAuthHeaders() }),
        fetch(`${API_URL}/reports/sales`, { headers: getAuthHeaders() }),
      ]);

      if (summaryRes.ok) {
        const summaryData = await summaryRes.json();
        setStats({
          totalOrders: summaryData.totalOrders || 0,
          totalUsers: summaryData.totalUsers || 0,
          totalProducts: summaryData.totalProducts || 0,
          totalRevenue: summaryData.totalRevenue || 0,
          averageOrderValue: parseFloat(summaryData.averageOrderValue) || 0,
        });
      }

      if (ordersRes.ok) {
        const ordersData = await ordersRes.json();
        setRecentOrders(Array.isArray(ordersData) ? ordersData.slice(0, 5) : []);
      }

      if (productsRes.ok) {
        const productsData = await productsRes.json();
        setTopProducts(Array.isArray(productsData) ? productsData.slice(0, 5) : []);
      }

      if (salesRes.ok) {
        const salesDataRes = await salesRes.json();
        setSalesData(Array.isArray(salesDataRes) ? salesDataRes : []);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusChip = (status) => {
    const statusConfig = {
      pending: { color: 'warning', icon: <Pending sx={{ fontSize: 14 }} /> },
      processing: { color: 'info', icon: <LocalShipping sx={{ fontSize: 14 }} /> },
      completed: { color: 'success', icon: <CheckCircle sx={{ fontSize: 14 }} /> },
      cancelled: { color: 'error', icon: <Cancel sx={{ fontSize: 14 }} /> },
      delivered: { color: 'success', icon: <CheckCircle sx={{ fontSize: 14 }} /> },
    };

    const config = statusConfig[status?.toLowerCase()] || statusConfig.pending;

    return (
      <Chip
        label={status || 'Pending'}
        size="small"
        color={config.color}
        icon={config.icon}
        sx={{ textTransform: 'capitalize' }}
      />
    );
  };

  const calculateTrend = () => {
    if (salesData.length < 2) return { value: 0, isUp: true };
    const current = salesData[salesData.length - 1]?.sales || 0;
    const previous = salesData[salesData.length - 2]?.sales || 1;
    const change = ((current - previous) / previous) * 100;
    return { value: Math.abs(change).toFixed(1), isUp: change >= 0 };
  };

  const trend = calculateTrend();
  const maxSales = Math.max(...topProducts.map((p) => p.sales || 0), 1);

  if (loading) {
    return (
      <AdminLayout>
        <Container sx={{ py: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
          <Box sx={{ textAlign: 'center' }}>
            <CircularProgress size={48} />
            <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
              Loading dashboard...
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
        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
              Dashboard
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Welcome to ShopEase Admin Panel
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, backgroundColor: theme.palette.background.paper, px: 2, py: 1, borderRadius: 2 }}>
            {trend.isUp ? (
              <ArrowUpward sx={{ color: 'success.main', fontSize: 20 }} />
            ) : (
              <ArrowDownward sx={{ color: 'error.main', fontSize: 20 }} />
            )}
            <Typography variant="body2" sx={{ fontWeight: 600, color: trend.isUp ? 'success.main' : 'error.main' }}>
              {trend.value}% vs last month
            </Typography>
          </Box>
        </Box>

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <StatsCard
              title="Total Orders"
              value={stats.totalOrders}
              icon={<ShoppingCart sx={{ fontSize: 40 }} />}
              color={theme.palette.primary.main}
              loading={loading}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <StatsCard
              title="Total Users"
              value={stats.totalUsers}
              icon={<People sx={{ fontSize: 40 }} />}
              color={theme.palette.info.main}
              loading={loading}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <StatsCard
              title="Total Products"
              value={stats.totalProducts}
              icon={<Inventory2 sx={{ fontSize: 40 }} />}
              color={theme.palette.success.main}
              loading={loading}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <StatsCard
              title="Total Revenue"
              value={`$${stats.totalRevenue.toFixed(2)}`}
              icon={<TrendingUp sx={{ fontSize: 40 }} />}
              color={theme.palette.warning.main}
              loading={loading}
            />
          </Grid>
        </Grid>

        {/* Main Content */}
        <Grid container spacing={3}>
          {/* Recent Orders */}
          <Grid size={{ xs: 12, lg: 8 }}>
            <Card sx={{ backgroundColor: theme.palette.background.paper, height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    Recent Orders
                  </Typography>
                  <Chip
                    label="View All"
                    size="small"
                    onClick={() => navigate('/admin/orders')}
                    sx={{ cursor: 'pointer' }}
                  />
                </Box>

                {recentOrders.length > 0 ? (
                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 700 }}>Order ID</TableCell>
                          <TableCell sx={{ fontWeight: 700 }}>Customer</TableCell>
                          <TableCell align="right" sx={{ fontWeight: 700 }}>Amount</TableCell>
                          <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                          <TableCell sx={{ fontWeight: 700 }}>Date</TableCell>
                          <TableCell align="center" sx={{ fontWeight: 700 }}>Action</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {recentOrders.map((order) => (
                          <TableRow key={order.id} hover>
                            <TableCell>
                              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                #{order.id?.slice(-6) || 'N/A'}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Avatar sx={{ width: 28, height: 28, fontSize: 12, bgcolor: 'primary.main' }}>
                                  {order.customer?.name?.charAt(0) || order.shippingAddress?.fullName?.charAt(0) || 'U'}
                                </Avatar>
                                <Typography variant="body2" noWrap sx={{ maxWidth: 100 }}>
                                  {order.customer?.name || order.shippingAddress?.fullName || 'Unknown'}
                                </Typography>
                              </Box>
                            </TableCell>
                            <TableCell align="right">
                              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                ${(order.total || 0).toFixed(2)}
                              </Typography>
                            </TableCell>
                            <TableCell>{getStatusChip(order.status)}</TableCell>
                            <TableCell>
                              <Typography variant="body2" color="textSecondary">
                                {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}
                              </Typography>
                            </TableCell>
                            <TableCell align="center">
                              <Tooltip title="View Details">
                                <IconButton size="small" onClick={() => navigate('/admin/orders')}>
                                  <Visibility sx={{ fontSize: 18 }} />
                                </IconButton>
                              </Tooltip>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                ) : (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <ShoppingCart sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
                    <Typography variant="body2" color="textSecondary">
                      No recent orders found
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Top Products */}
          <Grid size={{ xs: 12, lg: 4 }}>
            <Card sx={{ backgroundColor: theme.palette.background.paper, height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    Top Products
                  </Typography>
                  <Chip
                    label="View All"
                    size="small"
                    onClick={() => navigate('/admin/products')}
                    sx={{ cursor: 'pointer' }}
                  />
                </Box>

                {topProducts.length > 0 ? (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {topProducts.map((product, index) => (
                      <Box key={product.id}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography
                              variant="body2"
                              sx={{
                                fontWeight: 700,
                                color: index < 3 ? 'primary.main' : 'text.secondary',
                                minWidth: 20,
                              }}
                            >
                              #{index + 1}
                            </Typography>
                            <Typography variant="body2" noWrap sx={{ maxWidth: 140, fontWeight: 500 }}>
                              {product.name}
                            </Typography>
                          </Box>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {product.sales} sold
                          </Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={(product.sales / maxSales) * 100}
                          sx={{
                            height: 6,
                            borderRadius: 3,
                            backgroundColor: theme.palette.action.hover,
                            '& .MuiLinearProgress-bar': {
                              borderRadius: 3,
                              backgroundColor: index === 0 ? 'primary.main' : index === 1 ? 'info.main' : index === 2 ? 'success.main' : 'grey.400',
                            },
                          }}
                        />
                      </Box>
                    ))}
                  </Box>
                ) : (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <Inventory2 sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
                    <Typography variant="body2" color="textSecondary">
                      No product data available
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Monthly Sales Overview */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Card sx={{ backgroundColor: theme.palette.background.paper }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                  Monthly Sales
                </Typography>
                {salesData.length > 0 ? (
                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 700 }}>Month</TableCell>
                          <TableCell align="right" sx={{ fontWeight: 700 }}>Sales</TableCell>
                          <TableCell align="right" sx={{ fontWeight: 700 }}>Orders</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {salesData.slice(-4).map((row) => (
                          <TableRow key={row.month} hover>
                            <TableCell>{row.month}</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 600 }}>
                              ${row.sales.toLocaleString()}
                            </TableCell>
                            <TableCell align="right">{row.orders}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                ) : (
                  <Typography variant="body2" color="textSecondary" sx={{ textAlign: 'center', py: 4 }}>
                    No sales data available
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Quick Stats */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Card sx={{ backgroundColor: theme.palette.background.paper, height: '100%' }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                  Quick Stats
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, backgroundColor: theme.palette.action.hover, borderRadius: 2 }}>
                    <Box>
                      <Typography variant="body2" color="textSecondary">
                        Average Order Value
                      </Typography>
                      <Typography variant="h5" sx={{ fontWeight: 700 }}>
                        ${stats.averageOrderValue.toFixed(2)}
                      </Typography>
                    </Box>
                    <TrendingUp sx={{ fontSize: 32, color: 'success.main' }} />
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, backgroundColor: theme.palette.action.hover, borderRadius: 2 }}>
                    <Box>
                      <Typography variant="body2" color="textSecondary">
                        Orders per User
                      </Typography>
                      <Typography variant="h5" sx={{ fontWeight: 700 }}>
                        {stats.totalUsers > 0 ? (stats.totalOrders / stats.totalUsers).toFixed(2) : '0.00'}
                      </Typography>
                    </Box>
                    <People sx={{ fontSize: 32, color: 'info.main' }} />
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, backgroundColor: theme.palette.action.hover, borderRadius: 2 }}>
                    <Box>
                      <Typography variant="body2" color="textSecondary">
                        Revenue per Product
                      </Typography>
                      <Typography variant="h5" sx={{ fontWeight: 700 }}>
                        ${stats.totalProducts > 0 ? (stats.totalRevenue / stats.totalProducts).toFixed(2) : '0.00'}
                      </Typography>
                    </Box>
                    <Inventory2 sx={{ fontSize: 32, color: 'warning.main' }} />
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </AdminLayout>
  );
}

export default AdminDashboard;