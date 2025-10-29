// User service for business logic
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('./user.model');
require('dotenv').config();

const SALT_ROUNDS = 10;

exports.register = async ({ username, email, password }) => {
  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
  await User.create({ username, email, password: hashedPassword });
  return { username, email };
};

exports.login = async ({ email, password }) => {
  const users = await User.findByEmail(email);
  if (!users.length) return { success: false, message: 'User not found' };
  const user = users[0];
  const match = await bcrypt.compare(password, user.password);
  if (!match) return { success: false, message: 'Invalid password' };
  const token = jwt.sign(
    { user_id: user.user_id, username: user.username, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );
  return {
    success: true,
    message: 'Login successful',
    user: { user_id: user.user_id, username: user.username, email: user.email },
    token
  };
};

exports.getMe = async (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const users = await User.findByEmail(decoded.email);
    if (!users.length) throw new Error('User not found');
    const user = users[0];
    return { user_id: user.user_id, username: user.username, email: user.email };
  } catch (err) {
    throw new Error('Invalid token');
  }
};
