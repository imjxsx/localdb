export function isString(arg: unknown): arg is string {
  return typeof arg === "string";
}
export function isNumber(arg: unknown): arg is number {
  return typeof arg === "number" && !isNaN(arg);
}
export function isBoolean(arg: unknown): arg is boolean {
  return typeof arg === "boolean";
}
export function isBigInt(arg: unknown): arg is BigInt {
  return typeof arg === "bigint";
}
export function isRegExp(arg: unknown): arg is RegExp {
  return arg instanceof RegExp;
}
export function isObject(arg: unknown): arg is object {
  return typeof arg === "object" && arg !== null;
}
export function isArray(arg: unknown): arg is unknown[] {
  return Array.isArray(arg);
}
export function isBuffer(arg: unknown): arg is Buffer {
  return Buffer.isBuffer(arg);
}
export function isTypedArray(arg: unknown): arg is ArrayBufferView {
  return ArrayBuffer.isView(arg) && !(arg instanceof DataView);
}
export function isDate(arg: unknown): arg is Date {
  return arg instanceof Date;
}
export function isMap(arg: unknown): arg is Map<PropertyKey, unknown> {
  return arg instanceof Map;
}
export function isSet(arg: unknown): arg is Set<unknown> {
  return arg instanceof Set;
}
export function isURL(arg: unknown): arg is URL {
  return arg instanceof URL;
}
export function isError(arg: unknown): arg is Error {
  return arg instanceof Error;
}