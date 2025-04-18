const planSubscriptionService = require('../services/planSubscriptionService');
const { success, error } = require('../utils/response');

/**
 * Get current user's subscription details
 */
const getMySubscription = async (req, res) => {
  try {
    const userId = req.user.id;
    const subscription = await planSubscriptionService.getSubscriptionByUserId(userId,res);
    
    if (!subscription) {
      return error(res, 'subscription.noSubscriptionFound', 404);
    }

    return success(res, 'subscription.subscriptionFound', { subscription });
  } catch (err) {
    return error(res, 'common.serverError');
  }
};

/**
 * Subscribe a user to a plan
 */
const subscribeToPlan = async (req, res) => {
  try {
    const { planId } = req.body;
    const userId = req.user.id;

    if (!planId) {
      return error(res, 'common.missingFields', 400);
    }

    const subscription = await planSubscriptionService.subscribeUserToPlan(userId, planId,res);

    return success(res, 'subscription.subscriptionSuccess', { subscription });
  } catch (err) {
    return error(res, 'common.serverError');
  }
};

/**
 * Cancel a user's subscription
 */
const cancelSubscription = async (req, res) => {
  try {
    const userId = req.user.id;
    const cancelled = await planSubscriptionService.cancelUserSubscription(userId,res);

    if (!cancelled) {
      return error(res, 'subscription.cancelFailed', 400);
    }

    return success(res, 'subscription.subscriptionCancelled');
  } catch (err) {
    return error(res, 'common.serverError');
  }
};

/**
 * Admin - Get all subscriptions
 */
const getAllSubscriptions = async (req, res) => {
  try {
    const { role, plan, startDate, endDate } = req.query;
    const subscriptions = await planSubscriptionService.getAllSubscriptions({ role, plan, startDate, endDate },res);
    
    return success(res, 'subscription.allSubscriptions', { subscriptions });
  } catch (err) {
    return error(res, 'common.serverError');
  }
};

/**
 * Admin - Get all plans
 */
const getAllPlans = async (req, res) => {
  try {
    const plans = await planSubscriptionService.getAllPlans(res);
    return success(res, 'plans.fetched', { plans });
  } catch (err) {
    return error(res, 'common.serverError');
  }
};

/**
 * Admin - Compare Plans
 */
const comparePlans = async (req, res) => {
  try {
    const { planId1, planId2 } = req.query;

    if (!planId1 || !planId2) {
      return error(res, 'common.missingFields', 400);
    }

    const comparison = await planSubscriptionService.comparePlans(planId1, planId2,res);
    return success(res, 'plans.compared', { comparison });
  } catch (err) {
    return error(res, 'common.serverError');
  }
};

/**
 * Admin - Upgrade a user's subscription
 */
const upgradeSubscription = async (req, res) => {
  try {
    const {  newPlanId } = req.body;

    if ( !newPlanId) {
      return error(res, 'common.missingFields', 400);
    }

    const upgradedSubscription = await planSubscriptionService.upgradeUserSubscription(req, newPlanId,res);

    return success(res, 'subscription.subscriptionUpgraded', { upgradedSubscription });
  } catch (err) {
    return error(res, 'common.serverError');
  }
};

module.exports = {
  getMySubscription,
  subscribeToPlan,
  cancelSubscription,
  getAllSubscriptions,
  getAllPlans,
  comparePlans,
  upgradeSubscription,
};
