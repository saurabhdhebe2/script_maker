const scriptModel = require('../models/scriptModel');
const { generateScriptFromOpenAI } = require('../utils/openAi');
const { generateScriptFromOpenRouter } = require('../utils/openRouter');
const logger = require('../config/logger');
const { error, success } = require('../utils/response');
const subscriptionModel = require('../models/subscriptionModel');
const planModel = require('../models/planModel');

/**
 * Business logic for generating script
 */
const generateScript = async ({ userId, topic, title, keywords, scriptLength, res }) => {
  try {
    // Fetch user details
    const user = await scriptModel.getUserById(userId);
    if (!user) {
      return error(res, 'user.userNotFound', 404);
    }

    // Get the user's active plan
    const subscription = await subscriptionModel.getSubscriptionByUserId(userId);
    if (!subscription) {
      return error(res, 'subscription.noActiveSubscription', 400);
    }

    // Determine if user is premium or free
    const plan = await planModel.getPlanById(subscription.plan_id);
    const isPremium = plan && (plan.name === 'Pro' || plan.name === 'Ultimate');
    const adjustedLength = isPremium ? scriptLength : Math.min(scriptLength, 500); // Limit for free users

    // Select the model based on the user's plan access
    // const modelAccess = plan.model_access || ['gpt-3.5']; // Default to GPT-3.5 for free users
    let content;

    // Try generating script using OpenAI first
    // if (modelAccess.includes('gpt-3.5')) {
      content = await generateScriptFromOpenAI(topic, adjustedLength);
    // }

    // Fallback to OpenRouter if OpenAI fails or model is not available
    if (!content /* && modelAccess.includes('gpt-4')*/) {
      content = await generateScriptFromOpenRouter(topic, adjustedLength);
    }

    // If no content generated, return an error
    if (!content) {
      return error(res, 'script.scriptGenerationError', 500);
    }

    // Save the generated script to the database
    const savedScript = await scriptModel.saveScript({
      userId,
      topic,
      title: title || topic,
      keywords: keywords || [],
      content,
      modelUsed: content.includes('Claude') ? 'OpenRouter' : 'OpenAI',
      type: isPremium ? 'premium' : 'free',
    });

    savedScript.adjustedLength = adjustedLength;

    // Log successful script generation
    logger.info(`Script generated and saved for user ${userId}`);

    // Return the generated script in the response
    return success(res, 'script.scriptGenerated', { script: savedScript });

  } catch (err) {
    logger.error(`Error generating script for user ${userId}: ${err.message}`);
    return error(res, 'common.serverError');
  }
};

module.exports = {
  generateScript,
};
