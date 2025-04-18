const scriptService = require('../services/scriptService');
const { success, error } = require('../utils/response');

/**
 * Generate a script
 */
const generateScript = async (req, res, next) => {
  try {
    const { topic, scriptLength, title, keywords } = req.body;
    const userId = req.user.id;

    if (!topic || !scriptLength) {
      return error(res, 'common.missingFields', 400);
    }

    const script = await scriptService.generateScript({
      userId,
      topic,
      title,
      keywords,
      scriptLength,
      res
    });

    if (!script) {
      return error(res, 'script.scriptGenerationError');
    }

    return success(res, 'script.scriptGenerated', { script });
  } catch (err) {
    if (err.message === 'User not found') {
      return error(res, 'auth.userNotFound', 404);
    }
    return error(res, 'script.scriptGenerationError');
  }
};

module.exports = {
  generateScript,
};
