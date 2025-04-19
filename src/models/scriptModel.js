const knex = require('../config/db');

const saveScript = async ({ userId, topic, title, keywords, content, modelUsed, type }) => {
  return knex('scripts')
    .insert({
      user_id: userId,
      topic,
      title,
      keywords,
      content,
      model_used: modelUsed,
      type
    })
    .returning('*')
    .then(rows => rows[0]);
};

const getUserById = async (userId) => {
  return knex('users').where({ id: userId }).first();
};

const countFreeScriptsToday = async (userId) => {
  return knex('scripts')
    .where('user_id', userId)
    .andWhere('type', 'free')
    .andWhereRaw("DATE(created_at) = CURRENT_DATE")
    .count()
    .then(res => parseInt(res[0].count));
};

module.exports = {
  saveScript,
  getUserById,
  countFreeScriptsToday
};
