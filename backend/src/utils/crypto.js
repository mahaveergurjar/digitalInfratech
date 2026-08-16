const crypto = require('crypto');

function hashValue(value) {
  return crypto.createHash('sha256').update(String(value)).digest('hex');
}

function randomToken(size = 32) {
  return crypto.randomBytes(size).toString('hex');
}

function generateOtp(length = 6) {
  const min = 10 ** (length - 1);
  const max = (10 ** length) - 1;
  return String(crypto.randomInt(min, max + 1));
}

function addMinutes(date, minutes) {
  return new Date(date.getTime() + minutes * 60 * 1000);
}

module.exports = {
  addMinutes,
  generateOtp,
  hashValue,
  randomToken
};
