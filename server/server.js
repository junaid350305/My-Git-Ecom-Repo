import express from 'express';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Helper functions for file operations
const readJSON = async (filename) => {
  const data = await fs.readFile(path.join(__dirname, 'data', filename), 'utf-8');
  return JSON.parse(data);
};

const writeJSON = async (filename, data) => {
  await fs.writeFile(path.join(__dirname, 'data', filename), JSON.stringify(data, null, 2));
};

// Products routes
app.get('/api/products', async (req, res) => {
  try {
    const products = await readJSON('products.json');
    const { category, search } = req.query;
    
    let filtered = products;
    if (category) {
      filtered = filtered.filter(p => p.category === category);
    }
    if (search) {
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(search.toLowerCase())
      );
    }
    res.json(filtered);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

app.get('/api/products/:id', async (req, res) => {
  try {
    const products = await readJSON('products.json');
    const product = products.find(p => p.id === req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

// Orders routes
app.get('/api/orders', async (req, res) => {
  try {
    const orders = await readJSON('orders.json');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

app.post('/api/orders', async (req, res) => {
  try {
    const { items, customer, total } = req.body;
    
    if (!items || !customer || !total) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const orders = await readJSON('orders.json');
    const newOrder = {
      id: uuidv4(),
      items,
      customer,
      total,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    
    orders.push(newOrder);
    await writeJSON('orders.json', orders);
    
    res.status(201).json(newOrder);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create order' });
  }
});

app.get('/api/orders/:id', async (req, res) => {
  try {
    const orders = await readJSON('orders.json');
    const order = orders.find(o => o.id === req.params.id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch order' });
  }
});

// Categories route
app.get('/api/categories', async (req, res) => {
  try {
    const products = await readJSON('products.json');
    const categories = [...new Set(products.map(p => p.category))];
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});