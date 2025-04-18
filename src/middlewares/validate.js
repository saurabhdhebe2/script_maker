const Validator = require('validatorjs'); // Import validatorjs
const validationSchema = require('../validation/validationSchema.json'); // Centralized validation schema

const validate = (route, method) => {
  return (req, res, next) => {
    const validationRules = validationSchema[route] && validationSchema[route][method];

    if (!validationRules) {
      return next(); 
    }

    const data = { ...req.body, ...req.query, ...req.headers };

    const rules = {};
    const customMessages = {};

    if (validationRules.body) {
      Object.keys(validationRules.body).forEach((field) => {
        const fieldRules = validationRules.body[field];
        rules[field] = fieldRules;
      });
    }

    if (validationRules.query) {
      Object.keys(validationRules.query).forEach((field) => {
        const fieldRules = validationRules.query[field];
        rules[field] = fieldRules;
      });
    }

    if (validationRules.headers) {
      Object.keys(validationRules.headers).forEach((field) => {
        const fieldRules = validationRules.headers[field];
        rules[field] = fieldRules;
      });
    }

    const validation = new Validator(data, rules, customMessages);

    if (validation.fails()) {
      return res.status(400).json({ errors: validation.errors.all() });
    }

    next(); 
  };
};

module.exports = validate;
