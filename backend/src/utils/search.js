function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function normalizeSearchQuery(value, { maxLength = 100 } = {}) {
  const trimmed = String(value || '').trim();

  if (!trimmed) {
    return '';
  }

  return escapeRegExp(trimmed.slice(0, maxLength));
}

function buildSearchRegex(value, options = {}) {
  const pattern = normalizeSearchQuery(value, options);

  if (!pattern) {
    return null;
  }

  return new RegExp(pattern, 'i');
}

module.exports = {
  buildSearchRegex,
  escapeRegExp,
  normalizeSearchQuery
};
