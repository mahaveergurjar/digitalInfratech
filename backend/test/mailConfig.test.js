const test = require('node:test');
const assert = require('node:assert/strict');
const { normalizeMailProvider } = require('../src/config/env');

test('normalizeMailProvider maps common Brevo aliases', () => {
  assert.equal(normalizeMailProvider('brevo'), 'brevo');
  assert.equal(normalizeMailProvider('bravo'), 'brevo');
  assert.equal(normalizeMailProvider('BREVO'), 'brevo');
});

test('normalizeMailProvider keeps supported provider names intact', () => {
  assert.equal(normalizeMailProvider('smtp'), 'smtp');
  assert.equal(normalizeMailProvider('zeptomail'), 'zeptomail');
});
