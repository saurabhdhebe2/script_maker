const authService = require('../services/authService');
const response = require('../utils/response');

const registerUser = async (req, res, next) => {
  try {
    const user = await authService.register(req.body);
    return response.success(res, 'auth.registerSuccess', { user }, 201);
  } catch (err) {
    next(err);
  }
};

const loginUser = async (req, res, next) => {
  try {
    const { user, token } = await authService.login(req.body);
    return response.success(res, 'auth.loginSuccess', { user, token });
  } catch (err) {
    next(err);
  }
};

const verifyUserEmail = async (req, res, next) => {
  try {
    const user = await authService.verifyEmail(req.user.id);
    return response.success(res, 'auth.emailVerified', { user });
  } catch (err) {
    next(err);
  }
};

const requestPasswordReset = async (req, res, next) => {
  try {
    const token = await authService.requestPasswordReset(req.body.email);
    return response.success(res, 'auth.passwordResetRequested', { token });
  } catch (err) {
    next(err);
  }
};

const resetUserPassword = async (req, res, next) => {
  try {
    const { id } = req.user;
    await authService.resetPassword(id, req.body.password);
    return response.success(res, 'auth.passwordResetSuccess');
  } catch (err) {
    next(err);
  }
};

module.exports = {
  registerUser,
  loginUser,
  verifyUserEmail,
  requestPasswordReset,
  resetUserPassword,
};
