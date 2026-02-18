import express from 'express';
import cors from 'cors';
import fs from 'fs/promises';
import path from 'path';

const app = express();
app.use(cors());
app.use(express.json());

const DATA_DIR = path.resolve('data');

const MOCK_ADMIN = { id: 'admin1', name: 'Admin User', email: 'admin@shopease.com' };
const MOCK_TOKEN = 'mock-admin-token';

// ============== USERS DATA ==============
let users = [
  { id: 'user1', name: 'John Doe', email: 'john@example.com', role: 'customer', status: 'active', createdAt: '2024-01-15', orders: 5, totalSpent: 450.00 },
  { id: 'user2', name: 'Jane Smith', email: 'jane@example.com', role: 'customer', status: 'active', createdAt: '2024-02-20', orders: 3, totalSpent: 280.00 },
  { id: 'user3', name: 'Bob Wilson', email: 'bob@example.com', role: 'customer', status: 'inactive', createdAt: '2024-03-10', orders: 1, totalSpent: 75.00 },
  { id: 'user4', name: 'Alice Brown', email: 'alice@example.com', role: 'customer', status: 'active', createdAt: '2024-03-25', orders: 8, totalSpent: 920.00 },
  { id: 'user5', name: 'Charlie Davis', email: 'charlie@example.com', role: 'customer', status: 'banned', createdAt: '2024-04-01', orders: 0, totalSpent: 0 },
];

// ============== SETTINGS DATA ==============
let settings = {
  storeName: 'ShopEase',
  storeEmail: 'contact@shopease.com',
  storePhone: '+1 234 567 8900',
  storeAddress: '123 Commerce St, Business City, BC 12345',
  currency: 'USD',
  taxRate: 10,
  shippingFee: 5.99,
  freeShippingThreshold: 50,
  maintenanceMode: false,
  allowGuestCheckout: true,
  maxOrderItems: 20,
};

// ============== HELPER FUNCTIONS ==============
async function readJSON(filename) {
  try {
    const p = path.join(DATA_DIR, filename);
    const txt = await fs.readFile(p, 'utf8');
    return JSON.parse(txt);
  } catch (err) {
    return null;
  }
}

async function writeJSON(filename, data) {
  const p = path.join(DATA_DIR, filename);
  await fs.writeFile(p, JSON.stringify(data, null, 2), 'utf8');
}

// ============== AUTH MIDDLEWARE ==============
function authenticateToken(req, res, next) {
  const auth = req.headers.authorization;
  if (auth === `Bearer ${MOCK_TOKEN}`) {
    req.admin = MOCK_ADMIN;
    return next();
  }
  return res.status(401).json({ message: 'Unauthorized' });
}

// ============== AUTH ENDPOINTS ==============
app.post('/api/admin/login', async (req, res) => {
  const { email, password } = req.body;
  if (email === MOCK_ADMIN.email && password === 'admin123') {
    return res.json({ token: MOCK_TOKEN, admin: MOCK_ADMIN });
  }
  return res.status(401).json({ message: 'Invalid credentials' });
});

app.get('/api/admin/verify', (req, res) => {
  const auth = req.headers.authorization;
  if (auth === `Bearer ${MOCK_TOKEN}`) return res.json({ admin: MOCK_ADMIN });
  return res.status(401).json({ message: 'Invalid token' });
});

// ============== PRODUCTS ENDPOINTS ==============
app.get('/api/products', async (req, res) => {
  const products = (await readJSON('products.json')) || [];
  res.json(products);
});

app.get('/api/admin/products', authenticateToken, async (req, res) => {
  const products = (await readJSON('products.json')) || [];
  res.json(products);
});

app.post('/api/admin/products', authenticateToken, async (req, res) => {
  const body = req.body;
  const products = (await readJSON('products.json')) || [];
  const id = `p${Date.now()}`;
  const product = { id, ...body };
  products.unshift(product);
  await writeJSON('products.json', products);
  res.status(201).json(product);
});

