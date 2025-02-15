import Is from "./is";
import As from "./as";
import Tree from "./tree";
import { IUtility, IBus, IAs, ITree, IIs } from "./types";
import { Buffer } from "buffer";
import Debounce from "./debounce";
import Throttle from "./throttle";
import Bus from "./bus";
import pako from "pako";
class Utility implements IUtility {
  readonly is: IIs = new Is(this);
  readonly as: IAs = new As(this);
  readonly tree: ITree = new Tree(this);
  readonly bus: IBus = new Bus(this);
  get(obj: any, path?: string): any {
    if (obj === undefined || obj === null) return obj;
    if (!path) return obj;
    const [left, right] = this.seperate(path, ".");
    if (left === path) return obj[left];
    return this.get(obj[left], right);
  }
  getId(item: any): string | void {
    if (this.is.empty(item)) return;
    if (this.is.id(item)) return item;
    if (this.is.number(item)) {
      return item.toString();
    } else if (this.is.object(item)) {
      const itemId = this.as.string(item._id);
      return this.getId(itemId);
    }
  }

  findById(list: any, id: string) {
    id = this.as.id(id);
    list = this.as.array(list);
    for (let item of list) {
      if (this.as.id(item) == id) return item;
    }
  }
  replaceBy(list: any, newItem: any, oldItem?: any) {
    list = this.as.array(list);
    const index = this.indexOf(
      list,
      this.is.empty(oldItem) ? this.as.id(newItem) : oldItem
    );
    if (index < 0) {
      list.push(newItem);
    } else {
      list.splice(index, 1, newItem);
    }
    return list;
  }
  remove(list: any, item: any) {
    if (!this.is.array(list)) return;
    const index = this.indexOf(list, item);
    if (index < 0) return;
    list.splice(index, 1);
  }
  indexOf(list: any, item: any): number {
    if (this.is.empty(list)) return -1;
    if (this.is.nil(item)) return -1;
    list = this.as.array(list);
    const itemId = this.as.id(item);
    for (let i = 0; i < list.length; i++) {
      const listItem = list[i];
      if (item === listItem) return i;
      if (itemId == this.as.id(listItem)) return i;
    }
    return -1;
  }
  any(items: any, filter?: Function) {
    items = this.as.array(items);
    if (items.length === 0) return false;
    if (!filter) return true;
    for (var i = 0; i < items.length; i++) {
      var item = items[i];
      if (filter(item)) {
        return true;
      }
    }
    return false;
  }
  changeIndex(arr: any, oldindex: number, newindex: number) {
    if (newindex >= arr.length) {
      var k = newindex - arr.length + 1;
      while (k--) {
        arr.push(undefined);
      }
    }
    arr.splice(newindex, 0, arr.splice(oldindex, 1)[0]);
  }
  includes(list: any, item: any) {
    return this.indexOf(list, item) >= 0;
  }
  distinct(items: any) {
    var map = new Map();
    this.as.array(items).forEach((p) => {
      let id = this.as.id(p);
      if (map.has(id)) return;
      map.set(id, p);
    });
    return Array.from(map.values());
  }
  sizeOf(items: any) {
    return this.as.array(items).length;
  }
  toMap(items: any) {
    items = this.as.array(items);
    var result = new Map();
    items.forEach((p: any) => result.set(this.as.id(p), p));
    return result;
  }
  toSet(items: any) {
    items = this.as.array(items);
    var result = new Set();
    items.forEach((p: any) => result.add(this.as.id(p)));
    return result;
  }
  first(items: any, filter?: (item: any) => boolean) {
    let result = this.as.array(items);
    if (filter) {
      result = result.filter(filter);
    }
    return result.length === 0 ? undefined : result[0];
  }
  last(items: any) {
    items = this.as.array(items);
    return items.length === 0 ? undefined : items[items.length - 1];
  }
  groupBy<T>(
    items: any,
    prop: string | Function
  ): { _id: string; children: T[] }[] {
    items = this.as.array(items);
    var map = new Map();
    items.forEach((p: any) => {
      var key = this.is.function(prop)
        ? (prop as Function).call(this, p)
        : this.get(p, prop as string);
      if (!map.has(key)) {
        map.set(key, []);
      }
      map.get(key).push(p);
    });
    let result = [] as { _id: string; children: [] }[];
    map.forEach((value, key: string) => {
      result.push({
        _id: key,
        children: value,
      });
    });
    return result;
  }
  take(items: any, length: number): any[] {
    const result = [] as any[];
    length = this.as.integer(length);
    items = this.as.array(items);
    for (let i = 0; i < length && i < items.length; i++) {
      result.push((items as [])[i]);
    }
    return result;
  }
  skip(items: any, length: number) {
    const result = [] as any[];
    length = this.as.integer(length);
    items = this.as.array(items);
    for (let i = length; i < items.length; i++) {
      result.push(items[i]);
    }
    return result;
  }
  sort(items: any, property: string | Function, descending: boolean = false) {
    items = this.as.array(items);
    items.sort((a: any, b: any) => {
      if (this.is.function(property)) {
        a = (property as Function)(a);
        b = (property as Function)(b);
      } else {
        a = this.get(a, property as string);
        b = this.get(b, property as string);
      }
      return descending
        ? this.as.string(b).localeCompare(this.as.string(a))
        : this.as.string(a).localeCompare(this.as.string(b));
    });
  }
  sortNumeric(
    items: any,
    property: string | Function,
    descending: boolean = false
  ) {
    items = this.as.array(items);
    items.sort((a: any, b: any) => {
      if (this.is.function(property)) {
        a = (property as Function)(a);
        b = (property as Function)(b);
      } else {
        a = this.get(a, property as string);
        b = this.get(b, property as string);
      }
      return descending ? b - a : a - b;
    });
    return items;
  }

