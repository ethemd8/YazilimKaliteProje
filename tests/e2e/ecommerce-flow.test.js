const request = require('supertest');
const app = require('../../src/app');
const { pool } = require('../../src/database/db');

describe('E2E: E-Commerce Flow Tests', () => {
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
      // Foreign key constraint'leri nedeniyle sıralı silme
      await client.query('DELETE FROM order_items');
      await client.query('DELETE FROM reviews');
      await client.query('DELETE FROM orders');
      await client.query('DELETE FROM products');
      await client.query('DELETE FROM categories');
      await client.query('DELETE FROM users');
      await client.query('ALTER SEQUENCE users_id_seq RESTART WITH 1');
      await client.query('ALTER SEQUENCE categories_id_seq RESTART WITH 1');
      await client.query('ALTER SEQUENCE products_id_seq RESTART WITH 1');
      await client.query('ALTER SEQUENCE orders_id_seq RESTART WITH 1');
      await client.query('ALTER SEQUENCE order_items_id_seq RESTART WITH 1');
      await client.query('ALTER SEQUENCE reviews_id_seq RESTART WITH 1');
      await client.query('COMMIT');
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Cleanup error:', error);
    } finally {
      client.release();
    }
  });

  describe('Scenario 1: Complete User Journey - Registration to Order', () => {
    it('should complete full user journey: register → browse products → create order', async () => {
      const uniqueEmail = `e2e${Date.now()}@test.com`;
      // 1. Kullanıcı kaydı
      const userResponse = await request(app)
        .post('/api/users')
        .send({
          name: 'E2E Test User',
          email: uniqueEmail,
          password: 'password123',
          phone: '555-0001',
          address: 'Test Address',
        })
        .expect(201);

      const userId = userResponse.body.id;
      expect(userId).toBeDefined();

      // 2. Kategori oluştur
      const uniqueCategoryName = `Electronics ${Date.now()}`;
      const categoryResponse = await request(app)
        .post('/api/categories')
        .send({
          name: uniqueCategoryName,
          description: 'Electronic products',
        })
        .expect(201);

      const categoryId = categoryResponse.body.id;

      // 3. Ürün oluştur
      const productResponse = await request(app)
        .post('/api/products')
        .send({
          name: 'Test Laptop',
          description: 'High performance laptop',
          price: 15000,
          stock: 10,
          category_id: categoryId,
        })
        .expect(201);

      const productId = productResponse.body.id;

      // 4. Ürünleri listele
      const productsResponse = await request(app)
        .get('/api/products')
        .expect(200);

      expect(productsResponse.body.length).toBeGreaterThan(0);

      // 5. Ürün detayını görüntüle
      const productDetailResponse = await request(app)
        .get(`/api/products/${productId}`)
        .expect(200);

      expect(productDetailResponse.body.name).toBe('Test Laptop');

      // 6. Sipariş oluştur
      const orderResponse = await request(app)
        .post('/api/orders')
        .send({
          user_id: userId,
          items: [
            { product_id: productId, quantity: 2 },
          ],
          shipping_address: 'Test Shipping Address',
        })
        .expect(201);

      expect(orderResponse.body).toHaveProperty('id');
      expect(orderResponse.body).toHaveProperty('items');
      expect(orderResponse.body.items.length).toBe(1);
      expect(parseFloat(orderResponse.body.total_amount)).toBe(30000); // 15000 * 2

      // 7. Kullanıcının siparişlerini listele
      const userOrdersResponse = await request(app)
        .get(`/api/orders/user/${userId}`)
        .expect(200);

      expect(userOrdersResponse.body.length).toBeGreaterThan(0);
    });
  });

  describe('Scenario 2: Product Management Flow', () => {
    it('should complete product lifecycle: create → update → delete', async () => {
      // 1. Kategori oluştur
      const uniqueCategoryName = `Clothing ${Date.now()}`;
      const categoryResponse = await request(app)
        .post('/api/categories')
        .send({
          name: uniqueCategoryName,
          description: 'Clothing items',
        })
        .expect(201);

      const categoryId = categoryResponse.body.id;

      // 2. Ürün oluştur
      const createResponse = await request(app)
        .post('/api/products')
        .send({
          name: 'T-Shirt',
          description: 'Cotton t-shirt',
          price: 150,
          stock: 50,
          category_id: categoryId,
        })
        .expect(201);

      const productId = createResponse.body.id;

      // 3. Ürünü güncelle
      const updateResponse = await request(app)
        .patch(`/api/products/${productId}`)
        .send({
          name: 'Updated T-Shirt',
          price: 180,
        })
        .expect(200);

      expect(updateResponse.body.name).toBe('Updated T-Shirt');
      expect(parseFloat(updateResponse.body.price)).toBe(180);

      // 4. Kategoriye göre ürünleri listele
      const categoryProductsResponse = await request(app)
        .get(`/api/products/category/${categoryId}`)
        .expect(200);

      expect(categoryProductsResponse.body.length).toBeGreaterThan(0);

      // 5. Ürünü sil
      await request(app)
        .delete(`/api/products/${productId}`)
        .expect(200);

      // 6. Silinen ürünü kontrol et
      await request(app)
        .get(`/api/products/${productId}`)
        .expect(404);
    });
  });

  describe('Scenario 3: Review and Rating Flow', () => {
    it('should complete review flow: user → product → review', async () => {
      // 1. Kullanıcı oluştur
      const uniqueEmail = `review${Date.now()}@test.com`;
      const userResponse = await request(app)
        .post('/api/users')
        .send({
          name: 'Review User',
          email: uniqueEmail,
          password: 'password123',
        })
        .expect(201);

      const userId = userResponse.body.id;

      // 2. Kategori ve ürün oluştur
      const uniqueCategoryName = `Books ${Date.now()}`;
      const categoryResponse = await request(app)
        .post('/api/categories')
        .send({
          name: uniqueCategoryName,
          description: 'Books category',
        })
        .expect(201);

      const categoryId = categoryResponse.body.id;

      const productResponse = await request(app)
        .post('/api/products')
        .send({
          name: 'Test Book',
          description: 'A test book',
          price: 50,
          stock: 100,
          category_id: categoryId,
        })
        .expect(201);

      const productId = productResponse.body.id;

      // 3. Yorum oluştur
      const reviewResponse = await request(app)
        .post('/api/reviews')
        .send({
          user_id: userId,
          product_id: productId,
          rating: 5,
          comment: 'Excellent book!',
        })
        .expect(201);

      expect(reviewResponse.body.rating).toBe(5);
      expect(reviewResponse.body.comment).toBe('Excellent book!');

      // 4. Ürünün yorumlarını listele
      const productReviewsResponse = await request(app)
        .get(`/api/reviews/product/${productId}`)
        .expect(200);

      expect(productReviewsResponse.body.length).toBeGreaterThan(0);
      expect(productReviewsResponse.body[0].rating).toBe(5);

      // 5. Yorumu güncelle
      const updateReviewResponse = await request(app)
        .patch(`/api/reviews/${reviewResponse.body.id}`)
        .send({
          rating: 4,
          comment: 'Updated comment',
        })
        .expect(200);

      expect(updateReviewResponse.body.rating).toBe(4);
      expect(updateReviewResponse.body.comment).toBe('Updated comment');
    });
  });

  describe('Scenario 4: Order with Multiple Products', () => {
    it('should create order with multiple products and verify stock updates', async () => {
      // 1. Kullanıcı oluştur
      const uniqueEmail = `multi${Date.now()}@test.com`;
      const userResponse = await request(app)
        .post('/api/users')
        .send({
          name: 'Multi Order User',
          email: uniqueEmail,
          password: 'password123',
        })
        .expect(201);

      const userId = userResponse.body.id;

      // 2. Kategori oluştur
      const uniqueCategoryName = `Mixed ${Date.now()}`;
      const categoryResponse = await request(app)
        .post('/api/categories')
        .send({
          name: uniqueCategoryName,
          description: 'Mixed products',
        })
        .expect(201);

      const categoryId = categoryResponse.body.id;

      // 3. Birden fazla ürün oluştur
      const product1Response = await request(app)
        .post('/api/products')
        .send({
          name: 'Product 1',
          price: 100,
          stock: 20,
          category_id: categoryId,
        })
        .expect(201);

      const product2Response = await request(app)
        .post('/api/products')
        .send({
          name: 'Product 2',
          price: 200,
          stock: 15,
          category_id: categoryId,
        })
        .expect(201);

      const product1Id = product1Response.body.id;
      const product2Id = product2Response.body.id;

      // 4. Çoklu ürünlü sipariş oluştur
      const orderResponse = await request(app)
        .post('/api/orders')
        .send({
          user_id: userId,
          items: [
            { product_id: product1Id, quantity: 3 },
            { product_id: product2Id, quantity: 2 },
          ],
          shipping_address: 'Test Address',
        })
        .expect(201);

      expect(orderResponse.body.items.length).toBe(2);
      expect(parseFloat(orderResponse.body.total_amount)).toBe(700); // (100*3) + (200*2)

      // 5. Sipariş detayını kontrol et
      const orderDetailResponse = await request(app)
        .get(`/api/orders/${orderResponse.body.id}`)
        .expect(200);

      expect(orderDetailResponse.body.items.length).toBe(2);
    });
  });

  describe('Scenario 5: Error Handling Flow', () => {
    it('should handle errors gracefully: invalid data → insufficient stock → not found', async () => {
      // 1. Geçersiz kullanıcı oluşturma denemesi
      await request(app)
        .post('/api/users')
        .send({
          name: 'Test',
          email: 'invalid-email', // Geçersiz email
          password: '123', // Çok kısa şifre
        })
        .expect(400);

      // 2. Kullanıcı ve ürün oluştur
      const uniqueEmail = `error${Date.now()}@test.com`;
      const userResponse = await request(app)
        .post('/api/users')
        .send({
          name: 'Error Test User',
          email: uniqueEmail,
          password: 'password123',
        })
        .expect(201);

      const userId = userResponse.body.id;

      const uniqueCategoryName = `Test Category ${Date.now()}`;
      const categoryResponse = await request(app)
        .post('/api/categories')
        .send({
          name: uniqueCategoryName,
          description: 'Test',
        })
        .expect(201);

      const categoryId = categoryResponse.body.id;

      const productResponse = await request(app)
        .post('/api/products')
        .send({
          name: 'Low Stock Product',
          price: 100,
          stock: 5, // Düşük stok
          category_id: categoryId,
        })
        .expect(201);

      const productId = productResponse.body.id;

      // 3. Yetersiz stoklu sipariş denemesi
      await request(app)
        .post('/api/orders')
        .send({
          user_id: userId,
          items: [
            { product_id: productId, quantity: 10 }, // Stoktan fazla
          ],
        })
        .expect(400);

      // 4. Olmayan kaynağa erişim
      await request(app)
        .get('/api/users/99999')
        .expect(404);

      await request(app)
        .get('/api/products/99999')
        .expect(404);

      await request(app)
        .get('/api/orders/99999')
        .expect(404);
    });
  });
});
