const { query } = require('../database/db');

class Category {
  static async findAll() {
    const result = await query('SELECT * FROM categories ORDER BY id');
    return result.rows;
  }

  static async findById(id) {
    const result = await query('SELECT * FROM categories WHERE id = $1', [id]);
    return result.rows[0];
  }

  static async findByName(name) {
    const result = await query('SELECT * FROM categories WHERE name = $1', [name]);
    return result.rows[0];
  }

  static async create(categoryData) {
    const { name, description } = categoryData;
    const result = await query(
      'INSERT INTO categories (name, description) VALUES ($1, $2) RETURNING *',
      [name, description || null]
    );
    return result.rows[0];
  }

  static async update(id, categoryData) {
    const { name, description } = categoryData;
    const result = await query(
      `UPDATE categories 
       SET name = $1, description = $2, updated_at = CURRENT_TIMESTAMP 
       WHERE id = $3 
       RETURNING *`,
      [name, description, id]
    );
    return result.rows[0];
  }

  static async delete(id) {
    const result = await query('DELETE FROM categories WHERE id = $1 RETURNING id', [id]);
    return result.rows[0];
  }
}

module.exports = Category;
