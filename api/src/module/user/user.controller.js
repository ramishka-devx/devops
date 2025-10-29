// User controller for registration and login
const UserService = require('./user.service');

exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const user = await UserService.register({ username, email, password });
    res.status(201).json({ message: 'User registered', user });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await UserService.login({ email, password });
    if (result.success) {
      res.status(200).json({
        message: result.message,
        user: result.user,
        token: result.token
      });
    } else {
      res.status(401).json({ error: result.message });
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getMe = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token provided' });
    const user = await UserService.getMe(token);
    res.status(200).json({ user });
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
};
