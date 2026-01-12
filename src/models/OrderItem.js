const { query } = require('../database/db');

class OrderItem {
  static async create(orderItemData) {
    const { order_id, product_id, quantity, price } = orderItemData;
    const result = await query(
      `INSERT INTO order_items (order_id, product_id, quantity, price) 
       VALUES ($1, $2, $3, $4) 
       RETURNING *`,
      [order_id, product_id, quantity, price]
    );
    return result.rows[0];
  }

  static async findByOrderId(orderId) {
    const result = await query(
      'SELECT * FROM order_items WHERE order_id = $1',
      [orderId]
    );
    return result.rows;
  }

  static async delete(orderId, productId) {
    const result = await query(
      'DELETE FROM order_items WHERE order_id = $1 AND product_id = $2 RETURNING id',
      [orderId, productId]
    );
    return result.rows[0];
  }
}

module.exports = OrderItem;
