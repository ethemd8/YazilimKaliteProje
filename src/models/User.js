const { query } = require('../database/db');

class User {
  static async findAll() {
    const result = await query('SELECT id, name, email, phone, address, created_at, updated_at FROM users ORDER BY id');
    return result.rows;
  }

  static async findById(id) {
    const result = await query(
      'SELECT id, name, email, phone, address, created_at, updated_at FROM users WHERE id = $1',
      [id]
    );
    return result.rows[0];
  }

  static async findByEmail(email) {
    const result = await query('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows[0];
  }

  static async create(userData) {
    const { name, email, password, phone, address } = userData;
    const result = await query(
      `INSERT INTO users (name, email, password, phone, address) 
       VALUES ($1, $2, $3, $4, $5) 
       RETURNING id, name, email, phone, address, created_at, updated_at`,
      [name, email, password, phone || null, address || null]
    );
    return result.rows[0];
  }

  static async update(id, userData) {
    const updates = [];
    const values = [];
    let paramCount = 1;

    if (userData.name !== undefined) {
      updates.push(`name = $${paramCount++}`);
      values.push(userData.name);
    }
    if (userData.email !== undefined) {
      updates.push(`email = $${paramCount++}`);
      values.push(userData.email);
    }
    if (userData.phone !== undefined) {
      updates.push(`phone = $${paramCount++}`);
      values.push(userData.phone);
    }
    if (userData.address !== undefined) {
      updates.push(`address = $${paramCount++}`);
      values.push(userData.address);
    }

    if (updates.length === 0) {
      return await this.findById(id);
    }

    updates.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(id);

    const result = await query(
      `UPDATE users 
       SET ${updates.join(', ')} 
       WHERE id = $${paramCount} 
       RETURNING id, name, email, phone, address, created_at, updated_at`,
      values
    );
    return result.rows[0];
  }

  static async delete(id) {
    const result = await query('DELETE FROM users WHERE id = $1 RETURNING id', [id]);
    return result.rows[0];
  }
}

module.exports = User;
