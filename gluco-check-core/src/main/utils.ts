/* eslint-disable @typescript-eslint/no-explicit-any */
import {createHash} from 'crypto';
import {URL} from 'url';

export const flattenDeep = function (arr: any): any[] {
  return Array.isArray(arr)
    ? arr.reduce((a, b) => [...flattenDeep(a), ...flattenDeep(b)], [])
    : [arr];
};

export const intersection = (arr: any[], ...args: any[]) =>
  arr.filter((item: any) => args.every(arr => arr.includes(item)));

export const isValidUrl = (url: string) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const sha1 = (input: string) => {
  const hash = createHash('sha1');
  hash.update(input);
  return hash.digest('hex');
};

/**
 * Source:
 * https://semver.org/#is-there-a-suggested-regular-expression-regex-to-check-a-semver-string
 */
export const isSemanticVersion = (input: string) => {
  const regex = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/gm;
  return regex.test(input);
};