app.put('/api/admin/products/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const body = req.body;
  const products = (await readJSON('products.json')) || [];
  const idx = products.findIndex((p) => String(p.id) === String(id));
  if (idx === -1) return res.status(404).json({ message: 'Product not found' });
  products[idx] = { ...products[idx], ...body };
  await writeJSON('products.json', products);
  res.json(products[idx]);
});

app.delete('/api/admin/products/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const products = (await readJSON('products.json')) || [];
  const filtered = products.filter((p) => String(p.id) !== String(id));
  await writeJSON('products.json', filtered);
  res.json({ success: true });
});

// ============== ORDERS ENDPOINTS ==============
app.get('/api/orders', async (req, res) => {
  const orders = (await readJSON('orders.json')) || [];
  res.json(orders);
});

app.get('/api/admin/orders', authenticateToken, async (req, res) => {
  const orders = (await readJSON('orders.json')) || [];
  res.json(orders);
});

app.put('/api/admin/orders/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const orders = (await readJSON('orders.json')) || [];
  const idx = orders.findIndex((o) => String(o.id) === String(id));

  if (idx === -1) {
    return res.status(404).json({ message: 'Order not found' });
  }

  orders[idx] = { ...orders[idx], status };
  await writeJSON('orders.json', orders);
  res.json(orders[idx]);
});

// ============== USERS ENDPOINTS ==============
app.get('/api/admin/users', authenticateToken, (req, res) => {
  res.json(users);
});

app.get('/api/admin/users/:id', authenticateToken, (req, res) => {
  const user = users.find(u => u.id === req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json(user);
});

app.put('/api/admin/users/:id', authenticateToken, (req, res) => {
  const index = users.findIndex(u => u.id === req.params.id);
  if (index === -1) return res.status(404).json({ message: 'User not found' });

  users[index] = { ...users[index], ...req.body };
  res.json(users[index]);
});

app.delete('/api/admin/users/:id', authenticateToken, (req, res) => {
  const index = users.findIndex(u => u.id === req.params.id);
  if (index === -1) return res.status(404).json({ message: 'User not found' });

  users.splice(index, 1);
  res.json({ message: 'User deleted successfully' });
});

// ============== REPORTS ENDPOINTS ==============
app.get('/api/admin/reports/summary', authenticateToken, async (req, res) => {
  const ordersData = (await readJSON('orders.json')) || [];
  const productsData = (await readJSON('products.json')) || [];

  const totalRevenue = ordersData.reduce((sum, order) => sum + (order.total ? order.total : 0), 0);
  const totalOrders = ordersData.length;
  const totalProducts = productsData.length;
  const totalUsers = users.length;

  res.json({
    totalRevenue,
    totalOrders,
    totalProducts,
    totalUsers,
    averageOrderValue: totalOrders > 0 ? (totalRevenue / totalOrders).toFixed(2) : 0,
  });
});

app.get('/api/admin/reports/sales', authenticateToken, (req, res) => {
  const salesData = [
    { month: 'Jan', sales: 4200, orders: 42 },
    { month: 'Feb', sales: 3800, orders: 38 },
    { month: 'Mar', sales: 5100, orders: 51 },
    { month: 'Apr', sales: 4700, orders: 47 },
    { month: 'May', sales: 5900, orders: 59 },
    { month: 'Jun', sales: 6200, orders: 62 },
  ];
  res.json(salesData);
});

app.get('/api/admin/reports/top-products', authenticateToken, async (req, res) => {
  const productsData = (await readJSON('products.json')) || [];

  const topProducts = productsData.slice(0, 5).map((p) => ({
    id: p.id,
    name: p.name,
    sales: Math.floor(Math.random() * 100) + 20,
    revenue: (Math.floor(Math.random() * 100) + 20) * p.price,
  }));

  res.json(topProducts);
});

// ============== SETTINGS ENDPOINTS ==============
app.get('/api/admin/settings', authenticateToken, (req, res) => {
  res.json(settings);
});

app.put('/api/admin/settings', authenticateToken, (req, res) => {
  settings = { ...settings, ...req.body };
  res.json(settings);
});

// ============== 404 FALLBACK (must be last!) ==============
app.use((req, res) => {
  res.status(404).send('Not found');
});

export default app;