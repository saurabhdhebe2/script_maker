const planService = require('../services/planService');
const { success, error } = require('../utils/response');

// GET all plans
const getAllPlans = async (req, res) => {
  try {
    const plans = await planService.getAllPlans();
    return success(res, 'plans.fetched', { plans });
  } catch (err) {
    return error(res, 'plans.fetchError', 500, err.message);
  }
};

// Subscribe to a plan
const subscribeToPlan = async (req, res) => {
  try {
    const userId = req.user.id;
    const { planId } = req.body;

    if (!planId) return error(res, 'common.missingFields', 400);

    const subscription = await planService.subscribeUserToPlan(userId, planId);
    if (!subscription) return error(res, 'plans.subscriptionFailed', 400);

    return success(res, 'plans.subscribed', { subscription });
  } catch (err) {
    return error(res, 'plans.subscriptionError', 500, err.message);
  }
};

// Get user's current subscription
const getUserSubscription = async (req, res) => {
  try {
    const userId = req.user.id;
    const subscription = await planService.getUserSubscription(userId);

    if (!subscription) return error(res, 'plans.noActiveSubscription', 404);

    return success(res, 'plans.subscriptionFetched', { subscription });
  } catch (err) {
    return error(res, 'plans.subscriptionError', 500, err.message);
  }
};

module.exports = {
  getAllPlans,
  subscribeToPlan,
  getUserSubscription,
};
