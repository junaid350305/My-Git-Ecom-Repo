import request from 'supertest';
import app from '../app.js';

const AUTH_HEADER = { Authorization: 'Bearer mock-admin-token' };

describe('Settings Endpoints', () => {

  describe('GET /api/admin/settings', () => {
    test('should return store settings', async () => {
      const res = await request(app)
        .get('/api/admin/settings')
        .set(AUTH_HEADER);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('storeName');
      expect(res.body).toHaveProperty('currency');
      expect(res.body).toHaveProperty('shippingFee');
      expect(res.body).toHaveProperty('maintenanceMode');
      expect(res.body).toHaveProperty('allowGuestCheckout');
    });
  });

  describe('PUT /api/admin/settings', () => {
    test('should update store settings', async () => {
      const res = await request(app)
        .put('/api/admin/settings')
        .set(AUTH_HEADER)
        .send({ storeName: 'ShopEase Updated', shippingFee: 9.99 });

      expect(res.statusCode).toBe(200);
      expect(res.body.storeName).toBe('ShopEase Updated');
      expect(res.body.shippingFee).toBe(9.99);
    });
  });
});