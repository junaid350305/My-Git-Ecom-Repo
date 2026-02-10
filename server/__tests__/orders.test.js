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
  });
});