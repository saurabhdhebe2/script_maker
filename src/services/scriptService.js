const scriptModel = require('../models/scriptModel');
const { generateScriptFromOpenAI } = require('../utils/openAi');
const { generateScriptFromOpenRouter } = require('../utils/openRouter');
const logger = require('../config/logger');
const { error, success } = require('../utils/response');
const subscriptionModel = require('../models/subscriptionModel');
const planModel = require('../models/planModel');

const generateScript = async ({ userId, topic, title, keywords, length, category, time, res }) => {
  try {
    const user = await scriptModel.getUserById(userId);
    if (!user) {
      return error(res, 'user.userNotFound', 404);
    }

    const subscription = await subscriptionModel.getSubscriptionByUserId(userId);
    if (!subscription) {
      return error(res, 'subscription.noActiveSubscription', 400);
    }

    const plan = await planModel.getPlanById(subscription.plan_id);
    const isPremium = plan && (plan.name === 'Pro' || plan.name === 'Ultimate');

    if (!isPremium) {
      const count = await scriptModel.countFreeScriptsToday(userId);
      if (count >= 3) {
        return error(res, 'script.dailyLimitReached', 403);
      }
    }

    const adjustedLength = isPremium ? length : Math.min(length, 500);

    let content = await generateScriptFromOpenAI(topic, adjustedLength, category, time);
    if (!content) {
      content = await generateScriptFromOpenRouter(topic, adjustedLength, category, time);
    }

    if (!content) {
      return error(res, 'script.scriptGenerationError', 500);
    }

    const savedScript = await scriptModel.saveScript({
      userId,
      topic,
      title: title || topic,
      keywords: keywords || [],
      content,
      modelUsed: content.includes('Claude') ? 'OpenRouter' : 'OpenAI',
      type: isPremium ? 'premium' : 'free',
    });

    logger.info(`Script generated for user ${userId}`);
    savedScript.adjustedLength = adjustedLength;
    return success(res, 'script.scriptGenerated', { script: savedScript });
  } catch (err) {
    logger.error(`Error generating script: ${err.message}`);
    return error(res, 'common.serverError');
  }
};

module.exports = {
  generateScript
};
