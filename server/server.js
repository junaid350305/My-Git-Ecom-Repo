import express from 'express';
import cors from 'cors';
import fs from 'fs/promises';
import path from 'path';

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;
const DATA_DIR = path.resolve('data');

const MOCK_ADMIN = { id: 'admin1', name: 'Admin User', email: 'admin@shopease.com' };
const MOCK_TOKEN = 'mock-admin-token';

// helper: read JSON file
async function readJSON(filename) {
  try {
    const p = path.join(DATA_DIR, filename);
    const txt = await fs.readFile(p, 'utf8');
    return JSON.parse(txt);
  } catch (err) {
    return null;
  }
}

// helper: write JSON file
async function writeJSON(filename, data) {
  const p = path.join(DATA_DIR, filename);
  await fs.writeFile(p, JSON.stringify(data, null, 2), 'utf8');
}

/* AUTH */
// login
app.post('/api/admin/login', async (req, res) => {
  const { email, password } = req.body || {};
  if (email === MOCK_ADMIN.email && password === 'admin123') {
    return res.json({ token: MOCK_TOKEN, admin: MOCK_ADMIN });
  }
  return res.status(401).json({ message: 'Invalid credentials' });
});

// verify token
app.get('/api/admin/verify', (req, res) => {
  const auth = req.headers.authorization || '';
  if (auth === `Bearer ${MOCK_TOKEN}`) return res.json({ admin: MOCK_ADMIN });
  return res.status(401).json({ message: 'Invalid token' });
});

/* PRODUCTS (public & admin) */
// public list
app.get('/api/products', async (req, res) => {
  const products = (await readJSON('products.json')) || [];
  res.json(products);
});

// admin list (same as public, but protected)
app.get('/api/admin/products', (req, res) => {
  const auth = req.headers.authorization || '';
  if (auth !== `Bearer ${MOCK_TOKEN}`) return res.status(401).json({ message: 'Unauthorized' });
  return readJSON('products.json').then((p) => res.json(p || []));
});

// create product
app.post('/api/admin/products', async (req, res) => {
  const auth = req.headers.authorization || '';
  if (auth !== `Bearer ${MOCK_TOKEN}`) return res.status(401).json({ message: 'Unauthorized' });
  const body = req.body || {};
  const products = (await readJSON('products.json')) || [];
  const id = `p${Date.now()}`;
  const product = { id, ...body };
  products.unshift(product);
  await writeJSON('products.json', products);
  res.status(201).json(product);
});

// update product
app.put('/api/admin/products/:id', async (req, res) => {
  const auth = req.headers.authorization || '';
  if (auth !== `Bearer ${MOCK_TOKEN}`) return res.status(401).json({ message: 'Unauthorized' });
  const { id } = req.params;
  const body = req.body || {};
  const products = (await readJSON('products.json')) || [];
  const idx = products.findIndex((p) => String(p.id) === String(id));
  if (idx === -1) return res.status(404).json({ message: 'Product not found' });
  products[idx] = { ...products[idx], ...body };
  await writeJSON('products.json', products);
  res.json(products[idx]);
});

// delete product
app.delete('/api/admin/products/:id', async (req, res) => {
  const auth = req.headers.authorization || '';
  if (auth !== `Bearer ${MOCK_TOKEN}`) return res.status(401).json({ message: 'Unauthorized' });
  const { id } = req.params;
  const products = (await readJSON('products.json')) || [];
  const filtered = products.filter((p) => String(p.id) !== String(id));
  await writeJSON('products.json', filtered);
  res.json({ success: true });
});

/* ORDERS */
// public (if needed)
app.get('/api/orders', async (req, res) => {
  const orders = (await readJSON('orders.json')) || [];
  res.json(orders);
});

// admin orders (protected)
app.get('/api/admin/orders', async (req, res) => {
  const auth = req.headers.authorization || '';
  if (auth !== `Bearer ${MOCK_TOKEN}`) return res.status(401).json({ message: 'Unauthorized' });
  const orders = (await readJSON('orders.json')) || [];
  res.json(orders);
});

/* fallback */
app.use((req, res) => {
  res.status(404).send('Not found');
});

app.listen(PORT, () => {
  console.log(`Mock API listening on http://localhost:${PORT}`);
});