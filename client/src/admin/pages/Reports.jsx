import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  useTheme,
  Typography,
  Alert,
  CircularProgress,
  Card,
  CardContent,
} from '@mui/material';
import {
  TrendingUp,
  ShoppingCart,
  People,
  Inventory,
  AttachMoney,
} from '@mui/icons-material';
import AdminLayout from '../components/AdminLayout';

function Reports() {
  const [summary, setSummary] = useState(null);
  const [salesData, setSalesData] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const theme = useTheme();

  const API_URL = 'http://localhost:3001/api/admin';

  const getAuthHeaders = () => ({
    'Content-Type': 'application/json',
    Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
  });

  useEffect(() => {
    fetchReportData();
  }, []);

  const fetchReportData = async () => {
    try {
      const [summaryRes, salesRes, productsRes] = await Promise.all([
        fetch(`${API_URL}/reports/summary`, { headers: getAuthHeaders() }),
        fetch(`${API_URL}/reports/sales`, { headers: getAuthHeaders() }),
        fetch(`${API_URL}/reports/top-products`, { headers: getAuthHeaders() }),
      ]);

      if (!summaryRes.ok || !salesRes.ok || !productsRes.ok) {
        throw new Error('Failed to fetch report data');
      }

      const [summaryData, salesDataRes, topProductsRes] = await Promise.all([
        summaryRes.json(),
        salesRes.json(),
        productsRes.json(),
      ]);

      setSummary(summaryData);
      setSalesData(salesDataRes);
      setTopProducts(topProductsRes);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon, color }) => (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography color="textSecondary" variant="body2" gutterBottom>
              {title}
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              {value}
            </Typography>
          </Box>
          <Box
            sx={{
              backgroundColor: `${color}.light`,
              borderRadius: '50%',
              p: 1.5,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

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
            Reports & Analytics
          </Typography>
          <Typography variant="body2" color="textSecondary">
            View your store performance and statistics
          </Typography>
        </Box>

        {/* Alerts */}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        {/* Summary Cards */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(4, 1fr)' },
            gap: 3,
            mb: 4,
          }}
        >
          <StatCard
            title="Total Revenue"
            value={`$${summary?.totalRevenue?.toFixed(2) || '0.00'}`}
            icon={<AttachMoney sx={{ color: 'success.main' }} />}
            color="success"
          />
          <StatCard
            title="Total Orders"
            value={summary?.totalOrders || 0}
            icon={<ShoppingCart sx={{ color: 'primary.main' }} />}
            color="primary"
          />
          <StatCard
            title="Total Products"
            value={summary?.totalProducts || 0}
            icon={<Inventory sx={{ color: 'warning.main' }} />}
            color="warning"
          />
          <StatCard
            title="Total Users"
            value={summary?.totalUsers || 0}
            icon={<People sx={{ color: 'info.main' }} />}
            color="info"
          />
        </Box>

        {/* Tables Section */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1.4fr 1fr' },
            gap: 3,
            mb: 4,
          }}
        >
          {/* Monthly Sales Table */}
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <TrendingUp /> Monthly Sales Overview
            </Typography>
            <TableContainer>
              <Table>
                <TableHead sx={{ backgroundColor: theme.palette.action.hover }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700 }}>Month</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700 }}>Sales ($)</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700 }}>Orders</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700 }}>Avg. Order</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {salesData.map((row) => (
                    <TableRow key={row.month} hover>
                      <TableCell>{row.month}</TableCell>
                      <TableCell align="right">${row.sales.toLocaleString()}</TableCell>
                      <TableCell align="right">{row.orders}</TableCell>
                      <TableCell align="right">${(row.sales / row.orders).toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>

          {/* Top Products Table */}
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <Inventory /> Top Selling Products
            </Typography>
            <TableContainer>
              <Table size="small">
                <TableHead sx={{ backgroundColor: theme.palette.action.hover }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700 }}>Product</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700 }}>Sales</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700 }}>Revenue</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {topProducts.map((product) => (
                    <TableRow key={product.id} hover>
                      <TableCell>
                        <Typography noWrap sx={{ maxWidth: 150 }}>
                          {product.name}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">{product.sales}</TableCell>
                      <TableCell align="right">${product.revenue.toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Box>

        {/* Key Metrics */}
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
            Key Metrics
          </Typography>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' },
              gap: 2,
            }}
          >
            <Box sx={{ textAlign: 'center', p: 2 }}>
              <Typography variant="h3" color="primary" sx={{ fontWeight: 700 }}>
                ${summary?.averageOrderValue || '0.00'}
              </Typography>
              <Typography color="textSecondary">Average Order Value</Typography>
            </Box>
            <Box sx={{ textAlign: 'center', p: 2 }}>
              <Typography variant="h3" color="success.main" sx={{ fontWeight: 700 }}>
                {summary?.totalOrders > 0
                  ? ((summary?.totalOrders / summary?.totalUsers) || 0).toFixed(1)
                  : '0'}
              </Typography>
              <Typography color="textSecondary">Orders per User</Typography>
            </Box>
            <Box sx={{ textAlign: 'center', p: 2 }}>
              <Typography variant="h3" color="warning.main" sx={{ fontWeight: 700 }}>
                {summary?.totalProducts || 0}
              </Typography>
              <Typography color="textSecondary">Products in Catalog</Typography>
            </Box>
          </Box>
        </Paper>
      </Container>
    </AdminLayout>
  );
}

export default Reports;