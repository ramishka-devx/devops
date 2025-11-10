const express = require('express');
const { requireAuth } = require('../../middleware/auth');
const ctrl = require('./payment.controller');
const router = express.Router();

router.post('/payments/months/:monthId', requireAuth, ctrl.payForMonth);

module.exports = router;
