import { isString, isError, isObject, replacer } from "./index.js";

export function toString(value: unknown): string {
  if (isObject(value)) {
    value = JSON.stringify(replacer(value));
  }
  return isString(value) ? value : String(value);
}
export function toError(value: unknown): Error {
  if (isError(value)) {
    return value;
  }
  return new Error(toString(value));
}
