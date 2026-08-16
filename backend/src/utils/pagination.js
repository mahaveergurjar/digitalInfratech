function parsePositiveInteger(value, fallback) {
  const parsed = Number.parseInt(String(value), 10);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}

function parsePagination(query = {}, { defaultLimit = 20, maxLimit = 50 } = {}) {
  const page = parsePositiveInteger(query.page, 1);
  const requestedLimit = parsePositiveInteger(query.limit, defaultLimit);
  const limit = Math.min(requestedLimit, maxLimit);
  const skip = (page - 1) * limit;

  return {
    page,
    limit,
    skip
  };
}

function buildPaginationMeta(total, page, limit) {
  const totalPages = total > 0 ? Math.ceil(total / limit) : 0;

  return {
    page,
    limit,
    total,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1
  };
}

async function paginateModel({
  model,
  filter = {},
  query = {},
  defaultLimit = 20,
  maxLimit = 50,
  sort = { createdAt: -1 },
  select = null,
  populate = []
}) {
  const { page, limit, skip } = parsePagination(query, { defaultLimit, maxLimit });

  let dbQuery = model.find(filter);

  if (select) {
    dbQuery = dbQuery.select(select);
  }

  const population = Array.isArray(populate) ? populate : [populate];
  for (const entry of population.filter(Boolean)) {
    dbQuery = dbQuery.populate(entry);
  }

  if (sort) {
    dbQuery = dbQuery.sort(sort);
  }

  const [total, items] = await Promise.all([
    model.countDocuments(filter),
    dbQuery.skip(skip).limit(limit)
  ]);

  return {
    items,
    pagination: buildPaginationMeta(total, page, limit)
  };
}

module.exports = {
  buildPaginationMeta,
  paginateModel,
  parsePagination,
  parsePositiveInteger
};
