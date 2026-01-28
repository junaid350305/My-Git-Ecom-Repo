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
} from '@mui/material';
import {
  ShoppingCart,
  People,
  Inventory2,
  TrendingUp,
} from '@mui/icons-material';
import AdminLayout from '../components/AdminLayout';
import StatsCard from '../components/StatsCard';

function AdminDashboard() {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalUsers: 0,
    totalProducts: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(true);
  const theme = useTheme();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      // For now, using mock data since backend endpoints might not exist
      // Replace with actual API call when backend is ready
      setStats({
        totalOrders: 156,
        totalUsers: 1240,
        totalProducts: 89,
        totalRevenue: 45230.50,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
            Dashboard
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Welcome to ShopEase Admin Panel
          </Typography>
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

        {/* Quick Stats */}
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Card sx={{ backgroundColor: theme.palette.background.paper }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                  Recent Orders
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Recent orders will appear here
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Card sx={{ backgroundColor: theme.palette.background.paper }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                  Quick Stats
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Additional statistics will appear here
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </AdminLayout>
  );
}

export default AdminDashboard;