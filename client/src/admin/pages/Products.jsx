import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  useTheme,
  Typography,
  Alert,
  CircularProgress,
  Chip,
  InputAdornment,
  Avatar,
  Tooltip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
  TablePagination,
} from '@mui/material';
import {
  Edit,
  Delete,
  Add,
  Close as CloseIcon,
  Search,
  Inventory,
  AttachMoney,
  Category,
  ImageOutlined,
  Warning,
  CheckCircle,
  Error,
  Refresh,
  FilterList,
} from '@mui/icons-material';
import AdminLayout from '../components/AdminLayout';

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    stock: '',
    category: '',
    description: '',
    image: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [stockFilter, setStockFilter] = useState('all');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const theme = useTheme();

  const API_URL = 'http://localhost:3001/api';

  const getAuthHeaders = () => ({
    'Content-Type': 'application/json',
    Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/products`);
      const data = await response.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name || '',
        price: product.price || '',
        stock: product.stock || '',
        category: product.category || '',
        description: product.description || '',
        image: product.image || '',
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: '',
        price: '',
        stock: '',
        category: '',
        description: '',
        image: '',
      });
    }
    setOpenDialog(true);
    setError('');
    setSuccess('');
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingProduct(null);
    setFormData({
      name: '',
      price: '',
      stock: '',
      category: '',
      description: '',
      image: '',
    });
    setError('');
  };

  const handleSaveProduct = async () => {
    try {
      if (!formData.name || !formData.price || !formData.stock) {
        setError('Please fill in all required fields');
        return;
      }

      const url = editingProduct
        ? `${API_URL}/admin/products/${editingProduct.id}`
        : `${API_URL}/admin/products`;

      const method = editingProduct ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: getAuthHeaders(),
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          stock: parseInt(formData.stock),
        }),
      });

      if (response.ok) {
        setSuccess(editingProduct ? 'Product updated successfully' : 'Product created successfully');
        setTimeout(() => {
          fetchProducts();
          handleCloseDialog();
          setSuccess('');
        }, 1000);
      } else {
        const err = await response.json();
        setError(err.message || 'Failed to save product');
      }
    } catch (error) {
      setError('Error saving product: ' + error.message);
    }
  };

  const handleDeleteClick = (product) => {
    setEditingProduct(product);
    setDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      const response = await fetch(`${API_URL}/admin/products/${editingProduct.id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });

      if (response.ok) {
        setSuccess('Product deleted successfully');
        fetchProducts();
      } else {
        setError('Failed to delete product');
      }
    } catch (error) {
      setError('Error deleting product');
    }
    setDeleteDialog(false);
    setEditingProduct(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const getStockStatus = (stock) => {
    const stockNum = parseInt(stock) || 0;
    if (stockNum === 0) {
      return { label: 'Out of Stock', color: 'error', icon: <Error sx={{ fontSize: 14 }} /> };
    } else if (stockNum <= 10) {
      return { label: 'Low Stock', color: 'warning', icon: <Warning sx={{ fontSize: 14 }} /> };
    }
    return { label: 'In Stock', color: 'success', icon: <CheckCircle sx={{ fontSize: 14 }} /> };
  };

  // Get unique categories for filter
  const categories = [...new Set(products.map((p) => p.category).filter(Boolean))];

  // Filter products
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;

    const stockNum = parseInt(product.stock) || 0;
    const matchesStock =
      stockFilter === 'all' ||
      (stockFilter === 'instock' && stockNum > 10) ||
      (stockFilter === 'lowstock' && stockNum > 0 && stockNum <= 10) ||
      (stockFilter === 'outofstock' && stockNum === 0);

    return matchesSearch && matchesCategory && matchesStock;
  });

  // Pagination
  const paginatedProducts = filteredProducts.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  // Stats
  const totalProducts = products.length;
  const totalValue = products.reduce((sum, p) => sum + (parseFloat(p.price) || 0) * (parseInt(p.stock) || 0), 0);
  const lowStockCount = products.filter((p) => parseInt(p.stock) > 0 && parseInt(p.stock) <= 10).length;
  const outOfStockCount = products.filter((p) => parseInt(p.stock) === 0).length;

  if (loading) {
    return (
      <AdminLayout>
        <Container sx={{ py: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
          <Box sx={{ textAlign: 'center' }}>
            <CircularProgress size={48} />
            <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
              Loading products...
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
              Products Management
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Manage all products in your store
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Tooltip title="Refresh">
              <IconButton onClick={fetchProducts} color="primary">
                <Refresh />
              </IconButton>
            </Tooltip>
            <Button
              variant="contained"
              color="primary"
              startIcon={<Add />}
              onClick={() => handleOpenDialog()}
              sx={{ fontWeight: 600 }}
            >
              Add Product
            </Button>
          </Box>
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
                <Inventory sx={{ color: 'primary.main' }} />
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 700 }}>
                    {totalProducts}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Total Products
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
                    ${totalValue.toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Inventory Value
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
          <Card>
            <CardContent sx={{ py: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Warning sx={{ color: 'warning.main' }} />
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 700 }}>
                    {lowStockCount}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Low Stock
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
          <Card>
            <CardContent sx={{ py: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Error sx={{ color: 'error.main' }} />
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 700 }}>
                    {outOfStockCount}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Out of Stock
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
              placeholder="Search products..."
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
              <InputLabel>Category</InputLabel>
              <Select
                value={categoryFilter}
                label="Category"
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <MenuItem value="all">All Categories</MenuItem>
                {categories.map((cat) => (
                  <MenuItem key={cat} value={cat}>
                    {cat}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl sx={{ minWidth: 150 }}>
              <InputLabel>Stock Status</InputLabel>
              <Select
                value={stockFilter}
                label="Stock Status"
                onChange={(e) => setStockFilter(e.target.value)}
              >
                <MenuItem value="all">All Status</MenuItem>
                <MenuItem value="instock">In Stock</MenuItem>
                <MenuItem value="lowstock">Low Stock</MenuItem>
                <MenuItem value="outofstock">Out of Stock</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Paper>

        {/* Products Table */}
        <TableContainer component={Paper} sx={{ backgroundColor: theme.palette.background.paper }}>
          <Table>
            <TableHead sx={{ backgroundColor: theme.palette.action.hover }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>Product</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Category</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700 }}>Price</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700 }}>Stock</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                <TableCell align="center" sx={{ fontWeight: 700 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedProducts.length > 0 ? (
                paginatedProducts.map((product) => {
                  const stockStatus = getStockStatus(product.stock);
                  return (
                    <TableRow key={product.id} hover>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Avatar
                            src={product.image}
                            variant="rounded"
                            sx={{ width: 48, height: 48, bgcolor: 'grey.200' }}
                          >
                            <ImageOutlined />
                          </Avatar>
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              {product.name}
                            </Typography>
                            <Typography variant="caption" color="textSecondary" noWrap sx={{ maxWidth: 200, display: 'block' }}>
                              {product.description || 'No description'}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          icon={<Category sx={{ fontSize: 14 }} />}
                          label={product.category || 'Uncategorized'}
                          size="small"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="body2" sx={{ fontWeight: 700 }}>
                          ${parseFloat(product.price).toFixed(2)}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {product.stock}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          icon={stockStatus.icon}
                          label={stockStatus.label}
                          size="small"
                          color={stockStatus.color}
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Tooltip title="Edit">
                          <IconButton
                            size="small"
                            onClick={() => handleOpenDialog(product)}
                            color="primary"
                          >
                            <Edit sx={{ fontSize: 20 }} />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton
                            size="small"
                            onClick={() => handleDeleteClick(product)}
                            color="error"
                          >
                            <Delete sx={{ fontSize: 20 }} />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                    <Inventory sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
                    <Typography color="textSecondary">No products found</Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          <TablePagination
            component="div"
            count={filteredProducts.length}
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

        {/* Add/Edit Product Dialog */}
        <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            {editingProduct ? 'Edit Product' : 'Add New Product'}
            <IconButton onClick={handleCloseDialog} size="small">
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent dividers>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
              {error && <Alert severity="error">{error}</Alert>}

              {/* Image Preview */}
              {formData.image && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
                  <Avatar
                    src={formData.image}
                    variant="rounded"
                    sx={{ width: 120, height: 120, bgcolor: 'grey.200' }}
                  >
                    <ImageOutlined sx={{ fontSize: 48 }} />
                  </Avatar>
                </Box>
              )}

              <TextField
                label="Product Name *"
                fullWidth
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter product name"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Inventory />
                    </InputAdornment>
                  ),
                }}
              />

              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                  label="Price *"
                  type="number"
                  fullWidth
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  inputProps={{ step: '0.01', min: '0' }}
                  placeholder="0.00"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <AttachMoney />
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  label="Stock *"
                  type="number"
                  fullWidth
                  name="stock"
                  value={formData.stock}
                  onChange={handleInputChange}
                  inputProps={{ min: '0' }}
                  placeholder="0"
                />
              </Box>

              <TextField
                label="Category"
                fullWidth
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                placeholder="e.g., Electronics"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Category />
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                label="Description"
                fullWidth
                multiline
                rows={3}
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter product description"
              />

              <TextField
                label="Image URL"
                fullWidth
                name="image"
                value={formData.image}
                onChange={handleInputChange}
                placeholder="https://example.com/image.jpg"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <ImageOutlined />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 2, gap: 1 }}>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button
              onClick={handleSaveProduct}
              variant="contained"
              color="primary"
              sx={{ fontWeight: 600 }}
            >
              {editingProduct ? 'Update Product' : 'Create Product'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteDialog} onClose={() => setDeleteDialog(false)}>
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              {editingProduct?.image && (
                <Avatar
                  src={editingProduct.image}
                  variant="rounded"
                  sx={{ width: 60, height: 60 }}
                />
              )}
              <Box>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                  {editingProduct?.name}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  ${parseFloat(editingProduct?.price || 0).toFixed(2)} • {editingProduct?.stock} in stock
                </Typography>
              </Box>
            </Box>
            <Alert severity="warning">
              Are you sure you want to delete this product? This action cannot be undone.
            </Alert>
          </DialogContent>
          <DialogActions sx={{ p: 2, gap: 1 }}>
            <Button onClick={() => setDeleteDialog(false)}>Cancel</Button>
            <Button onClick={handleDeleteConfirm} color="error" variant="contained">
              Delete Product
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </AdminLayout>
  );
}

export default Products;