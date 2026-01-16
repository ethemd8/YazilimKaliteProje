const request = require('supertest');
const app = require('../../src/app');
const { pool } = require('../../src/database/db');

describe('Products API Integration Tests', () => {
  let categoryId;

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
      await client.query('ALTER SEQUENCE categories_id_seq RESTART WITH 1');
      await client.query('ALTER SEQUENCE products_id_seq RESTART WITH 1');
      
      const uniqueId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const uniqueCategoryName = `Test Category ${uniqueId}`;
      const categoryResult = await client.query(
        `INSERT INTO categories (name, description) VALUES ($1, 'Test Description') RETURNING id`,
        [uniqueCategoryName]
      );
      categoryId = categoryResult.rows[0].id;
      await client.query('COMMIT');
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Setup error:', error);
      throw error;
    } finally {
      client.release();
    }
  });

  describe('POST /api/products', () => {
    it('should create a new product', async () => {
      // beforeEach'te oluşturulan categoryId'yi kullan
      if (!categoryId) {
        throw new Error('categoryId tanımlı değil');
      }

      const productData = {
        name: 'Test Product',
        description: 'Test Description',
        price: 100.5,
        stock: 10,
        category_id: categoryId,
      };

      const response = await request(app)
        .post('/api/products')
        .send(productData);
      
      if (response.status !== 201) {
        console.log('Product creation failed:', JSON.stringify(response.body, null, 2));
        console.log('categoryId:', categoryId);
      }
      expect(response.status).toBe(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.name).toBe(productData.name);
      expect(parseFloat(response.body.price)).toBe(productData.price);
    });
  });

  describe('GET /api/products/:id', () => {
    it('should return product by id', async () => {
      const productData = {
        name: 'Test Product',
        description: 'Test Description',
        price: 100,
        stock: 10,
        category_id: categoryId,
      };

      const createResponse = await request(app)
        .post('/api/products')
        .send(productData);

      const productId = createResponse.body.id;

      const response = await request(app)
        .get(`/api/products/${productId}`)
        .expect(200);

      expect(response.body.id).toBe(productId);
      expect(response.body.name).toBe(productData.name);
    });
  });

});
