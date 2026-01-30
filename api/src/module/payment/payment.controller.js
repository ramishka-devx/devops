const Month = require('../course/month.model');
const Payment = require('./payment.model');

exports.payForMonth = async (req, res) => {
  try {
    const { monthId } = req.params;
    const month = await Month.findById(monthId);
    if (!month) throw new Error('Month not found');

    // Check if already paid
    const existing = await Payment.findByUserAndMonth(req.user.user_id, monthId);
    if (existing && existing.status === 'paid') {
      return res.status(200).json({ message: 'Already paid', payment: existing });
    }

    const amount = month.price || 0;
    // In real app, integrate with payment gateway here
    // For now, assume payment succeeds
    const grant = await Payment.grantAccess({
      user_id: req.user.user_id,
      course_id: month.course_id,
      month_id: month.month_id,
      amount,
      status: 'paid',
      txn_ref: `txn_${Date.now()}_${req.user.user_id}`
    });
    res.status(201).json({ payment: grant });
  } catch (err) {
    throw err;
  }
};

exports.checkPaymentStatus = async (req, res) => {
  try {
    const { monthId } = req.params;
    const payment = await Payment.findByUserAndMonth(req.user.user_id, monthId);
    res.json({ payment });
  } catch (err) {
    throw err;
  }
};

exports.getEnrolledCourses = async (req, res) => {
  try {
    const payments = await Payment.findByUser(req.user.user_id);
    const courseIds = [...new Set(payments.map(p => p.course_id))];
    const Course = require('../course/course.model');
    const courses = await Promise.all(courseIds.map(id => Course.findById(id)));
    res.json({ courses: courses.filter(c => c) });
  } catch (err) {
    throw err;
  }
};
