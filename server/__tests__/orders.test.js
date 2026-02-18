import request from 'supertest';
import fs from 'fs/promises';
import path from 'path';
import app from '../app.js';

const DATA_DIR = path.resolve('data');
const AUTH_HEADER = { Authorization: 'Bearer mock-admin-token' };

let originalOrders;

beforeAll(async () => {
  originalOrders = await fs.readFile(path.join(DATA_DIR, 'orders.json'), 'utf-8');
});

afterAll(async () => {
  await fs.writeFile(path.join(DATA_DIR, 'orders.json'), originalOrders);
});

describe('Order Endpoints', () => {

  describe('GET /api/orders', () => {
    test('should return all orders (public)', async () => {
      const res = await request(app).get('/api/orders');
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });

    // NEW — covers readJSON catch + || [] for public orders
    test('should return empty array when orders.json is missing', async () => {
      const filePath = path.join(DATA_DIR, 'orders.json');
      await fs.rename(filePath, filePath + '.bak');

      try {
        const res = await request(app).get('/api/orders');
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual([]);
      } finally {
        await fs.rename(filePath + '.bak', filePath);
      }
    });
  });

  describe('GET /api/admin/orders', () => {
    test('should return orders with auth', async () => {
      const res = await request(app)
        .get('/api/admin/orders')
        .set(AUTH_HEADER);

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });

    test('should reject without auth', async () => {
      const res = await request(app).get('/api/admin/orders');
      expect(res.statusCode).toBe(401);
    });

    // NEW — covers readJSON catch + || [] for admin orders
    test('should return empty array when orders.json is missing (admin)', async () => {
      const filePath = path.join(DATA_DIR, 'orders.json');
      await fs.rename(filePath, filePath + '.bak');

      try {
        const res = await request(app)
          .get('/api/admin/orders')
          .set(AUTH_HEADER);
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual([]);
      } finally {
        await fs.rename(filePath + '.bak', filePath);
      }
    });
  });

  describe('PUT /api/admin/orders/:id', () => {
    test('should update order status', async () => {
      const orders = JSON.parse(await fs.readFile(path.join(DATA_DIR, 'orders.json'), 'utf-8'));
      if (orders.length === 0) return;

      const orderId = orders[0].id;
      const res = await request(app)
        .put(`/api/admin/orders/${orderId}`)
        .set(AUTH_HEADER)
        .send({ status: 'shipped' });

      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe('shipped');
    });

    test('should return 404 for non-existent order', async () => {
      const res = await request(app)
        .put('/api/admin/orders/nonexistent999')
        .set(AUTH_HEADER)
        .send({ status: 'shipped' });

      expect(res.statusCode).toBe(404);
    });

    // NEW — covers the catch block (line 146) by corrupting the file
    test('should return 500 when orders.json is corrupted', async () => {
      const filePath = path.join(DATA_DIR, 'orders.json');
      const backup = await fs.readFile(filePath, 'utf-8');
      await fs.writeFile(filePath, '<<<INVALID JSON>>>');

      try {
        const res = await request(app)
          .put('/api/admin/orders/order1')
          .set(AUTH_HEADER)
          .send({ status: 'shipped' });

        // readJSON returns null on parse error, || [] kicks in,
        // findIndex returns -1, so we get 404
        expect(res.statusCode).toBe(404);
      } finally {
        await fs.writeFile(filePath, backup);
      }
    });

    // NEW — covers update when file is completely missing
    test('should return 404 when orders.json is missing', async () => {
      const filePath = path.join(DATA_DIR, 'orders.json');
      await fs.rename(filePath, filePath + '.bak');

      try {
        const res = await request(app)
          .put('/api/admin/orders/order1')
          .set(AUTH_HEADER)
          .send({ status: 'delivered' });

        expect(res.statusCode).toBe(404);
      } finally {
        await fs.rename(filePath + '.bak', filePath);
      }
    });
  });
});