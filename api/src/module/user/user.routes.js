// User routes for authentication
const express = require('express');
const router = express.Router();
const UserController = require('./user.controller');

router.post('/register', UserController.register);
router.post('/login', UserController.login);
router.get('/me', UserController.getMe);

module.exports = router;
