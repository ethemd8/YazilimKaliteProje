const request = require('supertest');
const app = require('../../src/app');
const { pool } = require('../../src/database/db');

describe('Users API Integration Tests', () => {
  beforeAll(async () => {
    const { createTables } = require('../../src/database/migrate');
    await createTables();
  });

  afterAll(async () => {
    await pool.end();
  });

  beforeEach(async () => {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      await client.query('DELETE FROM order_items');
      await client.query('DELETE FROM reviews');
      await client.query('DELETE FROM orders');
      await client.query('DELETE FROM products');
      await client.query('DELETE FROM categories');
      await client.query('DELETE FROM users');
      await client.query('ALTER SEQUENCE users_id_seq RESTART WITH 1');
      await client.query('COMMIT');
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Cleanup error:', error);
    } finally {
      client.release();
    }
  });

  describe('POST /api/users', () => {
    it('should create a new user', async () => {
      const uniqueId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const uniqueEmail = `test${uniqueId}@example.com`;
      const userData = {
        name: 'Test User',
        email: uniqueEmail,
        password: 'password123',
        phone: '555-1234',
        address: 'Test Address',
      };

      const response = await request(app)
        .post('/api/users')
        .send(userData)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.name).toBe(userData.name);
      expect(response.body.email).toBe(userData.email);
    });
  });

  describe('GET /api/users/:id', () => {
    it('should return user by id', async () => {
      const uniqueId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const uniqueEmail = `test${uniqueId}@example.com`;
      const createResponse = await request(app)
        .post('/api/users')
        .send({
          name: 'Test User',
          email: uniqueEmail,
          password: 'password123',
        });

      const userId = createResponse.body.id;

      const response = await request(app)
        .get(`/api/users/${userId}`)
        .expect(200);

      expect(response.body.id).toBe(userId);
      expect(response.body.name).toBe('Test User');
    });
  });

  describe('PATCH /api/users/:id', () => {
    it('should update user', async () => {
      const uniqueId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const uniqueEmail = `test${uniqueId}@example.com`;
      const createResponse = await request(app)
        .post('/api/users')
        .send({
          name: 'Test User',
          email: uniqueEmail,
          password: 'password123',
        });
      
      if (createResponse.status !== 201) {
        console.log('User creation failed:', createResponse.body);
      }
      expect(createResponse.status).toBe(201);

      const userId = createResponse.body.id;

      const response = await request(app)
        .patch(`/api/users/${userId}`)
        .send({ name: 'Updated Name' })
        .expect(200);

      expect(response.body).toHaveProperty('name');
      expect(response.body.name).toBe('Updated Name');
    });
  });
});
