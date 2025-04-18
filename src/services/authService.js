const bcrypt = require('bcrypt');
const jwt = require('../utils/jwt');
const authModel = require('../models/authModel');
const logger = require('../config/logger');
const responseMessages = require('../utils/responseMessages.json');

/**
 * Register a new user
 */
const register = async ({ email, username, password }) => {
  try {
    const existingUser = await authModel.findUserByEmail(email);
    if (existingUser) throw new Error('auth.emailInUse');

    const hashedPassword = await bcrypt.hash(password, 10);
    const [user] = await authModel.createUser({ email, username, password: hashedPassword });

    logger.info(`User registered: ${user.email}`);
    return user;
  } catch (err) {
    logger.error(`Error in register: ${err.message}`);
    throw new Error(err.message || responseMessages.common.serverError);
  }
};

/**
 * Login an existing user
 */
const login = async ({ email, password }) => {
  try {
    const user = await authModel.findUserByEmail(email);
    if (!user) throw new Error('auth.userNotFound');

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) throw new Error('auth.incorrectPassword');

    const token = jwt.generateToken({ id: user.id, email: user.email });
    logger.info(`User logged in: ${user.email}`);
    return { user, token };
  } catch (err) {
    logger.error(`Error in login: ${err.message}`);
    throw new Error(err.message || responseMessages.common.serverError);
  }
};

/**
 * Verify the user's email
 */
const verifyEmail = async (userId) => {
  try {
    return await authModel.updateUser(userId, { is_verified: true });
  } catch (err) {
    logger.error(`Error in verifyEmail: ${err.message}`);
    throw new Error(err.message || responseMessages.common.serverError);
  }
};

/**
 * Request a password reset token
 */
const requestPasswordReset = async (email) => {
  try {
    const user = await authModel.findUserByEmail(email);
    if (!user) throw new Error('auth.userNotFound');

    const resetToken = jwt.generateToken({ id: user.id }, '15m');
    logger.info(`Password reset requested for ${email}`);
    return resetToken;
  } catch (err) {
    logger.error(`Error in requestPasswordReset: ${err.message}`);
    throw new Error(err.message || responseMessages.common.serverError);
  }
};

/**
 * Reset the user's password
 */
const resetPassword = async (userId, newPassword) => {
  try {
    const hashed = await bcrypt.hash(newPassword, 10);
    await authModel.updateUser(userId, { password: hashed });
    logger.info(`Password reset for user ID: ${userId}`);
  } catch (err) {
    logger.error(`Error in resetPassword: ${err.message}`);
    throw new Error(err.message || responseMessages.common.serverError);
  }
};

module.exports = {
  register,
  login,
  verifyEmail,
  requestPasswordReset,
  resetPassword,
};
