const pool = require('../../../db');

class Course {
  static async create({ title, description, cover, is_published = 1 }) {
    const [result] = await pool.execute(
      'INSERT INTO courses (title, description, cover, is_published) VALUES (?,?,?,?)',
      [title, description, cover, is_published]
    );
    return { course_id: result.insertId, title, description, cover, is_published };
  }

  static async findAll() {
    const [rows] = await pool.execute('SELECT * FROM courses ORDER BY created_at DESC');
    return rows;
  }

  static async findById(course_id) {
    const [rows] = await pool.execute('SELECT * FROM courses WHERE course_id = ?', [course_id]);
    return rows[0];
  }

  static async update(course_id, fields) {
    const keys = Object.keys(fields);
    if (!keys.length) return null;
    const sets = keys.map(k => `${k} = ?`).join(', ');
    const values = keys.map(k => fields[k]);
    values.push(course_id);
    await pool.execute(`UPDATE courses SET ${sets} WHERE course_id = ?`, values);
    return this.findById(course_id);
  }

  static async remove(course_id) {
    await pool.execute('DELETE FROM courses WHERE course_id = ?', [course_id]);
    return true;
  }
}

module.exports = Course;
