"use strict";

let cache = {};

module.exports = {
  cache(key, result, duration = 1000) {
    cache[key] = { result, duration, cachedAt: Date.now() };
    return result;
  },
  clearCache(key) {
    if (key) delete cache[key];
    else cache = {};
  },
  retrieve(key) {
    const entry = cache[key];
    if (entry) return entry.duration + entry.cachedAt > Date.now() ? entry.result : null;
    return null;
  },
};
