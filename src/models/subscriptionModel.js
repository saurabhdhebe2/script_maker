const knex = require('../config/db');

const getSubscriptionByUserId = async (userId) => {
  return knex('subscriptions').select('subscriptions.*','plans.name as plan','plans.description as description')
  .join('users', 'subscriptions.user_id', '=', 'users.id')
  .join('plans', 'subscriptions.plan_id', '=', 'plans.id')
  .where('subscriptions.user_id', userId ).first();
};

const createSubscription = async (userId, planId) => {
  const trx = await knex.transaction();
  try {
    await trx('subscriptions').insert({ user_id: userId, plan_id: planId }).returning('*');
    const role = await trx('plans').select('name').where('id', planId).first();
    const update = await trx('users').where('id', userId).update({ role: role?.name }).returning('*');
    await trx.commit();
    return update;
  } catch (err) {
    await trx.rollback();
    return null
  }
};

const cancelSubscription = async (userId) => {
  const trx = await knex.transaction();
  try {
    let planId = await knex('plans').where('name','Free').select('id').first()
    await knex('subscriptions').where({ user_id: userId }).update({ is_active: false,plan_id:planId.id }).returning('*');
    const update = await trx('users').where('id', userId).update({ role: 'Free' }).returning('*');
    await trx.commit();
    return update;
  } catch (err) {
    await trx.rollback();
    return null
  }
};


const getAllSubscriptions = async (filters) => {
  const query = knex('subscriptions')
    .join('users', 'subscriptions.user_id', '=', 'users.id')
    .join('plans', 'subscriptions.plan_id', '=', 'plans.id');

  if (filters.role) {
    query.where('users.role', filters.role);
  }
  if (filters.plan) {
    query.where('plans.id', filters.plan);
  }
  if (filters.startDate) {
    query.where('subscriptions.start_date', '>=', filters.startDate);
  }
  if (filters.endDate) {
    query.where('subscriptions.end_date', '<=', filters.endDate);
  }

  return query.select('subscriptions.*', 'users.username', 'plans.name');
};

const upgradeSubscription = async (req, newPlanId) => {
    const trx = await knex.transaction();
    try {
      await knex('subscriptions')
      .where({ user_id: req.user.id })
      .update({ plan_id: newPlanId, is_active:true })
      .returning('*');
      const role = await trx('plans').select('name').where('id', newPlanId).first();
      const update = await trx('users').where('id', req.user.id).update({ role: role?.name }).returning('*');
      await trx.commit();
      return update;
    } catch (err) {
      await trx.rollback();
      return null
    }
};

module.exports = {
  getSubscriptionByUserId,
  createSubscription,
  cancelSubscription,
  getAllSubscriptions,
  upgradeSubscription,
};
