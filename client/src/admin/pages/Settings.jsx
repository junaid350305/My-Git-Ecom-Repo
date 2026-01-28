import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Paper,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  Divider,
  useTheme,
  Typography,
  Alert,
  CircularProgress,
  InputAdornment,
  Snackbar,
} from '@mui/material';
import {
  Store,
  Email,
  Phone,
  LocationOn,
  LocalShipping,
  Save,
} from '@mui/icons-material';
import AdminLayout from '../components/AdminLayout';

function Settings() {
  const [settings, setSettings] = useState({
    storeName: '',
    storeEmail: '',
    storePhone: '',
    storeAddress: '',
    currency: 'USD',
    taxRate: 0,
    shippingFee: 0,
    freeShippingThreshold: 0,
    maintenanceMode: false,
    allowGuestCheckout: true,
    maxOrderItems: 20,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const theme = useTheme();

  const API_URL = 'http://localhost:3001/api/admin';

  const getAuthHeaders = () => ({
    'Content-Type': 'application/json',
    Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch(`${API_URL}/settings`, {
        headers: getAuthHeaders(),
      });
      if (!response.ok) throw new Error('Failed to fetch settings');
      const data = await response.json();
      setSettings(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleChange = (field) => (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setSettings({ ...settings, [field]: value });
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError('');

      const response = await fetch(`${API_URL}/settings`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(settings),
      });

      if (!response.ok) throw new Error('Failed to save settings');

      setSuccess(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
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
              Store Settings
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Configure your store preferences
            </Typography>
          </Box>
          <Button
            variant="contained"
            color="primary"
            startIcon={saving ? <CircularProgress size={20} color="inherit" /> : <Save />}
            onClick={handleSave}
            disabled={saving}
            sx={{ fontWeight: 600 }}
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </Box>

        {/* Alerts */}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
            gap: 3,
          }}
        >
          {/* Store Information */}
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <Store /> Store Information
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                label="Store Name"
                value={settings.storeName}
                onChange={handleChange('storeName')}
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Store />
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                label="Store Email"
                type="email"
                value={settings.storeEmail}
                onChange={handleChange('storeEmail')}
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email />
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                label="Store Phone"
                value={settings.storePhone}
                onChange={handleChange('storePhone')}
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Phone />
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                label="Store Address"
                value={settings.storeAddress}
                onChange={handleChange('storeAddress')}
                fullWidth
                multiline
                rows={2}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LocationOn />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
          </Paper>

          {/* Pricing & Shipping */}
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <LocalShipping /> Pricing & Shipping
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                label="Currency"
                value={settings.currency}
                onChange={handleChange('currency')}
                fullWidth
              />
              <TextField
                label="Tax Rate (%)"
                type="number"
                value={settings.taxRate}
                onChange={handleChange('taxRate')}
                fullWidth
                InputProps={{
                  endAdornment: <InputAdornment position="end">%</InputAdornment>,
                }}
              />
              <TextField
                label="Default Shipping Fee"
                type="number"
                value={settings.shippingFee}
                onChange={handleChange('shippingFee')}
                fullWidth
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
              />
              <TextField
                label="Free Shipping Threshold"
                type="number"
                value={settings.freeShippingThreshold}
                onChange={handleChange('freeShippingThreshold')}
                fullWidth
                helperText="Orders above this amount get free shipping"
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
              />
            </Box>
          </Paper>
        </Box>

        {/* General Settings */}
        <Paper sx={{ p: 3, mt: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
            General Settings
          </Typography>

          <TextField
            label="Max Items per Order"
            type="number"
            value={settings.maxOrderItems}
            onChange={handleChange('maxOrderItems')}
            sx={{ mb: 2, maxWidth: 300 }}
          />

          <Divider sx={{ my: 2 }} />

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={settings.allowGuestCheckout}
                  onChange={handleChange('allowGuestCheckout')}
                  color="primary"
                />
              }
              label="Allow Guest Checkout"
            />
            <Typography variant="body2" color="textSecondary" sx={{ ml: 6, mt: -1 }}>
              Allow customers to checkout without creating an account
            </Typography>

            <FormControlLabel
              control={
                <Switch
                  checked={settings.maintenanceMode}
                  onChange={handleChange('maintenanceMode')}
                  color="warning"
                />
              }
              label="Maintenance Mode"
              sx={{ mt: 1 }}
            />
            <Typography variant="body2" color="textSecondary" sx={{ ml: 6, mt: -1 }}>
              When enabled, the store will show a maintenance page to visitors
            </Typography>
          </Box>
        </Paper>

        <Snackbar
          open={success}
          autoHideDuration={3000}
          onClose={() => setSuccess(false)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert severity="success" onClose={() => setSuccess(false)}>
            Settings saved successfully!
          </Alert>
        </Snackbar>
      </Container>
    </AdminLayout>
  );
}

export default Settings;