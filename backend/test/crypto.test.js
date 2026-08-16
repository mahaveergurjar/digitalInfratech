const test = require('node:test');
const assert = require('node:assert/strict');
const { addMinutes, generateOtp, hashValue, randomToken } = require('../src/utils/crypto');

test('hashValue returns a deterministic SHA-256 hash', () => {
  assert.equal(hashValue('abc123'), hashValue('abc123'));
  assert.notEqual(hashValue('abc123'), hashValue('abc124'));
});

test('randomToken returns a hex token of the requested size', () => {
  const token = randomToken(16);
  assert.equal(token.length, 32);
});

test('generateOtp returns a six-digit code by default', () => {
  const code = generateOtp();
  assert.match(code, /^\d{6}$/);
});

test('addMinutes offsets a date by the expected duration', () => {
  const start = new Date('2026-01-01T00:00:00.000Z');
  const result = addMinutes(start, 10);
  assert.equal(result.toISOString(), '2026-01-01T00:10:00.000Z');
});
