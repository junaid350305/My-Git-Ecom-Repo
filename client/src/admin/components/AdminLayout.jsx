import { useState, useContext } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
  Box,
  AppBar,
  Drawer,
  Toolbar,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Menu,
  MenuItem,
  useTheme,
  useMediaQuery,
  Typography,
} from '@mui/material';
import {
  Dashboard,
  ShoppingCart,
  Inventory2,
  People,
  BarChart,
  Settings,
  Menu as MenuIcon,
  Close as CloseIcon,
  Logout,
  AccountCircle,
} from '@mui/icons-material';
import { AdminContext } from '../context/AdminContext';

const DRAWER_WIDTH = 260;

function AdminLayout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const { logout, admin } = useContext(AdminContext);
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const menuItems = [
    { label: 'Dashboard', icon: <Dashboard />, path: '/admin/dashboard' },
    { label: 'Products', icon: <Inventory2 />, path: '/admin/products' },
    { label: 'Orders', icon: <ShoppingCart />, path: '/admin/orders' },
    { label: 'Users', icon: <People />, path: '/admin/users' },
    { label: 'Reports', icon: <BarChart />, path: '/admin/reports' },
    { label: 'Settings', icon: <Settings />, path: '/admin/settings' },
  ];

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
    handleMenuClose();
  };

  const drawerContent = (
    <Box sx={{ pt: 2 }}>
      {/* Header - Clickable Logo */}
      <Link
        to="/"
        style={{
          textDecoration: 'none',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '0 16px',
          marginBottom: 24,
        }}
      >
        <ShoppingCart sx={{ fontSize: 28, color: theme.palette.primary.main }} />
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            color: theme.palette.primary.main,
            '&:hover': {
              opacity: 0.8,
            },
          }}
        >
          ShopEase
        </Typography>
      </Link>

      {/* Menu Items */}
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.label} disablePadding>
            <ListItemButton
              onClick={() => {
                navigate(item.path);
                if (isMobile) setMobileOpen(false);
              }}
              selected={location.pathname === item.path}
              sx={{
                '&:hover': {
                  backgroundColor: theme.palette.action.hover,
                  borderLeft: `4px solid ${theme.palette.primary.main}`,
                  paddingLeft: 'calc(16px - 4px)',
                },
                '&.Mui-selected': {
                  backgroundColor: `${theme.palette.primary.main}15`,
                  borderLeft: `4px solid ${theme.palette.primary.main}`,
                  paddingLeft: 'calc(16px - 4px)',
                  '&:hover': {
                    backgroundColor: `${theme.palette.primary.main}25`,
                  },
                },
              }}
            >
              <ListItemIcon sx={{ color: theme.palette.primary.main }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{
                  sx: {
                    fontWeight: 500,
                  },
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* Top App Bar */}
      <AppBar
        sx={{
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
          ml: { md: `${DRAWER_WIDTH}px` },
          backgroundColor: theme.palette.background.paper,
          color: theme.palette.text.primary,
          boxShadow: `0 2px 8px ${theme.palette.divider}`,
        }}
      >
        <Toolbar>
          {isMobile && (
            <IconButton
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
              color="inherit"
            >
              {mobileOpen ? <CloseIcon /> : <MenuIcon />}
            </IconButton>
          )}

          <Box sx={{ flexGrow: 1 }} />

          {/* User Menu */}
          <IconButton
            onClick={handleMenuOpen}
            sx={{
              p: 0,
              color: theme.palette.primary.main,
            }}
          >
            <AccountCircle sx={{ fontSize: 32 }} />
          </IconButton>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
          >
            <MenuItem disabled>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {admin?.name || 'Admin User'}
              </Typography>
            </MenuItem>
            <MenuItem disabled>
              <Typography variant="caption" color="textSecondary">
                {admin?.email || 'admin@shopease.com'}
              </Typography>
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              <Logout sx={{ mr: 1, fontSize: 20 }} />
              Logout
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      {/* Sidebar */}
      <Drawer
        variant={isMobile ? 'temporary' : 'permanent'}
        open={mobileOpen || !isMobile}
        onClose={handleDrawerToggle}
        sx={{
          width: DRAWER_WIDTH,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: DRAWER_WIDTH,
            boxSizing: 'border-box',
            backgroundColor: theme.palette.background.paper,
            borderRight: `1px solid ${theme.palette.divider}`,
            mt: { xs: 7, md: 0 },
            height: { xs: `calc(100vh - 56px)`, md: '100vh' },
          },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { xs: '100%', md: `calc(100% - ${DRAWER_WIDTH}px)` },
          backgroundColor: theme.palette.background.default,
          mt: 8,
          md: { mt: 0 },
          overflow: 'auto',
        }}
      >
        {children}
      </Box>
    </Box>
  );
}

export default AdminLayout;