const planModel = require('../models/planModel');
const subscriptionModel = require('../models/subscriptionModel');
const logger = require('../config/logger');
const { success, error } = require('../utils/response');

/**
 * Get current user subscription
 */
const getSubscriptionByUserId = async (userId, res) => {
  try {
    const subscription = await subscriptionModel.getSubscriptionByUserId(userId);
    if (!subscription) {
      return error(res, 'plan.subscriptionNotFound', 404);
    }
    return success(res, 'plan.subscriptionFetched', { subscription });
  } catch (err) {
    logger.error(`Error fetching subscription: ${err.message}`);
    return error(res, 'common.serverError');
  }
};

/**
 * Subscribe user to a plan
 */
const subscribeUserToPlan = async (userId, planId, res) => {
  try {
    const plan = await planModel.getPlanById(planId);
    if (!plan) {
      return error(res, 'plan.planNotFound', 404);
    }

    const existing = await subscriptionModel.getSubscriptionByUserId(userId);
    if (existing) {
      return error(res, 'plan.alreadySubscribed', 400);
    }

    const subscription = await subscriptionModel.createSubscription(userId, planId);
    if(!subscription){
      return error(res, 'plan.subscriptionFailed', 404);
    }
    return success(res, 'plan.subscribedSuccess', { subscription });
  } catch (err) {
    logger.error(`Subscription error: ${err.message}`);
    return error(res, 'common.serverError');
  }
};

/**
 * Cancel a user subscription
 */
const cancelUserSubscription = async (userId, res) => {
  try {
    const existing = await subscriptionModel.getSubscriptionByUserId(userId);
    if (!existing) {
      return error(res, 'plan.subscriptionNotFound', 404);
    }

    const cancelled = await subscriptionModel.cancelSubscription(userId);
    return success(res, 'plan.subscriptionCancelled', { cancelled });
  } catch (err) {
    logger.error(`Cancel subscription error: ${err.message}`);
    return error(res, 'common.serverError');
  }
};

/**
 * Admin: Get all subscriptions with filters
 */
const getAllSubscriptions = async (filters, res) => {
  try {
    const subscriptions = await subscriptionModel.getAllSubscriptions(filters);
    return success(res, 'plan.subscriptionsFetched', { subscriptions });
  } catch (err) {
    logger.error(`Admin fetch subscriptions error: ${err.message}`);
    return error(res, 'common.serverError');
  }
};

/**
 * Admin: Get all plans
 */
const getAllPlans = async (res) => {
  try {
    const plans = await planModel.getAllPlans();
    return success(res, 'plan.plansFetched', { plans });
  } catch (err) {
    logger.error(`Get all plans error: ${err.message}`);
    return error(res, 'common.serverError');
  }
};

/**
 * Compare two plans
 */
const comparePlans = async (planId1, planId2, res) => {
  try {
    const plan1 = await planModel.getPlanById(planId1);
    const plan2 = await planModel.getPlanById(planId2);

    if (!plan1 || !plan2) {
      return error(res, 'plan.planNotFound', 404);
    }

    return success(res, 'plan.plansCompared', { plan1, plan2 });
  } catch (err) {
    logger.error(`Compare plans error: ${err.message}`);
    return error(res, 'common.serverError');
  }
};

/**
 * Upgrade user's subscription
 */
const upgradeUserSubscription = async (req, newPlanId, res) => {
  try {
    const newPlan = await planModel.getPlanById(newPlanId);
    if (!newPlan) {
      return error(res, 'plan.planNotFound', 404);
    }

    const upgraded = await subscriptionModel.upgradeSubscription(req, newPlanId);
    if(!upgraded){
      return error(res, 'plan.subscriptionFailed', 404);
    }
    return success(res, 'plan.subscriptionUpgraded', { subscription: upgraded });
  } catch (err) {
    logger.error(`Upgrade subscription error: ${err.message}`);
    return error(res, 'common.serverError');
  }
};

module.exports = {
  getSubscriptionByUserId,
  subscribeUserToPlan,
  cancelUserSubscription,
  getAllSubscriptions,
  getAllPlans,
  comparePlans,
  upgradeUserSubscription,
};
