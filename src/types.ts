import { Buffer } from "buffer";
export interface IAs {
  /**
   * Converts the input to an array.
   * @param item - The item to convert.
   * @returns The converted array.
   */
  array(item: any): any[];

  /**
   * Converts the input to an asynchronous function.
   * @param fn - The function to convert.
   * @returns The converted asynchronous function.
   */
  asyncFn(fn: string | Function): () => Promise<void>;

  /**
   * Converts the input to a boolean.
   * @param item - The item to convert.
   * @returns The converted boolean.
   */
  boolean(item: any): boolean;

  /**
   * Converts a dash-case string to camelCase.
   * @param str - The string to convert.
   * @returns The converted string.
   */
  camelcase(str: string): string;

  /**
   * Converts a camelCase string to dash-case.
   * @param str - The string to convert.
   * @returns The converted string.
   */
  dashCase(str?: string): string;

  /**
   * Converts the input to a Date object.
   * @param item - The item to convert.
   * @returns The converted Date object.
   */
  datetime(item: any): Date | null;

  /**
   * Generates a unique ID.
   * @param item - The item to generate an ID for.
   * @returns The generated ID.
   */
  id(item?: any): string;

  /**
   * Converts the input to an integer.
   * @param val - The value to convert.
   * @returns The converted integer.
   */
  integer(val: any): number;

  /**
   * Parses a JSON string.
   * @param str - The JSON string to parse.
   * @param options - The options for parsing.
   * @returns The parsed object.
   */
  json(str: string, options: { params?: object; continue?: boolean }): any;

  /**
   * Converts the input to a number.
   * @param val - The value to convert.
   * @param digit - The number of digits to round to.
   * @param min - The minimum value.
   * @param max - The maximum value.
   * @returns The converted number.
   */
  number(val: any, digit?: number, min?: number, max?: number): number;

  /**
   * Converts the input to an object.
   * @param src - The source to convert.
   * @returns The converted object.
   */
  object(src: any): object;

  /**
   * Converts the input to a string.
   * @param item - The item to convert.
   * @returns The converted string.
   */
  string(item: any): string;

  /**
   * Converts the input to a JSON string.
   * @param input - The input to convert.
   * @param options - The options for conversion.
   * @param startTab - The starting tab level.
   * @returns The converted JSON string.
   */
  stringified(
    input: any,
    options: {
      uglify?: boolean;
      includeEmpty?: boolean;
      excludePrivate?: boolean;
    },
    startTab: number
  ): string;

  /**
   * Capitalizes the first letter of a string.
   * @param str - The string to capitalize.
   * @returns The capitalized string.
   */
  capitalFirst(str: string): string;

  /**
   * Converts a camelCase string to title case.
   * @param str - The string to convert.
   * @returns The converted string.
   */
  titlecase(str: string): string;

  /**
   * Converts a string to an enum value.
   * @param value - The string to convert.
   * @param enumObject - The enum object.
   * @returns The converted enum value.
   */
  enum<T extends object>(value: string, enumObject: T): T[keyof T];
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
  groupBy<T>(
    items: any,
    prop: string | Function
  ): { _id: string; children: T[] }[];
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
  sortNumeric(
    items: any,
    property: string | Function,
    descending?: boolean
  ): any[];
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
export interface IBus {
  /**
   * Registers a handler function to be called for any event.
   *
   * @param handler - The function to be called for any event. Must be a valid function.
   * @returns A function that, when called, will remove the handler from the list of any-event handlers.
   * @throws {Error} If the provided handler is not a function.
   */
  onAny(handler: Function): Function;

  /**
   * Registers an event handler for a specific event.
   *
   * @param evt - The name of the event to listen for.
   * @param handler - The function to be called when the event is emitted.
   * @returns A function that, when called, will remove the event handler.
   * @throws Will throw an error if the handler is not a function.
   */
  on(evt: string, handler: Function): Function;

  /**
   * Asynchronously emits an event to all registered handlers.
   *
   * @param evt - The name of the event to emit.
   * @param args - Additional arguments to pass to the event handlers.
   * @returns A promise that resolves when all handlers have been executed.
   */
  emitAsync(evt: string, ...args: any[]): Promise<void>;
}
