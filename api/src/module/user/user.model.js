// User model for authentication
const pool = require('../../../db/index.js');

class User {
  static async create({ username, email, password, role = 'student' }) {
    const sql = 'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)';
    const params = [username, email, password, role];
    const [result] = await pool.execute(sql, params);
    return { user_id: result.insertId, username, email, role };
  }

  static async findByEmail(email) {
    const sql = 'SELECT * FROM users WHERE email = ?';
    const [rows] = await pool.execute(sql, [email]);
    return rows;
  }
}

module.exports = User;
