const test = require('node:test');
const assert = require('node:assert/strict');
const { buildSearchRegex, escapeRegExp, normalizeSearchQuery } = require('../src/utils/search');

test('escapeRegExp neutralizes regex metacharacters', () => {
  assert.equal(escapeRegExp('a+b(c)[d]'), 'a\\+b\\(c\\)\\[d\\]');
  assert.equal(escapeRegExp('hello.*world?'), 'hello\\.\\*world\\?');
});

test('normalizeSearchQuery trims and caps search length', () => {
  assert.equal(normalizeSearchQuery('   abc   '), 'abc');
  assert.equal(normalizeSearchQuery('x'.repeat(120), { maxLength: 10 }), 'xxxxxxxxxx');
});

test('buildSearchRegex returns a safe case-insensitive regex', () => {
  const regex = buildSearchRegex('foo.bar');
  assert.ok(regex instanceof RegExp);
  assert.equal(regex.source, 'foo\\.bar');
  assert.equal(regex.flags.includes('i'), true);
});

test('buildSearchRegex returns null for empty input', () => {
  assert.equal(buildSearchRegex('   '), null);
});
