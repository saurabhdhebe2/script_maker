const knex = require('../config/db');

const getAllPlans = async () => {
  return knex('plans').select('*');
};

const getPlanById = async (planId) => {
  return knex('plans').where({ id: planId }).first();
};

module.exports = { getAllPlans, getPlanById };
