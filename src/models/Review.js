const { query } = require('../database/db');

class Review {
  static async findAll() {
    const result = await query(`
      SELECT r.*, u.name as user_name, p.name as product_name
      FROM reviews r
      LEFT JOIN users u ON r.user_id = u.id
      LEFT JOIN products p ON r.product_id = p.id
      ORDER BY r.id DESC
    `);
    return result.rows;
  }

  static async findById(id) {
    const result = await query(
      `SELECT r.*, u.name as user_name, p.name as product_name
       FROM reviews r
       LEFT JOIN users u ON r.user_id = u.id
       LEFT JOIN products p ON r.product_id = p.id
       WHERE r.id = $1`,
      [id]
    );
    return result.rows[0];
  }

  static async findByProductId(productId) {
    const result = await query(
      `SELECT r.*, u.name as user_name
       FROM reviews r
       LEFT JOIN users u ON r.user_id = u.id
       WHERE r.product_id = $1
       ORDER BY r.id DESC`,
      [productId]
    );
    return result.rows;
  }

  static async findByUserId(userId) {
    const result = await query(
      `SELECT r.*, p.name as product_name
       FROM reviews r
       LEFT JOIN products p ON r.product_id = p.id
       WHERE r.user_id = $1
       ORDER BY r.id DESC`,
      [userId]
    );
    return result.rows;
  }

  static async create(reviewData) {
    const { user_id, product_id, rating, comment } = reviewData;
    const result = await query(
      `INSERT INTO reviews (user_id, product_id, rating, comment) 
       VALUES ($1, $2, $3, $4) 
       RETURNING *`,
      [user_id, product_id, rating, comment || null]
    );
    return result.rows[0];
  }

  static async update(id, reviewData) {
    const { rating, comment } = reviewData;
    const result = await query(
      `UPDATE reviews 
       SET rating = $1, comment = $2, updated_at = CURRENT_TIMESTAMP 
       WHERE id = $3 
       RETURNING *`,
      [rating, comment, id]
    );
    return result.rows[0];
  }

  static async delete(id) {
    const result = await query('DELETE FROM reviews WHERE id = $1 RETURNING id', [id]);
    return result.rows[0];
  }
}

module.exports = Review;
