import { IUtility, IAs } from "./types";
import { nanoid } from "nanoid";
export default class As implements IAs {
  private readonly $u: IUtility;
  constructor(util: IUtility) {
    this.$u = util;
  }

  /**
   * Converts the input to an array.
   * @param item - The item to convert.
   * @returns The converted array.
   */
  array(item: any): any[] {
    if (this.$u.is.nil(item)) return [];
    return this.$u.is.array(item) ? item : [item];
  }

  /**
   * Converts the input to an asynchronous function.
   * @param fn - The function to convert.
   * @returns The converted asynchronous function.
   */
  asyncFn(fn: string | Function): () => Promise<void> {
    if (!this.$u.is.function(fn)) return async function () {};
    if (fn.constructor.name === "AsyncFunction")
      return fn as () => Promise<void>;
    return async function () {
      return (fn as Function)(...arguments);
    };
  }

  /**
   * Converts the input to a boolean.
   * @param item - The item to convert.
   * @returns The converted boolean.
   */
  boolean(item: any): boolean {
    return !!item;
  }

  /**
   * Converts a dash-case string to camelCase.
   * @param str - The string to convert.
   * @returns The converted string.
   */
  camelcase(str: string): string {
    return str.replace(/-([a-z])/g, function (g) {
      return g[1].toUpperCase();
    });
  }

  /**
   * Converts a camelCase string to dash-case.
   * @param str - The string to convert.
   * @returns The converted string.
   */
  dashCase(str?: string): string {
    if (!this.$u.is.string(str)) {
      return "";
    }
    return (str as string).replace(/([a-zA-Z])(?=[A-Z])/g, "$1-").toLowerCase();
  }

  /**
   * Converts the input to a Date object.
   * @param item - The item to convert.
   * @returns The converted Date object.
   */
  datetime(item: any): Date | null {
    if (!this.$u.is.date(item)) return new Date();
    if (item instanceof Date) return item;
    if (this.$u.is.dateString(item)) return new Date(item);
    return new Date();
  }

  /**
   * Converts a string to an enum value.
   * @param value - The string to convert.
   * @param defaultValue - The default enum value.
   * @returns The converted enum value.
   */
  enum<T extends Record<string, string | number>>(
    value: string,
    defaultValue: T[keyof T]
  ): T[keyof T] {
    const enumValues = Object.values(defaultValue as unknown as T);
    return enumValues.includes(value as T[keyof T])
      ? (value as T[keyof T])
      : defaultValue;
  }

  /**
   * Generates a unique ID.
   * @param item - The item to generate an ID for.
   * @returns The generated ID.
   */
  id(item?: any): string {
    if (this.$u.is.empty(item)) return nanoid();
    if (this.$u.is.id(item)) return item;
    if (this.$u.is.number(item)) {
      return item.toString();
    } else if (this.$u.is.object(item)) {
      const itemId = this.string(item._id) || this.string(item.id);
      return this.$u.is.empty(itemId) ? nanoid() : itemId;
    }
    return nanoid();
  }

  /**
   * Converts the input to an integer.
   * @param val - The value to convert.
   * @returns The converted integer.
   */
  integer(val: any): number {
    const result = this.number(val) || 0;
    return Math.round(result);
  }

  /**
   * Parses a JSON string.
   * @param str - The JSON string to parse.
   * @param options - The options for parsing.
   * @returns The parsed object.
   */
  json(
    str: string,
    options: { params?: object; continue?: boolean } = { continue: false }
  ) {
    if (!str) return str;
    try {
      str = "return " + str;
      if (!options.params) {
        return new Function(str)();
      } else {
        const paramKeys = Object.values(options.params);
        const paramValues = Object.values(options.params);
        return new Function(...paramKeys, str)(...paramValues);
      }
    } catch (e) {
      if (!options.continue) throw e;
    }
  }

  /**
   * Converts the input to a number.
   * @param val - The value to convert.
   * @param digit - The number of digits to round to.
   * @param min - The minimum value.
   * @param max - The maximum value.
   * @returns The converted number.
   */
  number(val: any, digit?: number, min?: number, max?: number): number {
    if (val === true) val = 1;
    else if (val === false) val = 0;
    var result = parseFloat(val);
    result = Number.isNaN(result) ? 0 : result;
    if (this.$u.is.number(min) && result < (min as number)) {
      result = min as number;
    }
    if (this.$u.is.number(max) && result > (max as number)) {
      result = max as number;
    }
    digit = parseInt(digit?.toString() || "");
    digit = Number.isNaN(digit) ? -1 : digit;
    if (digit < 0) return result;
    var power = Math.pow(10, digit);
    return Math.round(result * power) / power;
  }

