import { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  Typography,
  Paper,
  CircularProgress,
  Chip,
  Button,
  useTheme,
  useMediaQuery,
  Drawer,
  IconButton,
} from '@mui/material';
import { FilterList, Close } from '@mui/icons-material';
import ProductCard from '../components/ProductCard';

function Products() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [sortBy, setSortBy] = useState('');
  const [categories, setCategories] = useState([]);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Fetch products
  useEffect(() => {
    fetch('http://localhost:3001/api/products')
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setFilteredProducts(data);
        // Extract unique categories
        const uniqueCategories = [...new Set(data.map((p) => p.category))];
        setCategories(uniqueCategories);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching products:', err);
        setLoading(false);
      });
  }, []);

  // Filter products
  useEffect(() => {
    let filtered = products;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter((p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory) {
      filtered = filtered.filter((p) => p.category === selectedCategory);
    }

    // Price filter
    filtered = filtered.filter(
      (p) => p.price >= priceRange[0] && p.price <= priceRange[1]
    );

    // Sort
    if (sortBy === 'price-low') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      filtered.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'newest') {
      filtered.reverse();
    }

    setFilteredProducts(filtered);
  }, [searchTerm, selectedCategory, priceRange, sortBy, products]);

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setPriceRange([0, 10000]);
    setSortBy('');
  };

  // Filter Panel Component
  const FilterPanel = () => (
    <Paper
      sx={{
        p: 3,
        backgroundColor: theme.palette.background.paper,
        borderRadius: 2,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2,
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          Filters
        </Typography>
        {isMobile && (
          <IconButton
            size="small"
            onClick={() => setMobileDrawerOpen(false)}
          >
            <Close />
          </IconButton>
        )}
      </Box>

      {/* Search */}
      <TextField
        fullWidth
        label="Search Products"
        variant="outlined"
        size="small"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ mb: 3 }}
      />

      {/* Category Filter */}
      <FormControl fullWidth sx={{ mb: 3 }}>
        <InputLabel>Category</InputLabel>
        <Select
          value={selectedCategory}
          label="Category"
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <MenuItem value="">All Categories</MenuItem>
          {categories.map((cat) => (
            <MenuItem key={cat} value={cat}>
              {cat}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Price Range */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
          Price Range: ${priceRange[0]} - ${priceRange[1]}
        </Typography>
        <Slider
          value={priceRange}
          onChange={(e, newValue) => setPriceRange(newValue)}
          min={0}
          max={10000}
          step={50}
          valueLabelDisplay="auto"
          color="primary"
        />
      </Box>

      {/* Sort */}
      <FormControl fullWidth sx={{ mb: 3 }}>
        <InputLabel>Sort By</InputLabel>
        <Select
          value={sortBy}
          label="Sort By"
          onChange={(e) => setSortBy(e.target.value)}
        >
          <MenuItem value="">Relevance</MenuItem>
          <MenuItem value="price-low">Price: Low to High</MenuItem>
          <MenuItem value="price-high">Price: High to Low</MenuItem>
          <MenuItem value="newest">Newest</MenuItem>
        </Select>
      </FormControl>

      {/* Reset Button */}
      <Button
        fullWidth
        variant="outlined"
        color="primary"
        onClick={handleResetFilters}
      >
        Reset Filters
      </Button>
    </Paper>
  );

  return (
    <Box sx={{ backgroundColor: theme.palette.background.default, minHeight: '100vh', py: 4 }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
            Products
          </Typography>
          <Typography color="textSecondary">
            Showing {filteredProducts.length} products
          </Typography>
        </Box>

        {loading ? (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: '500px',
            }}
          >
            <CircularProgress color="primary" size={60} />
          </Box>
        ) : (
          <Grid container spacing={3}>
            {/* Sidebar - Desktop */}
            {!isMobile && (
              <Grid item xs={12} md={3}>
                <FilterPanel />
              </Grid>
            )}

            {/* Products Grid */}
            <Grid item xs={12} md={isMobile ? 12 : 9}>
              {/* Mobile Filter Button */}
              {isMobile && (
                <Box sx={{ mb: 3 }}>
                  <Button
                    fullWidth
                    variant="outlined"
                    color="primary"
                    startIcon={<FilterList />}
                    onClick={() => setMobileDrawerOpen(true)}
                  >
                    Open Filters
                  </Button>
                </Box>
              )}

              {/* Mobile Filter Drawer */}
              <Drawer
                anchor="left"
                open={mobileDrawerOpen}
                onClose={() => setMobileDrawerOpen(false)}
              >
                <Box sx={{ width: 300, p: 2 }}>
                  <FilterPanel />
                </Box>
              </Drawer>

              {/* Products */}
              {filteredProducts.length > 0 ? (
                <Grid container spacing={2}>
                  {filteredProducts.map((product) => (
                    <Grid item xs={12} sm={6} md={6} lg={4} key={product.id}>
                      <ProductCard product={product} />
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Paper
                  sx={{
                    p: 4,
                    textAlign: 'center',
                    backgroundColor: theme.palette.background.paper,
                  }}
                >
                  <Typography variant="h6" color="textSecondary">
                    No products found. Try adjusting your filters.
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleResetFilters}
                    sx={{ mt: 2 }}
                  >
                    Reset Filters
                  </Button>
                </Paper>
              )}
            </Grid>
          </Grid>
        )}
      </Container>
    </Box>
  );
}

export default Products;