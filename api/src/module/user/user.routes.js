// User routes for authentication
const express = require('express');
const router = express.Router();
const { requireAuth } = require('../../middleware/auth');
const validate = require('../../middleware/validate');
const UserController = require('./user.controller');

router.post('/register', validate({
  username: { required: true, type: 'string', minLength: 3, maxLength: 50 },
  email: { required: true, type: 'email', maxLength: 100 },
  password: { required: true, type: 'string', minLength: 6 }
}), UserController.register);

router.post('/login', validate({
  email: { required: true, type: 'email' },
  password: { required: true, type: 'string' }
}), UserController.login);

router.get('/me', requireAuth, UserController.getMe);

module.exports = router;