  /**
   * Converts the input to an object.
   * @param src - The source to convert.
   * @returns The converted object.
   */
  object(src: any) {
    return this.$u.is.object(src) ? src : {};
  }

  /**
   * Converts the input to a string.
   * @param item - The item to convert.
   * @returns The converted string.
   */
  string(item: any): string {
    if (this.$u.is.empty(item)) return "";
    if (this.$u.is.string(item)) return item;
    if (this.$u.is.array(item)) {
      return item
        .map((p: any) => this.string(p))
        .filter((p: any) => !this.$u.is.empty(p))
        .join(", ");
    }
    if (this.$u.is.object(item)) {
      if (!this.$u.is.nil(item.name)) return this.string(item.name);
      if (!this.$u.is.nil(item.label)) return this.string(item.label);
      if (!this.$u.is.nil(item._id)) return this.string(item._id);
      return "";
    }
    if (this.$u.is.date(item)) return (item as Date).toDateString();
    else if (this.$u.is.function(item)) {
      return "<function>";
    }
    return item.toString();
  }

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
    } = { uglify: true, includeEmpty: false, excludePrivate: true },
    startTab: number = 0
  ): string {
    if (this.$u.is.nil(input)) return "";
    if (this.$u.is.string(input)) return JSON.stringify(input);
    if (this.$u.is.date(input))
      return '"' + (input as Date).toISOString() + '"';
    if (this.$u.is.function(input)) {
      if (input.__body) return JSON.stringify(input.__body);
      const fnStr = input.toString();
      if (fnStr.includes("[native code]")) return input.name;
      return fnStr;
    }
    if (this.$u.is.object(input)) {
      startTab = this.integer(startTab) as number;
      const padding = options.uglify ? "" : "\n" + "\t".repeat(startTab + 1);
      let str = "{";
      let i = 0;
      Object.entries(input).forEach(([key, value]) => {
        if (this.$u.is.nil(value) && !options.includeEmpty) return;
        if (
          key != "_id" &&
          key != "_ts" &&
          options.excludePrivate &&
          key.startsWith("_")
        )
          return;
        if (i !== 0) {
          str += ",";
        }
        i++;
        str += padding;
        if (this.$u.is.function(value)) {
          const fnStr = (value as any).toString();
          if ((value as any).__body) {
            str +=
              '"' +
              key.replace(/"/g, '\\"') +
              '"' +
              ": " +
              JSON.stringify((value as any).name);
          } else if (fnStr.includes("[native code]")) {
            str +=
              '"' + key.replace(/"/g, '\\"') + '"' + ": " + (value as any).name;
          } else {
            let fullFnDef = false;
            if ((value as any).name) {
              const rgxBody =
                "^(async\\s+){0,1}" + (value as any).name + "\\s*\\(";
              const rgx = new RegExp(rgxBody);
              fullFnDef = rgx.test(fnStr);
            }
            if (fullFnDef) {
              str += fnStr;
            } else {
              str += '"' + key.replace(/"/g, '\\"') + '"' + ": " + fnStr;
            }
          }
        } else {
          str += '"' + key.replace(/"/g, '\\"') + '"' + ": ";
          str += this.stringified(value, options, startTab + 1);
        }
      });
      if (i === 0) return "{}";
      str += (options.uglify ? "" : "\n" + "\t".repeat(startTab)) + "}";
      return str;
    } else if (this.$u.is.array(input)) {
      if (input.length === 0) return "[]";
      startTab = this.integer(startTab);
      const padding = options.uglify ? "" : "\n" + "\t".repeat(startTab + 1);
      let str = "[";
      input.forEach((p: any, i: number) => {
        if (i !== 0) {
          str += ",";
        }
        str += padding;
        str += this.stringified(p, options, startTab + 1);
      });
      str += (options.uglify ? "" : "\n" + "\t".repeat(startTab)) + "]";
      return str;
    } else {
      return input.toString();
    }
  }

  /**
   * Capitalizes the first letter of a string.
   * @param str - The string to capitalize.
   * @returns The capitalized string.
   */
  capitalFirst(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  /**
   * Converts a camelCase string to title case.
   * @param str - The string to convert.
   * @returns The converted string.
   */
  titlecase(str: string): string {
    const result = str.replace(/([a-z])(?=[A-Z])/g, "$1 ");
    return this.capitalFirst(result);
  }
}
