import request from 'supertest';
import app from '../app.js';

describe('Authentication Endpoints', () => {

  // ─── POST /api/admin/login ───
  describe('POST /api/admin/login', () => {
    test('should login with valid credentials', async () => {
      const res = await request(app)
        .post('/api/admin/login')
        .send({ email: 'admin@shopease.com', password: 'admin123' });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('token', 'mock-admin-token');
      expect(res.body).toHaveProperty('admin');
      expect(res.body.admin.email).toBe('admin@shopease.com');
    });

    test('should reject invalid email', async () => {
      const res = await request(app)
        .post('/api/admin/login')
        .send({ email: 'wrong@email.com', password: 'admin123' });

      expect(res.statusCode).toBe(401);
      expect(res.body.message).toBe('Invalid credentials');
    });

    test('should reject invalid password', async () => {
      const res = await request(app)
        .post('/api/admin/login')
        .send({ email: 'admin@shopease.com', password: 'wrongpass' });

      expect(res.statusCode).toBe(401);
      expect(res.body.message).toBe('Invalid credentials');
    });

    test('should reject empty credentials', async () => {
      const res = await request(app)
        .post('/api/admin/login')
        .send({});

      expect(res.statusCode).toBe(401);
    });

    // NEW — covers req.body being undefined (no body sent at all)
    test('should reject when no body is sent', async () => {
      const res = await request(app)
        .post('/api/admin/login')
        .set('Content-Type', 'application/json');

      expect(res.statusCode).toBe(401);
      expect(res.body.message).toBe('Invalid credentials');
    });
  });

  // ─── GET /api/admin/verify ───
  describe('GET /api/admin/verify', () => {
    test('should verify valid token', async () => {
      const res = await request(app)
        .get('/api/admin/verify')
        .set('Authorization', 'Bearer mock-admin-token');

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('admin');
    });

    test('should reject missing token', async () => {
      const res = await request(app).get('/api/admin/verify');
      expect(res.statusCode).toBe(401);
    });

    test('should reject invalid token', async () => {
      const res = await request(app)
        .get('/api/admin/verify')
        .set('Authorization', 'Bearer invalid-token');

      expect(res.statusCode).toBe(401);
    });
  });

  // NEW — covers the 404 fallback route (line 241)
  describe('404 Fallback', () => {
    test('should return 404 for unknown routes', async () => {
      const res = await request(app).get('/api/nonexistent/route');
      expect(res.statusCode).toBe(404);
      expect(res.text).toBe('Not found');
    });

    test('should return 404 for unknown POST routes', async () => {
      const res = await request(app)
        .post('/api/unknown')
        .send({ data: 'test' });
      expect(res.statusCode).toBe(404);
    });
  });
});