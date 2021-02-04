/* eslint-disable */
import { URL } from "url";

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
}