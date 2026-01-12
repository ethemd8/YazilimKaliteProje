const { query } = require('../database/db');

class Product {
  static async findAll() {
    const result = await query(`
      SELECT p.*, c.name as category_name 
      FROM products p 
      LEFT JOIN categories c ON p.category_id = c.id 
      ORDER BY p.id
    `);
    return result.rows;
  }

  static async findById(id) {
    const result = await query(
      `SELECT p.*, c.name as category_name 
       FROM products p 
       LEFT JOIN categories c ON p.category_id = c.id 
       WHERE p.id = $1`,
      [id]
    );
    return result.rows[0];
  }

  static async findByCategory(categoryId) {
    const result = await query(
      `SELECT p.*, c.name as category_name 
       FROM products p 
       LEFT JOIN categories c ON p.category_id = c.id 
       WHERE p.category_id = $1 
       ORDER BY p.id`,
      [categoryId]
    );
    return result.rows;
  }

  static async create(productData) {
    const { name, description, price, stock, category_id, image_url } = productData;
    const result = await query(
      `INSERT INTO products (name, description, price, stock, category_id, image_url) 
       VALUES ($1, $2, $3, $4, $5, $6) 
       RETURNING *`,
      [name, description || null, price, stock, category_id || null, image_url || null]
    );
    return result.rows[0];
  }

  static async update(id, productData) {
    const updates = [];
    const values = [];
    let paramCount = 1;

    if (productData.name !== undefined) {
      updates.push(`name = $${paramCount++}`);
      values.push(productData.name);
    }
    if (productData.description !== undefined) {
      updates.push(`description = $${paramCount++}`);
      values.push(productData.description);
    }
    if (productData.price !== undefined) {
      updates.push(`price = $${paramCount++}`);
      values.push(productData.price);
    }
    if (productData.stock !== undefined) {
      updates.push(`stock = $${paramCount++}`);
      values.push(productData.stock);
    }
    if (productData.category_id !== undefined) {
      updates.push(`category_id = $${paramCount++}`);
      values.push(productData.category_id);
    }
    if (productData.image_url !== undefined) {
      updates.push(`image_url = $${paramCount++}`);
      values.push(productData.image_url);
    }

    if (updates.length === 0) {
      return await this.findById(id);
    }

    updates.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(id);

    const result = await query(
      `UPDATE products 
       SET ${updates.join(', ')} 
       WHERE id = $${paramCount} 
       RETURNING *`,
      values
    );
    return result.rows[0];
  }

  static async delete(id) {
    const result = await query('DELETE FROM products WHERE id = $1 RETURNING id', [id]);
    return result.rows[0];
  }

  static async updateStock(id, quantity) {
    const result = await query(
      'UPDATE products SET stock = stock - $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
      [quantity, id]
    );
    return result.rows[0];
  }
}

module.exports = Product;
