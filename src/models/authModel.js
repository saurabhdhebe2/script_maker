const knex = require('../config/db');

const findUserByEmail = (email) => {
  return knex('users').where({ email }).first();
};

const createUser = (userData) => {
  return knex('users').insert(userData).returning('*');
};

const updateUser = (id, updates) => {
  return knex('users').where({ id }).update(updates).returning('*');
};

const findUserById = (id) => {
  return knex('users').where({ id }).first();
};

module.exports = {
  findUserByEmail,
  createUser,
  updateUser,
  findUserById,
};
