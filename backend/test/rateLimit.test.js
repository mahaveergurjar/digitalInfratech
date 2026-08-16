const test = require('node:test');
const assert = require('node:assert/strict');
const createRateLimit = require('../src/middlewares/rateLimit.middleware');

function buildReqRes({ ip = '127.0.0.1', path = '/api/auth/login', body = {} } = {}) {
  const req = { ip, path, baseUrl: '', body };
  const res = {
    headers: {},
    statusCode: 200,
    set(name, value) {
      this.headers[name] = value;
    },
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.payload = payload;
      return this;
    }
  };

  return { req, res };
}

test('rate limit middleware allows requests until the max is reached', () => {
  const limiter = createRateLimit({
    windowMs: 60_000,
    max: 2,
    keyGenerator: (req) => `${req.ip}:${req.path}`
  });

  const first = buildReqRes();
  const second = buildReqRes();
  let nextCount = 0;

  limiter(first.req, first.res, () => { nextCount += 1; });
  limiter(second.req, second.res, () => { nextCount += 1; });

  assert.equal(nextCount, 2);
  assert.equal(first.res.statusCode, 200);
  assert.equal(second.res.statusCode, 200);
});

test('rate limit middleware blocks requests after the max is exceeded', () => {
  const limiter = createRateLimit({
    windowMs: 60_000,
    max: 1,
    keyGenerator: (req) => `${req.ip}:${req.path}`,
    message: 'Too many requests'
  });

  const first = buildReqRes({ path: '/api/auth/forgot-password' });
  const second = buildReqRes({ path: '/api/auth/forgot-password' });
  let nextCount = 0;

  limiter(first.req, first.res, () => { nextCount += 1; });
  limiter(second.req, second.res, () => { nextCount += 1; });

  assert.equal(nextCount, 1);
  assert.equal(second.res.statusCode, 429);
  assert.equal(second.res.payload.error, 'Too many requests');
  assert.match(second.res.headers['Retry-After'], /^\d+$/);
});
