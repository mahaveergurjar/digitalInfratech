const test = require('node:test');
const assert = require('node:assert/strict');
const { buildPaginationMeta, paginateModel, parsePagination } = require('../src/utils/pagination');

test('parsePagination applies defaults and clamps the limit', () => {
  assert.deepEqual(parsePagination({}, { defaultLimit: 20, maxLimit: 50 }), {
    page: 1,
    limit: 20,
    skip: 0
  });

  assert.deepEqual(parsePagination({ page: '3', limit: '200' }, { defaultLimit: 20, maxLimit: 50 }), {
    page: 3,
    limit: 50,
    skip: 100
  });
});

test('buildPaginationMeta reports navigation flags correctly', () => {
  assert.deepEqual(buildPaginationMeta(0, 1, 20), {
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPrevPage: false
  });
});

test('paginateModel applies skip, limit, and count', async () => {
  const calls = [];
  const query = {
    select(value) {
      calls.push(['select', value]);
      return this;
    },
    populate(value) {
      calls.push(['populate', value]);
      return this;
    },
    sort(value) {
      calls.push(['sort', value]);
      return this;
    },
    skip(value) {
      calls.push(['skip', value]);
      return this;
    },
    limit(value) {
      calls.push(['limit', value]);
      return Promise.resolve([{ id: 1 }, { id: 2 }]);
    }
  };

  const model = {
    find(filter) {
      calls.push(['find', filter]);
      return query;
    },
    countDocuments(filter) {
      calls.push(['countDocuments', filter]);
      return Promise.resolve(10);
    }
  };

  const result = await paginateModel({
    model,
    filter: { active: true },
    query: { page: '2', limit: '2' },
    sort: { createdAt: -1 },
    select: '-password',
    populate: ['profile']
  });

  assert.deepEqual(result.pagination, {
    page: 2,
    limit: 2,
    total: 10,
    totalPages: 5,
    hasNextPage: true,
    hasPrevPage: true
  });
  assert.deepEqual(result.items, [{ id: 1 }, { id: 2 }]);
  assert.deepEqual(calls, [
    ['find', { active: true }],
    ['select', '-password'],
    ['populate', 'profile'],
    ['sort', { createdAt: -1 }],
    ['countDocuments', { active: true }],
    ['skip', 2],
    ['limit', 2]
  ]);
});
