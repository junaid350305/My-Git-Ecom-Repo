import request from 'supertest';
import app from '../app.js';

const AUTH_HEADER = { Authorization: 'Bearer mock-admin-token' };

describe('User Endpoints', () => {

  describe('GET /api/admin/users', () => {
    test('should return all users', async () => {
      const res = await request(app)
        .get('/api/admin/users')
        .set(AUTH_HEADER);

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThan(0);
    });

    test('each user should have required fields', async () => {
      const res = await request(app)
        .get('/api/admin/users')
        .set(AUTH_HEADER);

      const user = res.body[0];
      expect(user).toHaveProperty('id');
      expect(user).toHaveProperty('name');
      expect(user).toHaveProperty('email');
      expect(user).toHaveProperty('role');
      expect(user).toHaveProperty('status');
    });
  });

  describe('GET /api/admin/users/:id', () => {
    test('should return a single user', async () => {
      const res = await request(app)
        .get('/api/admin/users/user1')
        .set(AUTH_HEADER);

      expect(res.statusCode).toBe(200);
      expect(res.body.id).toBe('user1');
    });

    test('should return 404 for non-existent user', async () => {
      const res = await request(app)
        .get('/api/admin/users/user999')
        .set(AUTH_HEADER);

      expect(res.statusCode).toBe(404);
    });
  });

  describe('PUT /api/admin/users/:id', () => {
    test('should update a user', async () => {
      const res = await request(app)
        .put('/api/admin/users/user1')
        .set(AUTH_HEADER)
        .send({ name: 'John Updated' });

      expect(res.statusCode).toBe(200);
      expect(res.body.name).toBe('John Updated');
    });

    // NEW — covers the 404 branch for user update
    test('should return 404 for non-existent user', async () => {
      const res = await request(app)
        .put('/api/admin/users/user999')
        .set(AUTH_HEADER)
        .send({ name: 'Ghost User' });

      expect(res.statusCode).toBe(404);
      expect(res.body.message).toBe('User not found');
    });
  });

  describe('DELETE /api/admin/users/:id', () => {
    test('should delete a user', async () => {
      const res = await request(app)
        .delete('/api/admin/users/user5')
        .set(AUTH_HEADER);

      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe('User deleted successfully');
    });

    test('should return 404 for non-existent user', async () => {
      const res = await request(app)
        .delete('/api/admin/users/user999')
        .set(AUTH_HEADER);

      expect(res.statusCode).toBe(404);
    });
  });
});