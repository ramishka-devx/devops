// User controller for registration and login
const UserService = require('./user.service');

exports.register = async (req, res) => {
  try {
    const user = await UserService.register(req.body);
    res.status(201).json({ message: 'User registered', user });
  } catch (err) {
    throw err;
  }
};

exports.login = async (req, res) => {
  try {
    const result = await UserService.login(req.body);
    if (result.success) {
      res.status(200).json({
        message: result.message,
        user: result.user,
        token: result.token
      });
    } else {
      throw new Error(result.message);
    }
  } catch (err) {
    throw err;
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await UserService.getMe(req.user.user_id);
    res.status(200).json({ user });
  } catch (err) {
    throw err;
  }
};
