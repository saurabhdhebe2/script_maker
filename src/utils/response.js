const messages = require('./responseMessages.json');

const success = (res, key, data = {}, code = 200) => {
  const message = getMessage(key);
  return res.status(code).json({ status: 'success', message, data });
};

const error = (res, key, code = 500, errors = null) => {
  const message = getMessage(key);
  return res.status(code).json({ status: 'error', message, errors });
};

const validationError = (res, errors, key = 'validationFailed', code = 422) => {
  const message = getMessage(key);
  return res.status(code).json({ status: 'fail', message, errors });
};

const getMessage = (key) => {
  const keys = key.split('.');
  let msg = messages;
  for (const k of keys) {
    msg = msg[k];
    if (!msg) return key;
  }
  return msg;
};

module.exports = { success, error, validationError };
