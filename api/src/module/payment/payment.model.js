const pool = require('../../../db');

class Payment {
  static async grantAccess({ user_id, course_id, month_id, amount = 0, status = 'paid', txn_ref = null }) {
    const paidAt = new Date();
    const [result] = await pool.execute(
      'INSERT INTO payments (user_id, course_id, month_id, amount, status, txn_ref, paid_at) VALUES (?,?,?,?,?,?,?) ON DUPLICATE KEY UPDATE status=VALUES(status), amount=VALUES(amount), txn_ref=VALUES(txn_ref), paid_at=VALUES(paid_at)',
      [user_id, course_id, month_id, amount, status, txn_ref, paidAt]
    );
    return this.findByUserAndMonth(user_id, month_id);
  }

  static async findByUserAndMonth(user_id, month_id) {
    const [rows] = await pool.execute('SELECT * FROM payments WHERE user_id = ? AND month_id = ?', [user_id, month_id]);
    return rows[0];
  }

  static async userPaidMonths(user_id) {
    const [rows] = await pool.execute('SELECT month_id FROM payments WHERE user_id = ? AND status = "paid"', [user_id]);
    return rows.map(r => r.month_id);
  }
}

module.exports = Payment;
