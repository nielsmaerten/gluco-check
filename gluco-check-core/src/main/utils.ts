/* eslint-disable */

export const flattenDeep = function (arr: any): any[] {
  return Array.isArray(arr)
    ? arr.reduce((a, b) => [...flattenDeep(a), ...flattenDeep(b)], [])
    : [arr];
};

export const intersection = (arr: any[], ...args: any[]) =>
  arr.filter((item: any) => args.every(arr => arr.includes(item)));
