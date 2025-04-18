const bcrypt = require('bcrypt');
const jwt = require('../utils/jwt');
const userModel = require('../models/userModel');
const logger = require('../config/logger');
const { success, error } = require('../utils/response');

/**
 * Register a new user
 */
const registerUser = async (userData, res) => {
  try {
    const { email, password, username } = userData;

    const existingUser = await userModel.findUserByEmail(email);
    if (existingUser) {
      logger.warn(`Email already in use: ${email}`);
      return error(res, 'auth.emailInUse', 409);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await userModel.createUser({ email, username, password: hashedPassword });

    logger.info(`New user registered: ${email}`);
    return success(res, 'auth.registerSuccess', { user: newUser[0] });
  } catch (err) {
    logger.error(`Error during user registration: ${err.message}`);
    return error(res, 'common.serverError');
  }
};

/**
 * Login user
 */
const loginUser = async (email, password, res) => {
  try {
    const user = await userModel.findUserByEmail(email);
    if (!user) {
      return error(res, 'auth.userNotFound', 404);
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return error(res, 'auth.incorrectPassword', 401);
    }

    const token = jwt.generateToken({ id: user.id, email: user.email });

    logger.info(`User logged in: ${email}`);
    return success(res, 'auth.loginSuccess', { user, token });
  } catch (err) {
    logger.error(`Error during user login: ${err.message}`);
    return error(res, 'common.serverError');
  }
};

/**
 * Update user details
 */
const updateUserDetails = async (userId, updatedData, res) => {
  try {
    const updatedUser = await userModel.updateUser(userId, updatedData);
    if (!updatedUser) {
      return error(res, 'user.userNotFound', 404);
    }

    logger.info(`User updated: ${updatedUser.email}`);
    return success(res, 'user.userUpdated', { user: updatedUser });
  } catch (err) {
    logger.error(`Error updating user: ${err.message}`);
    return error(res, 'common.serverError');
  }
};

/**
 * Delete user
 */
const deleteUser = async (userId, res) => {
  try {
    const deletedUser = await userModel.deleteUser(userId);
    if (!deletedUser) {
      return error(res, 'user.userNotFound', 404);
    }

    logger.info(`User deleted: ${userId}`);
    return success(res, 'user.userDeleted');
  } catch (err) {
    logger.error(`Error deleting user: ${err.message}`);
    return error(res, 'common.serverError');
  }
};

module.exports = {
  registerUser,
  loginUser,
  updateUserDetails,
  deleteUser,
};
