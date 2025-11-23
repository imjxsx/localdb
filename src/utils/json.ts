import { isObject, isArray, isString, isNumber, isBigInt, isRegExp, isBuffer, isDate, isMap, isSet, isURL, isBoolean, isTypedArray } from "./index.js";

export function reviver(object: unknown): unknown {
  if (object === null || object === undefined) {
    return object;
  }
  if (isArray(object)) {
    return object.map((v) => (reviver(v)));
  }
  if (isObject(object)) {
    if ("__type" in object && object.__type) {
      if (object.__type === "BigInt" && "int" in object && isString(object.int)) {
        return BigInt(object.int);
      }
      if (object.__type === "RegExp" && "source" in object && isString(object.source)) {
        return new RegExp(object.source, "flags" in object && isString(object.flags) ? object.flags : undefined);
      }
      if (object.__type === "Buffer" && "base64" in object && isString(object.base64)) {
        return Buffer.from(object.base64, "base64");
      }
      if (object.__type === "Date" && "iso" in object && isString(object.iso)) {
        return new Date(object.iso);
      }
      if (object.__type === "Map" && "entries" in object && isArray(object.entries)) {
        return new Map((object.entries as [string, unknown][]).map(([key, value]) => ([key, reviver(value)])));
      }
      if (object.__type === "Set" && "values" in object && isArray(object.values)) {
        return new Set(object.values.map((v) => (reviver(v))));
      }
      if (object.__type === "URL" && "href" in object && isString(object.href)) {
        return new URL(object.href);
      }
      if (object.__type === "Infinity") {
        return Infinity;
      }
      if (object.__type === "-Infinity") {
        return -Infinity;
      }
      if (object.__type === "NaN") {
        return NaN;
      }
    }
    else {
      const result: Record<PropertyKey, unknown> = {};
      for (const [key, value] of Object.entries(object)) {
        result[key] = reviver(value);
      }
      return result;
    }
  }
  return object;
}
export function replacer(object: unknown): unknown {
  if (object === null || object === undefined) {
    return object;
  }
  if (isString(object)) {
    return object;
  }
  if (isBoolean(object)) {
    return object;
  }
  if (isNumber(object)) {
    if (isNaN(object)) {
      return { __type: "NaN" };
    }
    if (object === Infinity) {
      return { __type: "Infinity" };
    }
    if (object === -Infinity) {
      return { __type: "-Infinity" };
    }
    return object;
  }
  if (isBigInt(object)) {
    return { __type: "BigInt", int: object.toString() };
  }
  if (isRegExp(object)) {
    return { __type: "RegExp", source: object.source, flags: object.flags };
  }
  if (isBuffer(object)) {
    return { __type: "Buffer", base64: object.toString("base64") };
  }
  if (isDate(object)) {
    return { __type: "Date", iso: object.toISOString() };
  }
  if (isMap(object)) {
    return {
      __type: "Map",
      entries: Array.from(object.entries()).map(([key, value]) => ([key, replacer(value)]))
    };
  }
  if (isSet(object)) {
    return {
      __type: "Set",
      values: Array.from(object.values()).map((v) => replacer(v))
    };
  }
  if (isURL(object)) {
    return { __type: "URL", href: object.href };
  }
  if (isArray(object)) {
    return object.map((v) => replacer(v));
  }
  if (isObject(object) && !isTypedArray(object)) {
    const result: Record<PropertyKey, unknown> = {};
    for (const [key, value] of Object.entries(object)) {
      result[key] = replacer(value);
    }
    return result;
  }
  return {
    __type: "Unsupported",
    name: object.constructor?.name || typeof object,
  };
}
