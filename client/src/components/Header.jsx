import { useState, useContext, useCallback } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Box,
  IconButton,
  Badge,
  Button,
  Container,
  Link,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
  useTheme,
  useMediaQuery,
  InputBase,
  alpha,
} from '@mui/material';
import {
  ShoppingCart,
  Brightness4,
  Brightness7,
  Menu as MenuIcon,
  Close as CloseIcon,
  Search as SearchIcon,
  Home as HomeIcon,
  Widgets as WidgetsIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import { CartContext } from '../context/CartContext';

/* =========================
   SEARCH BAR (OUTSIDE HEADER)
========================= */
function SearchBar({ searchQuery, onChange, onSubmit }) {
  const theme = useTheme();

  return (
    <Box
      component="form"
      onSubmit={onSubmit}
      sx={{
        position: 'relative',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: alpha(theme.palette.common.white, 0.15),
        '&:hover': {
          backgroundColor: alpha(theme.palette.common.white, 0.25),
        },
        marginRight: theme.spacing(2),
        width: '100%',
      }}
    >
      <Box
        sx={{
          padding: theme.spacing(0, 2),
          height: '100%',
          position: 'absolute',
          pointerEvents: 'none',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <SearchIcon />
      </Box>

      <InputBase
        placeholder="Search products…"
        value={searchQuery}
        onChange={onChange}
        sx={{
          color: 'inherit',
          width: '100%',
          '& .MuiInputBase-input': {
            padding: theme.spacing(1, 1, 1, 0),
            paddingLeft: `calc(1em + ${theme.spacing(4)})`,
            transition: theme.transitions.create('width'),
            width: '100%',
            [theme.breakpoints.up('md')]: {
              width: '20ch',
              '&:focus': {
                width: '30ch',
              },
            },
          },
        }}
      />
    </Box>
  );
}

/* =========================
   HEADER
========================= */
function Header({ darkMode, onToggleTheme }) {
  const { cart } = useContext(CartContext);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  const navLinks = [
    { label: 'Home', path: '/', icon: <HomeIcon /> },
    { label: 'Products', path: '/products', icon: <WidgetsIcon /> },
    { label: 'About', path: '#', icon: <InfoIcon /> },
  ];

  const handleDrawerToggle = useCallback(() => {
    setMobileMenuOpen(prev => !prev);
  }, []);

  const handleSearchChange = useCallback((e) => {
    setSearchQuery(e.target.value);
  }, []);

  const handleSearch = useCallback(
    (e) => {
      e.preventDefault();
      if (searchQuery.trim()) {
        navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
      }
    },
    [searchQuery, navigate]
  );

  return (
    <AppBar
      position="sticky"
      sx={{
        backgroundColor: theme.palette.primary.dark || '#1a1a2e',
        boxShadow: `0 2px 8px ${alpha(theme.palette.common.black, 0.15)}`,
      }}
    >
      <Container maxWidth="lg">
        <Toolbar
          disableGutters
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 2,
            flexWrap: 'wrap',
          }}
        >
          {/* LEFT */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {isMobile && (
              <IconButton color="inherit" onClick={handleDrawerToggle}>
                <MenuIcon />
              </IconButton>
            )}

            <Link
              component={RouterLink}
              to="/"
              sx={{
                fontSize: isMobile ? '1.2rem' : '1.5rem',
                fontWeight: 700,
                color: '#e94560',
                textDecoration: 'none',
              }}
            >
              ShopEase
            </Link>
          </Box>

          {/* CENTER */}
          {!isMobile && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
              {navLinks.map(link => (
                <Button
                  key={link.label}
                  component={RouterLink}
                  to={link.path}
                  color="inherit"
                  sx={{ textTransform: 'none' }}
                >
                  {link.label}
                </Button>
              ))}

              <SearchBar
                searchQuery={searchQuery}
                onChange={handleSearchChange}
                onSubmit={handleSearch}
              />
            </Box>
          )}

          {/* RIGHT */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton onClick={onToggleTheme} color="inherit">
              {darkMode ? <Brightness7 /> : <Brightness4 />}
            </IconButton>

            <IconButton component={RouterLink} to="/cart" color="inherit">
              <Badge badgeContent={cartCount} color="error">
                <ShoppingCart />
              </Badge>
            </IconButton>
          </Box>

          {/* MOBILE SEARCH */}
          {isMobile && (
            <Box sx={{ width: '100%' }}>
              <SearchBar
                searchQuery={searchQuery}
                onChange={handleSearchChange}
                onSubmit={handleSearch}
              />
            </Box>
          )}
        </Toolbar>
      </Container>

      {/* DRAWER */}
      <Drawer anchor="left" open={mobileMenuOpen} onClose={handleDrawerToggle}>
        <Box sx={{ width: 280 }}>
          <Box
            sx={{
              p: 2,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Link component={RouterLink} to="/" sx={{ fontWeight: 700 }}>
              ShopEase
            </Link>
            <IconButton onClick={handleDrawerToggle}>
              <CloseIcon />
            </IconButton>
          </Box>

          <List>
            {navLinks.map(link => (
              <ListItem key={link.label} disablePadding>
                <ListItemButton
                  component={RouterLink}
                  to={link.path}
                  onClick={handleDrawerToggle}
                >
                  <ListItemText primary={link.label} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>

          <Divider />

          <Box sx={{ p: 2 }}>
            <IconButton onClick={onToggleTheme}>
              {darkMode ? <Brightness7 /> : <Brightness4 />}
            </IconButton>
          </Box>
        </Box>
      </Drawer>
    </AppBar>
  );
}

export default Header;