import request from 'supertest';
import fs from 'fs/promises';
import path from 'path';
import app from '../app.js';

const DATA_DIR = path.resolve('data');
const AUTH_HEADER = { Authorization: 'Bearer mock-admin-token' };

let originalProducts;

beforeAll(async () => {
  originalProducts = await fs.readFile(path.join(DATA_DIR, 'products.json'), 'utf-8');
});

afterAll(async () => {
  await fs.writeFile(path.join(DATA_DIR, 'products.json'), originalProducts);
});

describe('Product Endpoints', () => {

  describe('GET /api/products', () => {
    test('should return all products', async () => {
      const res = await request(app).get('/api/products');
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });

    test('each product should have required fields', async () => {
      const res = await request(app).get('/api/products');
      if (res.body.length > 0) {
        const product = res.body[0];
        expect(product).toHaveProperty('id');
        expect(product).toHaveProperty('name');
        expect(product).toHaveProperty('price');
      }
    });

    test('should return empty array when products.json is missing', async () => {
      const filePath = path.join(DATA_DIR, 'products.json');
      const backup = await fs.readFile(filePath, 'utf-8');
      await fs.rename(filePath, filePath + '.bak');

      try {
        const res = await request(app).get('/api/products');
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual([]);
      } finally {
        await fs.rename(filePath + '.bak', filePath);
      }
    });
  });

  describe('GET /api/admin/products', () => {
    test('should return products with valid token', async () => {
      const res = await request(app)
        .get('/api/admin/products')
        .set(AUTH_HEADER);

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });

    test('should reject without token', async () => {
      const res = await request(app).get('/api/admin/products');
      expect(res.statusCode).toBe(401);
    });

    test('should return empty array when products.json is missing (admin)', async () => {
      const filePath = path.join(DATA_DIR, 'products.json');
      await fs.rename(filePath, filePath + '.bak');

      try {
        const res = await request(app)
          .get('/api/admin/products')
          .set(AUTH_HEADER);
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual([]);
      } finally {
        await fs.rename(filePath + '.bak', filePath);
      }
    });
  });

  describe('POST /api/admin/products', () => {
    test('should create a new product', async () => {
      const newProduct = {
        name: 'Test New Product',
        price: 99.99,
        category: 'Electronics',
        stock: 25,
        image: '/images/test.jpg',
        description: 'A test product'
      };

      const res = await request(app)
        .post('/api/admin/products')
        .set(AUTH_HEADER)
        .send(newProduct);

      expect(res.statusCode).toBe(201);
      expect(res.body.name).toBe('Test New Product');
      expect(res.body.price).toBe(99.99);
      expect(res.body).toHaveProperty('id');
    });

    test('should reject without auth', async () => {
      const res = await request(app)
        .post('/api/admin/products')
        .send({ name: 'Unauthorized Product' });

      expect(res.statusCode).toBe(401);
    });

    test('should create product even when products.json is missing', async () => {
      const filePath = path.join(DATA_DIR, 'products.json');
      const backup = await fs.readFile(filePath, 'utf-8');
      await fs.rename(filePath, filePath + '.bak');

      try {
        const res = await request(app)
          .post('/api/admin/products')
          .set(AUTH_HEADER)
          .send({ name: 'Recovery Product', price: 10 });

        expect(res.statusCode).toBe(201);
        expect(res.body.name).toBe('Recovery Product');
      } finally {
        await fs.writeFile(filePath, backup);
      }
    });

    test('should create product with empty body', async () => {
      const res = await request(app)
        .post('/api/admin/products')
        .set(AUTH_HEADER)
        .send({});

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('id');
    });

    // NEW — covers req.body || {} when no content-type sent (line 103)
    test('should create product when no body or content-type is sent', async () => {
      const res = await request(app)
        .post('/api/admin/products')
        .set(AUTH_HEADER);

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('id');
    });
  });

  describe('PUT /api/admin/products/:id', () => {
    test('should update an existing product', async () => {
      const products = JSON.parse(await fs.readFile(path.join(DATA_DIR, 'products.json'), 'utf-8'));
      const productId = products[0].id;

      const res = await request(app)
        .put(`/api/admin/products/${productId}`)
        .set(AUTH_HEADER)
        .send({ name: 'Updated Product Name', price: 199.99 });

      expect(res.statusCode).toBe(200);
      expect(res.body.name).toBe('Updated Product Name');
      expect(res.body.price).toBe(199.99);
    });

    test('should return 404 for non-existent product', async () => {
      const res = await request(app)
        .put('/api/admin/products/nonexistent999')
        .set(AUTH_HEADER)
        .send({ name: 'Ghost Product' });

      expect(res.statusCode).toBe(404);
    });

    test('should return 404 when products.json is missing', async () => {
      const filePath = path.join(DATA_DIR, 'products.json');
      const backup = await fs.readFile(filePath, 'utf-8');
      await fs.rename(filePath, filePath + '.bak');

      try {
        const res = await request(app)
          .put('/api/admin/products/p1')
          .set(AUTH_HEADER)
          .send({ name: 'Ghost' });

        expect(res.statusCode).toBe(404);
      } finally {
        await fs.writeFile(filePath, backup);
      }
    });
  });

  describe('DELETE /api/admin/products/:id', () => {
    test('should delete a product', async () => {
      const products = JSON.parse(await fs.readFile(path.join(DATA_DIR, 'products.json'), 'utf-8'));
      const productId = products[products.length - 1].id;

      const res = await request(app)
        .delete(`/api/admin/products/${productId}`)
        .set(AUTH_HEADER);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
    });

    test('should return 200 even for non-existent product (filter approach)', async () => {
      const res = await request(app)
        .delete('/api/admin/products/nonexistent999')
        .set(AUTH_HEADER);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
    });

    test('should succeed when products.json is missing', async () => {
      const filePath = path.join(DATA_DIR, 'products.json');
      const backup = await fs.readFile(filePath, 'utf-8');
      await fs.rename(filePath, filePath + '.bak');

      try {
        const res = await request(app)
          .delete('/api/admin/products/p1')
          .set(AUTH_HEADER);

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
      } finally {
        await fs.writeFile(filePath, backup);
      }
    });
  });
});