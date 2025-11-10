const pool = require('../../../db');

class Month {
  static async create({ course_id, title, month_index, price = 0, is_published = 1 }) {
    const [result] = await pool.execute(
      'INSERT INTO course_months (course_id, title, month_index, price, is_published) VALUES (?,?,?,?,?)',
      [course_id, title, month_index, price, is_published]
    );
    return this.findById(result.insertId);
  }

  static async listByCourse(course_id) {
    const [rows] = await pool.execute(
      'SELECT * FROM course_months WHERE course_id = ? ORDER BY month_index ASC',
      [course_id]
    );
    return rows;
  }

  static async findById(month_id) {
    const [rows] = await pool.execute('SELECT * FROM course_months WHERE month_id = ?', [month_id]);
    return rows[0];
  }

  static async update(month_id, fields) {
    const keys = Object.keys(fields);
    if (!keys.length) return this.findById(month_id);
    const sets = keys.map(k => `${k} = ?`).join(', ');
    const values = keys.map(k => fields[k]);
    values.push(month_id);
    await pool.execute(`UPDATE course_months SET ${sets} WHERE month_id = ?`, values);
    return this.findById(month_id);
  }

  static async remove(month_id) {
    await pool.execute('DELETE FROM course_months WHERE month_id = ?', [month_id]);
    return true;
  }
}

module.exports = Month;
