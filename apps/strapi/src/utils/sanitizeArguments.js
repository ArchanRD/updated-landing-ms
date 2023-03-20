function sanitizeArgs(o) {
    const factorySet = new Set([
      "and",
      "or",
      "not",
      "not",
      "eq",
      "eqi",
      "ne",
      "in",
      "notIn",
      "lt",
      "lte",
      "gt",
      "gte",
      "between",
      "contains",
      "notContains",
      "containsi",
      "notContainsi",
      "startsWith",
      "endsWith",
      "null",
      "notNull",
    ]);
    var build, key, destKey, value;
    if (o === null || typeof o !== "object") {
      return o;
    }
    if (Array.isArray(o)) {
      return o.map(sanitizeArgs);
    }
    build = {};

    for (key in o) {
      destKey = factorySet.has(key) ? "$" + key : key;
      value = o[key];
      // If this is an object, recurse
      if (typeof value === "object") {
        value = sanitizeArgs(value);
      }
      build[destKey] = value;
    }
    return build;
  }
  module.exports = {sanitizeArgs};