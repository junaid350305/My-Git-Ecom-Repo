import request from 'supertest';
import app from '../app.js';

const AUTH_HEADER = { Authorization: 'Bearer mock-admin-token' };

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
  });
});