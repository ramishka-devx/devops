const pool = require('../../../db');

class Lesson {
  static async create({ month_id, title, content_url = null, content = null, display_order = 1, is_published = 1 }) {
    const [result] = await pool.execute(
      'INSERT INTO lessons (month_id, title, content_url, content, display_order, is_published) VALUES (?,?,?,?,?,?)',
      [month_id, title, content_url, content, display_order, is_published]
    );
    return this.findById(result.insertId);
  }

  static async findById(lesson_id) {
    const [rows] = await pool.execute('SELECT * FROM lessons WHERE lesson_id = ?', [lesson_id]);
    return rows[0];
  }

  static async listByMonth(month_id) {
    const [rows] = await pool.execute(
      'SELECT * FROM lessons WHERE month_id = ? AND is_published = 1 ORDER BY display_order ASC',
      [month_id]
    );
    return rows;
  }

  static async update(lesson_id, fields) {
    const keys = Object.keys(fields);
    if (!keys.length) return this.findById(lesson_id);
    const sets = keys.map(k => `${k} = ?`).join(', ');
    const values = keys.map(k => fields[k]);
    values.push(lesson_id);
    await pool.execute(`UPDATE lessons SET ${sets} WHERE lesson_id = ?`, values);
    return this.findById(lesson_id);
  }

  static async remove(lesson_id) {
    await pool.execute('DELETE FROM lessons WHERE lesson_id = ?', [lesson_id]);
    return true;
  }
}

module.exports = Lesson;
