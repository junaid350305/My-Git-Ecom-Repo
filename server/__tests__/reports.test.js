import request from 'supertest';
import fs from 'fs/promises';
import path from 'path';
import app from '../app.js';

const DATA_DIR = path.resolve('data');
const AUTH_HEADER = { Authorization: 'Bearer mock-admin-token' };

let originalOrders;
let originalProducts;

beforeAll(async () => {
  originalOrders = await fs.readFile(path.join(DATA_DIR, 'orders.json'), 'utf-8');
  originalProducts = await fs.readFile(path.join(DATA_DIR, 'products.json'), 'utf-8');
});

afterAll(async () => {
  await fs.writeFile(path.join(DATA_DIR, 'orders.json'), originalOrders);
  await fs.writeFile(path.join(DATA_DIR, 'products.json'), originalProducts);
});

describe('Reports Endpoints', () => {

  describe('GET /api/admin/reports/summary', () => {
    test('should return report summary', async () => {
      const res = await request(app)
        .get('/api/admin/reports/summary')
        .set(AUTH_HEADER);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('totalRevenue');
      expect(res.body).toHaveProperty('totalOrders');
      expect(res.body).toHaveProperty('totalProducts');
      expect(res.body).toHaveProperty('totalUsers');
      expect(typeof res.body.totalRevenue).toBe('number');
    });

    // NEW — covers averageOrderValue === 0 when totalOrders is 0
    test('should return averageOrderValue 0 when no orders exist', async () => {
      const filePath = path.join(DATA_DIR, 'orders.json');
      const backup = await fs.readFile(filePath, 'utf-8');
      await fs.writeFile(filePath, '[]');

      try {
        const res = await request(app)
          .get('/api/admin/reports/summary')
          .set(AUTH_HEADER);

        expect(res.statusCode).toBe(200);
        expect(res.body.totalOrders).toBe(0);
        expect(res.body.averageOrderValue).toBe(0);
      } finally {
        await fs.writeFile(filePath, backup);
      }
    });

    // NEW — covers summary when files are missing (readJSON null + || [])
    test('should handle missing data files gracefully', async () => {
      const ordersPath = path.join(DATA_DIR, 'orders.json');
      const productsPath = path.join(DATA_DIR, 'products.json');
      await fs.rename(ordersPath, ordersPath + '.bak');
      await fs.rename(productsPath, productsPath + '.bak');

      try {
        const res = await request(app)
          .get('/api/admin/reports/summary')
          .set(AUTH_HEADER);

        expect(res.statusCode).toBe(200);
        expect(res.body.totalOrders).toBe(0);
        expect(res.body.totalProducts).toBe(0);
        expect(res.body.totalRevenue).toBe(0);
        expect(res.body.averageOrderValue).toBe(0);
      } finally {
        await fs.rename(ordersPath + '.bak', ordersPath);
        await fs.rename(productsPath + '.bak', productsPath);
      }
    });

    // NEW — covers order.total || 0 when orders have missing total field (line 178)
    test('should handle orders with missing total field', async () => {
      const filePath = path.join(DATA_DIR, 'orders.json');
      const backup = await fs.readFile(filePath, 'utf-8');
      await fs.writeFile(filePath, JSON.stringify([
        { id: 'o1', status: 'delivered' },
        { id: 'o2', status: 'pending', total: 100 }
      ]));

      try {
        const res = await request(app)
          .get('/api/admin/reports/summary')
          .set(AUTH_HEADER);

        expect(res.statusCode).toBe(200);
        expect(res.body.totalRevenue).toBe(100);
        expect(res.body.totalOrders).toBe(2);
      } finally {
        await fs.writeFile(filePath, backup);
      }
    });
  });

  describe('GET /api/admin/reports/sales', () => {
    test('should return monthly sales data', async () => {
      const res = await request(app)
        .get('/api/admin/reports/sales')
        .set(AUTH_HEADER);

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body[0]).toHaveProperty('month');
      expect(res.body[0]).toHaveProperty('sales');
    });
  });

  describe('GET /api/admin/reports/top-products', () => {
    test('should return top products', async () => {
      const res = await request(app)
        .get('/api/admin/reports/top-products')
        .set(AUTH_HEADER);

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });

    // NEW — covers top-products when file is missing
    test('should return empty array when products.json is missing', async () => {
      const filePath = path.join(DATA_DIR, 'products.json');
      await fs.rename(filePath, filePath + '.bak');

      try {
        const res = await request(app)
          .get('/api/admin/reports/top-products')
          .set(AUTH_HEADER);

        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual([]);
      } finally {
        await fs.rename(filePath + '.bak', filePath);
      }
    });
  });
});