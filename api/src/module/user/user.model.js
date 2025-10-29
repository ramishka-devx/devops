// User model for authentication
const pool = require('../../../db/index.js');

class User {
  static async create({ username, email, password }) {
    const sql = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
    const params = [username, email, password];
    const [result] = await pool.execute(sql, params);
    return result;
  }

  static async findByEmail(email) {
    const sql = 'SELECT * FROM users WHERE email = ?';
    const [rows] = await pool.execute(sql, [email]);
    return rows;
  }
}

module.exports = User;
