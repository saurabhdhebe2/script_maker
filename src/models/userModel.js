const knex = require('../config/db');

// Create a new user
const createUser = async (userData) => {
  return knex('users').insert(userData).returning('*');
};

// Find user by email
const findUserByEmail = async (email) => {
  return knex('users').where({ email }).first();
};

// Find user by ID
const findUserById = async (id) => {
  return knex('users').where({ id }).first();
};

// Update user details
const updateUser = async (id, userData) => {
  return knex('users').where({ id }).update(userData).returning('*');
};

// Delete user
const deleteUser = async (id) => {
  return knex('users').where({ id }).del();
};

module.exports = { createUser, findUserByEmail, findUserById, updateUser, deleteUser };
