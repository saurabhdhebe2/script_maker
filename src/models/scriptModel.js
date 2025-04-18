const knex = require('../config/db');

// Save script to database
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

// Get user by ID
const getUserById = async (userId) => {
  return knex('users').where({ id: userId }).first();
};

module.exports = {
  saveScript,
  getUserById
};
