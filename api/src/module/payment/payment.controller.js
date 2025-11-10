const Month = require('../course/month.model');
const Payment = require('./payment.model');

exports.payForMonth = async (req, res) => {
  try {
    const { monthId } = req.params;
    const month = await Month.findById(monthId);
    if (!month) return res.status(404).json({ error: 'Month not found' });

    const amount = month.price || 0;
    const grant = await Payment.grantAccess({
      user_id: req.user.user_id,
      course_id: month.course_id,
      month_id: month.month_id,
      amount,
      status: 'paid',
      txn_ref: null
    });
    res.status(201).json({ payment: grant });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
