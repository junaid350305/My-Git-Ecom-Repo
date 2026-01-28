import { useState, useEffect, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { lightTheme, darkTheme } from './theme/theme';
import Header from './components/Header';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import { CartProvider } from './context/CartContext';
import { AdminProvider, AdminContext } from './admin/context/AdminContext';

// Admin Pages
import AdminLogin from './admin/pages/AdminLogin';
import AdminDashboard from './admin/pages/AdminDashboard';
import AdminProducts from './admin/pages/Products';
import AdminOrders from './admin/pages/Orders';
import Users from './admin/pages/Users';
import Reports from './admin/pages/Reports';
import Settings from './admin/pages/Settings';

// Protected Route Component
function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useContext(AdminContext);

  if (loading) return null;

  return isAuthenticated ? children : <Navigate to="/admin/login" replace />;
}

function AppContent({ darkMode, toggleTheme }) {
  return (
    <Routes>
      {/* Customer Routes */}
      <Route
        path="/*"
        element={
          <CartProvider>
            <Header darkMode={darkMode} onToggleTheme={toggleTheme} />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<Products />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/order-success/:orderId" element={<OrderSuccess />} />
            </Routes>
          </CartProvider>
        }
      />

      {/* Admin Routes */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/products"
        element={
          <ProtectedRoute>
            <AdminProducts />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/orders"
        element={
          <ProtectedRoute>
            <AdminOrders />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/users"
        element={
          <ProtectedRoute>
            <Users />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/reports"
        element={
          <ProtectedRoute>
            <Reports />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/settings"
        element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

function App() {
  const [darkMode, setDarkMode] = useState(false);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  return (
    <AdminProvider>
      <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
        <CssBaseline />
        <Router>
          <AppContent darkMode={darkMode} toggleTheme={toggleTheme} />
        </Router>
      </ThemeProvider>
    </AdminProvider>
  );
}

export default App;