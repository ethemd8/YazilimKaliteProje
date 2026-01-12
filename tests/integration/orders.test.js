const request = require('supertest');
const app = require('../../src/app');
const { pool } = require('../../src/database/db');

describe('Orders API Integration Tests', () => {
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
      await client.query('BEGIN');
      await client.query('DELETE FROM order_items');
      await client.query('DELETE FROM orders');
      await client.query('DELETE FROM products');
      await client.query('DELETE FROM categories');
      await client.query('DELETE FROM users');
      await client.query('ALTER SEQUENCE users_id_seq RESTART WITH 1');
      await client.query('ALTER SEQUENCE categories_id_seq RESTART WITH 1');
      await client.query('ALTER SEQUENCE products_id_seq RESTART WITH 1');
      await client.query('ALTER SEQUENCE orders_id_seq RESTART WITH 1');
      await client.query('ALTER SEQUENCE order_items_id_seq RESTART WITH 1');
      
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
         VALUES ('Test Product', 'Description', 100, 20, $1) RETURNING id`,
        [categoryId]
      );
      productId = productResult.rows[0].id;
      await client.query('COMMIT');
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Setup error:', error);
      throw error;
    } finally {
      client.release();
    }
  });

  describe('POST /api/orders', () => {
    it('should create a new order with items', async () => {
      if (!userId || !productId) {
        throw new Error('userId veya productId tanımlı değil');
      }
      
      const orderData = {
        user_id: userId,
        items: [
          { product_id: productId, quantity: 2 },
        ],
        shipping_address: 'Test Address',
      };

      const response = await request(app)
        .post('/api/orders')
        .send(orderData);
      
      if (response.status !== 201) {
        console.log('Order creation failed:', JSON.stringify(response.body, null, 2));
        console.log('userId:', userId, 'productId:', productId);
      }
      expect(response.status).toBe(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('items');
      expect(response.body.items.length).toBe(1);
      expect(parseFloat(response.body.total_amount)).toBe(200);
    });
  });

  describe('GET /api/orders/:id', () => {
    it('should return order by id with items', async () => {
      const orderData = {
        user_id: parseInt(userId),
        items: [
          { product_id: parseInt(productId), quantity: 1 },
        ],
        shipping_address: 'Test Address',
      };

      const createResponse = await request(app)
        .post('/api/orders')
        .send(orderData);
      
      if (createResponse.status !== 201) {
        console.log('Order creation failed in GET test:', createResponse.body);
      }
      expect(createResponse.status).toBe(201);

      const orderId = createResponse.body.id;

      const response = await request(app)
        .get(`/api/orders/${orderId}`)
        .expect(200);

      expect(response.body.id).toBe(orderId);
      expect(response.body).toHaveProperty('items');
    });
  });
});
