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
  const sections = ['body', 'query', 'params', 'headers'];

  sections.forEach((section) => {
    const fields = validationRules[section];
    if (fields && typeof fields === 'object') {
      Object.assign(rules, fields);
    }
  });

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
    return res.status(400).json({status:false, errors: validation.errors.all() });
  }

  next();
};

module.exports = validate;
