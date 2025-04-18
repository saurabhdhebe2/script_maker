const express = require('express');
const router = express.Router();
const planSubscriptionController = require('../controllers/planSubscriptionController');

// User Routes
router.get('/my-subscription', planSubscriptionController.getMySubscription);
router.post('/subscribe', planSubscriptionController.subscribeToPlan); 
router.post('/cancel', planSubscriptionController.cancelSubscription);

// Admin Routes
router.get('/subscriptions', planSubscriptionController.getAllSubscriptions); 
router.get('/plans', planSubscriptionController.getAllPlans);
router.get('/compare-plans', planSubscriptionController.comparePlans); 

// Upgrade a user's subscription
router.post('/upgrade', planSubscriptionController.upgradeSubscription);

module.exports = router;
