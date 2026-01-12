const request = require('supertest');
const app = require('../../src/app');
const { pool } = require('../../src/database/db');

describe('Reviews API Integration Tests', () => {
  let userId;
  let categoryId;
  let productId;

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
      await client.query('DELETE FROM reviews');
      await client.query('DELETE FROM products');
      await client.query('DELETE FROM categories');
      await client.query('DELETE FROM users');
      await client.query('ALTER SEQUENCE users_id_seq RESTART WITH 1');
      await client.query('ALTER SEQUENCE categories_id_seq RESTART WITH 1');
      await client.query('ALTER SEQUENCE products_id_seq RESTART WITH 1');
      await client.query('ALTER SEQUENCE reviews_id_seq RESTART WITH 1');
      
      const uniqueId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const uniqueEmail = `test${uniqueId}@example.com`;
      const uniqueCategoryName = `Test Category ${uniqueId}`;
      
      const userResult = await client.query(
        `INSERT INTO users (name, email, password) VALUES ('Test User', $1, 'password') RETURNING id`,
        [uniqueEmail]
      );
      userId = userResult.rows[0].id;

      const categoryResult = await client.query(
        `INSERT INTO categories (name, description) VALUES ($1, 'Test') RETURNING id`,
        [uniqueCategoryName]
      );
      categoryId = categoryResult.rows[0].id;

      const productResult = await client.query(
        `INSERT INTO products (name, description, price, stock, category_id) 
         VALUES ('Test Product', 'Description', 100, 10, $1) RETURNING id`,
        [categoryId]
      );
      productId = productResult.rows[0].id;
    } catch (error) {
      console.error('Setup error:', error);
      throw error;
    } finally {
      client.release();
    }
  });

  describe('POST /api/reviews', () => {
    it('should create a new review', async () => {
      const reviewData = {
        user_id: userId,
        product_id: productId,
        rating: 5,
        comment: 'Great product!',
      };

      const response = await request(app)
        .post('/api/reviews')
        .send(reviewData)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.rating).toBe(reviewData.rating);
      expect(response.body.comment).toBe(reviewData.comment);
    });
  });

});
