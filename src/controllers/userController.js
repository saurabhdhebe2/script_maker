const userService = require('../services/userService');
const { success, error } = require('../utils/response');

/**
 * Register a new user
 */
const registerUser = async (req, res, next) => {
  try {
    const { email, password, username } = req.body;

    if (!email || !password || !username) {
      return error(res, 'common.missingFields', 400);
    }

    const newUser = await userService.registerUser({ email, password, username },res);

    return success(res, 'auth.registerSuccess', { user: newUser });
  } catch (err) {
    return error(res, err.message);
  }
};

/**
 * Login user
 */
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return error(res, 'common.missingFields', 400);
    }

    const { user, token } = await userService.loginUser(email, password,res);

    return success(res, 'auth.loginSuccess', { user, token });
  } catch (err) {
    return error(res, err.message);
  }
};

/**
 * Update user details
 */
const updateUser = async (req, res, next) => {
  try {
    const userId = req.user.id; 
    const updatedData = req.body;

    const updatedUser = await userService.updateUserDetails(userId, updatedData,res);

    return success(res, 'user.userUpdated', { user: updatedUser });
  } catch (err) {
    return error(res, err.message);
  }
};

/**
 * Delete user
 */
const deleteUser = async (req, res, next) => {
  try {
    const userId = req.user.id; // Assuming user info is in the request

    await userService.deleteUser(userId,res);

    return success(res, 'user.userDeleted');
  } catch (err) {
    return error(res, err.message);
  }
};

module.exports = { registerUser, loginUser, updateUser, deleteUser };
