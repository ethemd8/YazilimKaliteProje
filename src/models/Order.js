const { query } = require('../database/db');

class Order {
  static async findAll() {
    const result = await query(`
      SELECT o.*, u.name as user_name, u.email as user_email
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.id
      ORDER BY o.id DESC
    `);
    return result.rows;
  }

  static async findById(id) {
    const result = await query(
      `SELECT o.*, u.name as user_name, u.email as user_email
       FROM orders o
       LEFT JOIN users u ON o.user_id = u.id
       WHERE o.id = $1`,
      [id]
    );
    return result.rows[0];
  }

  static async findByUserId(userId) {
    const result = await query(
      `SELECT o.*, u.name as user_name, u.email as user_email
       FROM orders o
       LEFT JOIN users u ON o.user_id = u.id
       WHERE o.user_id = $1
       ORDER BY o.id DESC`,
      [userId]
    );
    return result.rows;
  }

  static async create(orderData) {
    const { user_id, total_amount, status, shipping_address } = orderData;
    const result = await query(
      `INSERT INTO orders (user_id, total_amount, status, shipping_address) 
       VALUES ($1, $2, $3, $4) 
       RETURNING *`,
      [user_id, total_amount, status || 'pending', shipping_address || null]
    );
    return result.rows[0];
  }

  static async update(id, orderData) {
    const { status, shipping_address } = orderData;
    const result = await query(
      `UPDATE orders 
       SET status = $1, shipping_address = $2, updated_at = CURRENT_TIMESTAMP 
       WHERE id = $3 
       RETURNING *`,
      [status, shipping_address, id]
    );
    return result.rows[0];
  }

  static async delete(id) {
    const result = await query('DELETE FROM orders WHERE id = $1 RETURNING id', [id]);
    return result.rows[0];
  }

  static async getOrderItems(orderId) {
    const result = await query(
      `SELECT oi.*, p.name as product_name, p.description as product_description
       FROM order_items oi
       LEFT JOIN products p ON oi.product_id = p.id
       WHERE oi.order_id = $1`,
      [orderId]
    );
    return result.rows;
  }
}

module.exports = Order;
