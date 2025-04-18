const Validator = require('validatorjs');
const validationSchema = require('../validation/validationSchema.json');

const extractRouteAndMethod = (path) => {
  const pathParts = path.split('/').filter(Boolean);
  const method = pathParts.pop();
  const route = pathParts.pop();
  return { route, method };
};

const buildValidationRules = (validationRules) => {
  const rules = {};
  if (validationRules.body) {
    Object.keys(validationRules.body).forEach((field) => {
      rules[field] = validationRules.body[field];
    });
  }
  if (validationRules.query) {
    Object.keys(validationRules.query).forEach((field) => {
      rules[field] = validationRules.query[field];
    });
  }
  if (validationRules.headers) {
    Object.keys(validationRules.headers).forEach((field) => {
      rules[field] = validationRules.headers[field];
    });
  }
  return rules;
};

const validate = (req, res, next) => {
  const { route, method } = extractRouteAndMethod(req.path);
  const validationRules = validationSchema[route] && validationSchema[route][method];
  if (!validationRules) {
    return next();
  }

  const data = { ...req.body, ...req.query, ...req.headers, ...req.params };
  const rules = buildValidationRules(validationRules);
  const validation = new Validator(data, rules);

  if (validation.fails()) {
    return res.status(400).json({ errors: validation.errors.all() });
  }

  next();
};

module.exports = validate;
