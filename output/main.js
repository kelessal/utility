"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const is_1 = __importDefault(require("./is"));
const as_1 = __importDefault(require("./as"));
const tree_1 = __importDefault(require("./tree"));
const buffer_1 = require("buffer");
const debounce_1 = __importDefault(require("./debounce"));
const throttle_1 = __importDefault(require("./throttle"));
class Utility {
    constructor() {
        this.is = new is_1.default(this);
        this.as = new as_1.default(this);
        this.tree = new tree_1.default(this);
    }
    get(obj, path) {
        if (obj === undefined || obj === null)
            return obj;
        if (!path)
            return obj;
        const [left, right] = this.seperate(path, '.');
        if (left === path)
            return obj[left];
        return this.get(obj[left], right);
    }
    getId(item) {
        if (this.is.empty(item))
            return;
        if (this.is.id(item))
            return item;
        if (this.is.number(item)) {
            return item.toString();
        }
        else if (this.is.object(item)) {
            const itemId = this.as.string(item._id);
            return this.getId(itemId);
        }
    }
    findById(list, id) {
        id = this.as.id(id);
        list = this.as.array(list);
        for (let item of list) {
            if (this.as.id(item) == id)
                return item;
        }
    }
    replaceBy(list, newItem, oldItem) {
        list = this.as.array(list);
        const index = this.indexOf(list, this.is.empty(oldItem) ? this.as.id(newItem) : oldItem);
        if (index < 0) {
            list.push(newItem);
        }
        else {
            list.splice(index, 1, newItem);
        }
        return list;
    }
    remove(list, item) {
        if (!this.is.array(list))
            return;
        const index = this.indexOf(list, item);
        if (index < 0)
            return;
        list.splice(index, 1);
    }
    indexOf(list, item) {
        if (this.is.empty(list))
            return -1;
        if (this.is.nil(item))
            return -1;
        list = this.as.array(list);
        const itemId = this.as.id(item);
        for (let i = 0; i < list.length; i++) {
            const listItem = list[i];
            if (item === listItem)
                return i;
            if (itemId == this.as.id(listItem))
                return i;
        }
        return -1;
    }
    any(items, filter) {
        items = this.as.array(items);
        if (items.length === 0)
            return false;
        if (!filter)
            return true;
        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            if (filter(item)) {
                return true;
            }
        }
        return false;
    }
    changeIndex(arr, oldindex, newindex) {
        if (newindex >= arr.length) {
            var k = newindex - arr.length + 1;
            while (k--) {
                arr.push(undefined);
            }
        }
        arr.splice(newindex, 0, arr.splice(oldindex, 1)[0]);
    }
    includes(list, item) {
        return this.indexOf(list, item) >= 0;
    }
    distinct(items) {
        var map = new Map();
        this.as.array(items).forEach((p) => {
            let id = this.as.id(p);
            if (map.has(id))
                return;
            map.set(id, p);
        });
        return Array.from(map.values());
    }
    sizeOf(items) {
        return this.as.array(items).length;
    }
    toMap(items) {
        items = this.as.array(items);
        var result = new Map();
        items.forEach((p) => result.set(this.as.id(p), p));
        return result;
    }
    toSet(items) {
        items = this.as.array(items);
        var result = new Set();
        items.forEach((p) => result.add(this.as.id(p)));
        return result;
    }
    first(items, filter) {
        let result = this.as.array(items);
        if (filter) {
            result = result.filter(filter);
        }
        return result.length === 0 ? undefined : result[0];
    }
    last(items) {
        items = this.as.array(items);
        return items.length === 0 ? undefined : items[items.length - 1];
    }
    groupBy(items, prop) {
        items = this.as.array(items);
        var map = new Map();
        items.forEach((p) => {
            var key = this.is.function(prop) ? prop.call(this, p) : this.get(p, prop);
            if (!map.has(key)) {
                map.set(key, []);
            }
            map.get(key).push(p);
        });
        let result = [];
        map.forEach((value, key) => {
            result.push({
                _id: key,
                children: value,
            });
        });
        return result;
    }
    take(items, length) {
        const result = [];
        length = this.as.integer(length);
        items = this.as.array(items);
        for (let i = 0; i < length && i < items.length; i++) {
            result.push(items[i]);
        }
        return result;
    }
    skip(items, length) {
        const result = [];
        length = this.as.integer(length);
        items = this.as.array(items);
        for (let i = length; i < items.length; i++) {
            result.push(items[i]);
        }
        return result;
    }
    sort(items, property, descending = false) {
        items = this.as.array(items);
        items.sort((a, b) => {
            if (this.is.function(property)) {
                a = property(a);
                b = property(b);
            }
            else {
                a = this.get(a, property);
                b = this.get(b, property);
            }
            return descending ? this.as.string(b).localeCompare(this.as.string(a)) : this.as.string(a).localeCompare(this.as.string(b));
        });
    }
    sortNumeric(items, property, descending = false) {
        items = this.as.array(items);
        items.sort((a, b) => {
            if (this.is.function(property)) {
                a = property(a);
                b = property(b);
            }
            else {
                a = this.get(a, property);
                b = this.get(b, property);
            }
            a = this.as.number(this.get(a, property));
            b = this.as.number(this.get(b, property));
            return descending ? b - a : a - b;
        });
        return items;
    }
    emptyFn() { }
    async emptyAsyncFn() { }
    echoFn() {
        return function (val) {
            return val;
        };
    }
    trueFn() {
        return function () {
            return true;
        };
    }
    random(min, max, digit) {
        max = this.as.number(max, digit);
        min = this.as.number(min, digit);
        const diff = max - min;
        let val = Math.random() * (diff > 0 ? diff : 1);
        return this.as.number(val, digit, min, max);
    }
    equals(a, b) {
        if (a === b)
            return true;
        if (a && b && typeof a == 'object' && typeof b == 'object') {
            var arrA = Array.isArray(a), arrB = Array.isArray(b), i, length, key;
            if (arrA && arrB) {
                length = a.length;
                if (length != b.length)
                    return false;
                for (i = length; i-- !== 0;)
                    if (!this.equals(a[i], b[i]))
                        return false;
                return true;
            }
            if (arrA != arrB)
                return false;
            var dateA = a instanceof Date, dateB = b instanceof Date;
            if (dateA != dateB)
                return false;
            if (dateA && dateB)
                return a.getTime() == b.getTime();
            var regexpA = a instanceof RegExp, regexpB = b instanceof RegExp;
            if (regexpA != regexpB)
                return false;
            if (regexpA && regexpB)
                return a.toString() == b.toString();
            var keys = Object.keys(a);
            length = keys.length;
            if (length !== Object.keys(b).length)
                return false;
            for (i = length; i-- !== 0;)
                if (!Object.prototype.hasOwnProperty.call(b, keys[i]))
                    return false;
            for (i = length; i-- !== 0;) {
                key = keys[i];
                if (!this.equals(a[key], b[key]))
                    return false;
            }
            return true;
        }
        return a !== a && b !== b;
    }
    hasAllFields(value, fields) {
        if (!this.is.object(value))
            return false;
        const set = new Set(Object.keys(value));
        for (let f of fields) {
            let [left, right] = this.seperate(f, '.');
            if (!set.has(left))
                return false;
            if (!this.is.empty(right)) {
                let subResult = this.hasAllFields(value[left], [right]);
                if (!subResult)
                    return false;
            }
        }
        return true;
    }
    clone(obj) {
        if (this.is.primitive(obj)) {
            return obj;
        }
        if (this.is.array(obj)) {
            return obj.map((p) => this.clone(p));
        }
        else if (obj instanceof Date) {
            return new Date(obj);
        }
        else if (this.is.object(obj)) {
            var clone = {};
            Object.keys(obj).forEach((key) => {
                clone[key] = this.clone(obj[key]);
            });
            return clone;
        }
        return obj;
    }
    extend(out, ...args) {
        out = out || {};
        for (var i = 1; i < arguments.length; i++) {
            var obj = arguments[i];
            if (!obj)
                continue;
            for (var key in obj) {
                if (!obj.hasOwnProperty(key)) {
                    continue;
                }
                // based on https://javascriptweblog.wordpress.com/2011/08/08/fixing-the-javascript-typeof-operator/
                if (Object.prototype.toString.call(obj[key]) === '[object Object]') {
                    out[key] = this.extend(out[key], obj[key]);
                    continue;
                }
                out[key] = obj[key];
            }
        }
        return out;
    }
    hasProperty(obj, path) {
        var paths = path.split('.');
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
    set(obj, path, value) {
        var paths = path.split('.');
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
    removeAccents(str) {
        if (!str)
            return '';
        if (str.search(/[\xC0-\xFF]/g) > -1) {
            str = str
                .replace(/[\xC0-\xC5]/g, 'A')
                .replace(/[\xC6]/g, 'AE')
                .replace(/[\xC7]/g, 'C')
                .replace(/[\xC8-\xCB]/g, 'E')
                .replace(/[\xCC-\xCF]/g, 'I')
                .replace(/[\xD0]/g, 'D')
                .replace(/[\xD1]/g, 'N')
                .replace(/[\xD2-\xD6\xD8]/g, 'O')
                .replace(/[\xD9-\xDC]/g, 'U')
                .replace(/[\xDD]/g, 'Y')
                .replace(/[\xDE]/g, 'P')
                .replace(/[\xE0-\xE5]/g, 'a')
                .replace(/[\xE6]/g, 'ae')
                .replace(/[\xE7]/g, 'c')
                .replace(/[\xE8-\xEB]/g, 'e')
                .replace(/[\xEC-\xEF]/g, 'i')
                .replace(/[\xF1]/g, 'n')
                .replace(/[\xF2-\xF6\xF8]/g, 'o')
                .replace(/[\xF9-\xFC]/g, 'u')
                .replace(/[\xFE]/g, 'p')
                .replace(/[\xFD\xFF]/g, 'y');
        }
        return str;
    }
    seperate(str, seperator) {
        if (!str) {
            return [str, ''];
        }
        let left = this.trimThen(str, seperator);
        let right = str.substring(left.length + seperator.length);
        return [left, right || ''];
    }
    trimBefore(str, trimSep) {
        if (!str)
            return '';
        let index = str.indexOf(trimSep);
        return index < 0 ? str : str.substring(index + trimSep.length);
    }
    trimThen(str, trimSep) {
        if (!str)
            return '';
        let index = str.indexOf(trimSep);
        return index < 0 ? str : str.substring(0, index);
    }
    trimLeft(str, trimSep) {
        if (!str)
            return str;
        return str.startsWith(trimSep) ? str.substring(trimSep.length) : str;
    }
    trimRight(str, trimSep) {
        if (!str)
            return str;
        return str.endsWith(trimSep) ? str.substr(0, str.length - trimSep.length) : str;
    }
    jwtDecode(token) {
        if (this.is.empty(token))
            return undefined;
        var base64Url = token.split('.')[1];
        var base64 = base64Url.replace('-', '+').replace('_', '/');
        let parsedToken = JSON.parse(buffer_1.Buffer.from(base64, 'base64').toString('binary'));
        let encodedToken = {};
        Object.keys(parsedToken).forEach((prop) => {
            encodedToken[prop] = this.is.number(parsedToken[prop]) ? parsedToken[prop] : decodeURIComponent(parsedToken[prop]);
        });
        return encodedToken;
    }
    waitAsync(timeout) {
        return new Promise((resolve) => {
            setTimeout(resolve, timeout);
        });
    }
    debounce(fn, timeout) {
        return new debounce_1.default(fn, timeout);
    }
    throttle(fn, timeout) {
        return new throttle_1.default(fn, timeout);
    }
    combineUrl(base, relative) {
        if (arguments.length > 2) {
            var result = arguments[0];
            for (var i = 1; i < arguments.length; i++) {
                result = this.combineUrl(result, arguments[i]);
            }
            return result;
        }
        if (base === undefined || base === null || base === '') {
            return relative;
        }
        if (!relative || !this.is.string(relative)) {
            return base;
        }
        base = base.endsWith('/') ? base.substring(0, base.length - 1) : base;
        relative = relative.startsWith('/') ? relative.substring(1) : relative;
        return base + '/' + relative;
    }
}
exports.default = new Utility();
//# sourceMappingURL=main.js.map