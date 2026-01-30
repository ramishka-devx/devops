const express = require('express');
const { requireAuth } = require('../../middleware/auth');
const validate = require('../../middleware/validate');
const ctrl = require('./payment.controller');
const router = express.Router();

router.post('/payments/months/:monthId', requireAuth, validate({
  // Add validation if needed, e.g., payment method
}), ctrl.payForMonth);

// Add route to check payment status
router.get('/payments/months/:monthId', requireAuth, ctrl.checkPaymentStatus);

// Add route to get enrolled courses
router.get('/payments/enrolled-courses', requireAuth, ctrl.getEnrolledCourses);

module.exports = router;
