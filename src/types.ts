import { Buffer } from 'buffer';
export interface IAs {
  array(item: any): any[];
  asyncFn(fn: string | Function): () => Promise<void>;
  boolean(item: any): boolean;
  camelcase(str: string): string;
  dashCase(str?: string): string;
  datetime(item: any): Date | null;
  id(item?: any): string;
  integer(val: any): number;
  json(str: string, options: { params?: object; continue?: boolean }): any;
  number(val: any, digit?: number, min?: number, max?: number): number;
  object(src: any): object;
  string(item: any): string;
  stringified(
    input: any,
    options: { uglify?: boolean; includeEmpty?: boolean; excludePrivate?: boolean },
    startTab: number
  ): string;
  capitalFirst(str: string): string;
  titlecase(str: string): string;
}
export interface IIs {
    array(item: any, path?: string): boolean;
    boolean(item: any, path?: string): boolean;
    empty(item: any, path?: string): boolean;
    function(item: any, path?: string): boolean;
    id(val: any, path?: string): boolean;
    ip(val: any, path?: string): boolean;
    date(val: any, path?: string): boolean;
    image(item: any, path?: string): boolean;
    integer(val: any, path?: string): boolean;
    money(item: any, path?: string): boolean;
    nil(item: any, path?: string): boolean;
    number(value: any, path?: string): boolean;
    object(A: any, path?: string): boolean;
    /* TODO: add the missing return type */
    primitive(obj: any, path?: string): any;
    string(val: any, path?: string): boolean;
    alphaNumeric(val: any, path?: string): boolean;
    creditCard(val: any, path?: string): boolean;
    dateString(val: any, path?: string): boolean;
    email(val: any, path?: string): boolean;
    eppPhone(val: any, path?: string): boolean;
    hexadecimal(val: any, path?: string): boolean;
    hexColor(val: any, path?: string): boolean;
    ipv4(val: any, path?: string): boolean;
    ipv6(val: any, path?: string): boolean;
    nanpPhone(val: any, path?: string): boolean;
    timeString(val: any, path?: string): boolean;
    url(val: any, path?: string): boolean;
}
export interface ITree {
  deepIncludes(children: any, item: any): boolean;
  findNode(tree: any, fn: Function): any;
  getNodePath(tree: any, fn: Function): any[];
  filter(tree: any, fn: Function): any[];
  /* TODO: add the missing return type */
  toNodeMap(tree: any): any;
  /* TODO: add the missing return type */
  getNodes(tree: any): any;
}
export interface IUtility {
  any(items: any, filter?: Function): boolean;
  as: IAs;
  changeIndex(arr: any, oldindex: number, newindex: number): void;
  clone(obj: any): any;
  combineUrl(base: string, relative: string): string;
  debounce(fn: Function, timeout: number): any;
  distinct(items: any): any[];
  echoFn(): (val: any) => any;
  emptyAsyncFn(): void;
  emptyFn(): void;
  equals(a: any, b: any): boolean;
  extend(out: any, ...args: any[]): any;
  findById(list: any, id: string): any;
  first(items: any, filter?: (item: any) => boolean): any;
  get(obj: any, path?: string): any;
  getId(item: any): string | void;
  groupBy(items: any, prop: string | Function): { _id: string; children: [] }[];
  hasAllFields(value: { [key: string]: any }, fields: string[]): boolean;
  hasProperty(obj: { [key: string]: any }, path: string): boolean;
  includes(list: any, item: any): boolean;
  indexOf(list: any, item: any): number;
  is: IIs;
  jwtDecode(token: string): any;
  last(items: any): any;
  random(min: number, max: number, digit: number): number;
  remove(list: any, item: any): void;
  removeAccents(str: string): string;
  replaceBy(list: any, newItem: any, oldItem?: any): any[];
  seperate(str: string, seperator: string): string[];
  set(obj: { [key: string]: any }, path: string, value: any): void;
  sizeOf(items: any): number;
  skip(items: any, length: number): any[];
  sort(items: any, property: string | Function, descending?: boolean): void;
  sortNumeric(items: any, property: string | Function, descending?: boolean): any[];
  take(items: any, length: number): any[];
  throttle(fn: Function, timeout: number): any;
  toMap(items: any): Map<any, any>;
  toSet(items: any): Set<any>;
  tree: ITree;
  trimBefore(str: string, trimSep: string): string;
  trimLeft(str: string, trimSep: string): string;
  trimRight(str: string, trimSep: string): string;
  trimThen(str: string, trimSep: string): string;
  trueFn(): Function;
  waitAsync(timeout: number): Promise<void>;
}