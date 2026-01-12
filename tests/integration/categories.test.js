const request = require('supertest');
const app = require('../../src/app');
const { pool } = require('../../src/database/db');

describe('Categories API Integration Tests', () => {
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
      await client.query('DELETE FROM products');
      await client.query('DELETE FROM categories');
      await client.query('ALTER SEQUENCE categories_id_seq RESTART WITH 1');
      await client.query('ALTER SEQUENCE products_id_seq RESTART WITH 1');
    } catch (error) {
      console.error('Cleanup error:', error);
    } finally {
      client.release();
    }
  });

  describe('POST /api/categories', () => {
    it('should create a new category', async () => {
      const uniqueId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const uniqueName = `Test Category ${uniqueId}`;
      const categoryData = {
        name: uniqueName,
        description: 'Test Description',
      };

      const response = await request(app)
        .post('/api/categories')
        .send(categoryData)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.name).toBe(categoryData.name);
    });
  });

  describe('GET /api/categories', () => {
    it('should return all categories', async () => {
      const uniqueId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const uniqueName = `Test Category ${uniqueId}`;
      const client = await pool.connect();
      try {
        await client.query(
          `INSERT INTO categories (name, description) VALUES ($1, 'Description')`,
          [uniqueName]
        );
      } finally {
        client.release();
      }

      const response = await request(app)
        .get('/api/categories')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });
  });
});