  emptyFn() {}
  async emptyAsyncFn() {}
  echoFn(): (val: any) => any {
    return function (val) {
      return val;
    };
  }
  trueFn(): Function {
    return function () {
      return true;
    };
  }
  random(min: number, max: number, digit: number): number {
    max = this.as.number(max, digit);
    min = this.as.number(min, digit);
    const diff = max - min;
    let val = Math.random() * (diff > 0 ? diff : 1);
    return this.as.number(val, digit, min, max);
  }
  equals(a: any, b: any): boolean {
    if (a === b) return true;
    if (a && b && typeof a == "object" && typeof b == "object") {
      var arrA = Array.isArray(a),
        arrB = Array.isArray(b),
        i,
        length,
        key;

      if (arrA && arrB) {
        length = a.length;
        if (length != b.length) return false;
        for (i = length; i-- !== 0; )
          if (!this.equals(a[i], b[i])) return false;
        return true;
      }

      if (arrA != arrB) return false;

      var dateA = a instanceof Date,
        dateB = b instanceof Date;
      if (dateA != dateB) return false;
      if (dateA && dateB) return a.getTime() == b.getTime();

      var regexpA = a instanceof RegExp,
        regexpB = b instanceof RegExp;
      if (regexpA != regexpB) return false;
      if (regexpA && regexpB) return a.toString() == b.toString();

      var keys = Object.keys(a);
      length = keys.length;

      if (length !== Object.keys(b).length) return false;

      for (i = length; i-- !== 0; )
        if (!Object.prototype.hasOwnProperty.call(b, keys[i])) return false;

      for (i = length; i-- !== 0; ) {
        key = keys[i];
        if (!this.equals(a[key], b[key])) return false;
      }

      return true;
    }

    return a !== a && b !== b;
  }
  hasAllFields(value: { [key: string]: any }, fields: string[]): boolean {
    if (!this.is.object(value)) return false;
    const set = new Set(Object.keys(value));
    for (let f of fields) {
      let [left, right] = this.seperate(f, ".");
      if (!set.has(left)) return false;
      if (!this.is.empty(right)) {
        let subResult = this.hasAllFields(value[left], [right]);
        if (!subResult) return false;
      }
    }
    return true;
  }
  clone(obj: any) {
    if (this.is.primitive(obj)) {
      return obj;
    }
    if (this.is.array(obj)) {
      return obj.map((p: any) => this.clone(p));
    } else if (obj instanceof Date) {
      return new Date(obj);
    } else if (this.is.object(obj)) {
      var clone: any = {};
      Object.keys(obj).forEach((key) => {
        clone[key] = this.clone(obj[key]);
      });
      return clone;
    }
    return obj;
  }
  extend(out: any, ...args: any[]) {
    out = out || {};
    for (var i = 1; i < arguments.length; i++) {
      var obj = arguments[i];
      if (!obj) continue;
      for (var key in obj) {
        if (!obj.hasOwnProperty(key)) {
          continue;
        }
        // based on https://javascriptweblog.wordpress.com/2011/08/08/fixing-the-javascript-typeof-operator/
        if (Object.prototype.toString.call(obj[key]) === "[object Object]") {
          out[key] = this.extend(out[key], obj[key]);
          continue;
        }
        out[key] = obj[key];
      }
    }
    return out;
  }
  hasProperty(obj: { [key: string]: any }, path: string): boolean {
    var paths = path.split(".");
    var current = obj;
    for (var i = 0; i < paths.length; i++) {
      var key = paths[i];
      if (!this.is.object(current)) {
        return false;
      }
      if (!(key in current)) {
        return false;
      }
      current = current[key];
    }
    return true;
  }
  set(obj: { [key: string]: any }, path: string, value: any) {
    var paths = path.split(".");
    var current = obj;
    for (var i = 0; i < paths.length - 1; i++) {
      var key = paths[i];
      if (!this.is.object(current[key])) {
        current[key] = {};
      }
      current = current[key];
    }
    var lastKey = paths[paths.length - 1];
    current[lastKey] = value;
  }
  removeAccents(str: string): string {
    if (!str) return "";
    if (str.search(/[\xC0-\xFF]/g) > -1) {
      str = str
        .replace(/[\xC0-\xC5]/g, "A")
        .replace(/[\xC6]/g, "AE")
        .replace(/[\xC7]/g, "C")
        .replace(/[\xC8-\xCB]/g, "E")
        .replace(/[\xCC-\xCF]/g, "I")
        .replace(/[\xD0]/g, "D")
        .replace(/[\xD1]/g, "N")
        .replace(/[\xD2-\xD6\xD8]/g, "O")
        .replace(/[\xD9-\xDC]/g, "U")
        .replace(/[\xDD]/g, "Y")
        .replace(/[\xDE]/g, "P")
        .replace(/[\xE0-\xE5]/g, "a")
        .replace(/[\xE6]/g, "ae")
        .replace(/[\xE7]/g, "c")
        .replace(/[\xE8-\xEB]/g, "e")
        .replace(/[\xEC-\xEF]/g, "i")
        .replace(/[\xF1]/g, "n")
        .replace(/[\xF2-\xF6\xF8]/g, "o")
        .replace(/[\xF9-\xFC]/g, "u")
        .replace(/[\xFE]/g, "p")
        .replace(/[\xFD\xFF]/g, "y");
    }
    return str;
  }
  seperate(str: string, seperator: string): string[] {
    if (!str) {
      return [str, ""];
    }
    let left = this.trimThen(str, seperator);
    let right = str.substring(left.length + seperator.length);
    return [left, right || ""];
  }
  trimBefore(str: string, trimSep: string): string {
    if (!str) return "";
    let index = str.indexOf(trimSep);
    return index < 0 ? str : str.substring(index + trimSep.length);
  }
  trimThen(str: string, trimSep: string): string {
    if (!str) return "";
    let index = str.indexOf(trimSep);
    return index < 0 ? str : str.substring(0, index);
  }
  trimLeft(str: string, trimSep: string): string {
    if (!str) return str;
    return str.startsWith(trimSep) ? str.substring(trimSep.length) : str;
  }
  trimRight(str: string, trimSep: string): string {
    if (!str) return str;
    return str.endsWith(trimSep)
      ? str.substr(0, str.length - trimSep.length)
      : str;
  }
  jwtDecode(token: string) {
    if (this.is.empty(token)) return undefined;
    var base64Url = token.split(".")[1];
    var base64 = base64Url.replace("-", "+").replace("_", "/");
    let parsedToken = JSON.parse(
      Buffer.from(base64, "base64").toString("binary")
    );
    let encodedToken: { [key: string]: any } = {};
    Object.keys(parsedToken).forEach((prop) => {
      encodedToken[prop] = this.is.number(parsedToken[prop])
        ? parsedToken[prop]
        : decodeURIComponent(parsedToken[prop]);
    });
    return encodedToken;
  }
  waitAsync(timeout: number): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(resolve, timeout);
    });
  }
  debounce(fn: Function, timeout: number) {
    return new Debounce(fn, timeout);
  }
  throttle(fn: Function, timeout: number) {
    return new Throttle(fn, timeout);
  }
  combineUrl(base: string, relative: string) {
    if (arguments.length > 2) {
      var result = arguments[0];
      for (var i = 1; i < arguments.length; i++) {
        result = this.combineUrl(result, arguments[i]);
      }
      return result;
    }
    if (base === undefined || base === null || base === "") {
      return relative;
    }
    if (!relative || !this.is.string(relative)) {
      return base;
    }
    base = base.endsWith("/") ? base.substring(0, base.length - 1) : base;
    relative = relative.startsWith("/") ? relative.substring(1) : relative;
    return base + "/" + relative;
  }
}
export default new Utility();
