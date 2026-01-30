// User service for business logic
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('./user.model');
require('dotenv').config();

const SALT_ROUNDS = 10;

exports.register = async ({ username, email, password, role }) => {
  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
  const created = await User.create({ username, email, password: hashedPassword, role: role || 'student' });
  return { user_id: created.user_id, username, email, role: created.role };
};

exports.login = async ({ email, password }) => {
  const users = await User.findByEmail(email);
  if (!users.length) return { success: false, message: 'User not found' };
  const user = users[0];
  const match = await bcrypt.compare(password, user.password);
  if (!match) return { success: false, message: 'Invalid password' };
  const token = jwt.sign(
    { user_id: user.user_id, username: user.username, email: user.email, role: user.role || 'student' },
    process.env.JWT_SECRET,
    { expiresIn: '2h' }
  );
  return {
    success: true,
    message: 'Login successful',
    user: { user_id: user.user_id, username: user.username, email: user.email, role: user.role || 'student' },
    token
  };
};

exports.getMe = async (userId) => {
  const users = await User.findById(userId);
  if (!users.length) throw new Error('User not found');
  const user = users[0];
  return { user_id: user.user_id, username: user.username, email: user.email, role: user.role || 'student' };
};
