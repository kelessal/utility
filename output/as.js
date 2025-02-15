"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const nanoid_1 = require("nanoid");
class As {
    constructor(util) {
        this.$u = util;
    }
    array(item) {
        if (this.$u.is.nil(item))
            return [];
        return this.$u.is.array(item) ? item : [item];
    }
    asyncFn(fn) {
        if (!this.$u.is.function(fn))
            return async function () { };
        if (fn.constructor.name === 'AsyncFunction')
            return fn;
        return async function () {
            return fn(...arguments);
        };
    }
    boolean(item) {
        return !!item;
    }
    camelcase(str) {
        return str.replace(/-([a-z])/g, function (g) {
            return g[1].toUpperCase();
        });
    }
    dashCase(str) {
        if (!this.$u.is.string(str)) {
            return '';
        }
        return str.replace(/([a-zA-Z])(?=[A-Z])/g, '$1-').toLowerCase();
    }
    datetime(item) {
        if (!this.$u.is.date(item))
            return new Date();
        if (item instanceof Date)
            return item;
        if (this.$u.is.dateString(item))
            return new Date(item);
        return new Date();
    }
    id(item) {
        if (this.$u.is.empty(item))
            return (0, nanoid_1.nanoid)();
        if (this.$u.is.id(item))
            return item;
        if (this.$u.is.number(item)) {
            return item.toString();
        }
        else if (this.$u.is.object(item)) {
            const itemId = this.string(item._id) || this.string(item.id);
            return this.$u.is.empty(itemId) ? (0, nanoid_1.nanoid)() : itemId;
        }
        return (0, nanoid_1.nanoid)();
    }
    integer(val) {
        const result = this.number(val) || 0;
        return Math.round(result);
    }
    json(str, options = { continue: false }) {
        if (!str)
            return str;
        try {
            str = 'return ' + str;
            if (!options.params) {
                return new Function(str)();
            }
            else {
                const paramKeys = Object.values(options.params);
                const paramValues = Object.values(options.params);
                return new Function(...paramKeys, str)(...paramValues);
            }
        }
        catch (e) {
            if (!options.continue)
                throw e;
        }
    }
    number(val, digit, min, max) {
        if (val === true)
            val = 1;
        else if (val === false)
            val = 0;
        var result = parseFloat(val);
        result = Number.isNaN(result) ? 0 : result;
        if (this.$u.is.number(min) && result < min) {
            result = min;
        }
        if (this.$u.is.number(max) && result > max) {
            result = max;
        }
        digit = parseInt((digit === null || digit === void 0 ? void 0 : digit.toString()) || '');
        digit = Number.isNaN(digit) ? -1 : digit;
        if (digit < 0)
            return result;
        var power = Math.pow(10, digit);
        return Math.round(result * power) / power;
    }
    object(src) {
        return this.$u.is.object(src) ? src : {};
    }
    string(item) {
        if (this.$u.is.empty(item))
            return '';
        if (this.$u.is.string(item))
            return item;
        if (this.$u.is.array(item)) {
            return item
                .map((p) => this.string(p))
                .filter((p) => !this.$u.is.empty(p))
                .join(', ');
        }
        if (this.$u.is.object(item)) {
            if (!this.$u.is.nil(item.name))
                return this.string(item.name);
            if (!this.$u.is.nil(item.label))
                return this.string(item.label);
            if (!this.$u.is.nil(item._id))
                return this.string(item._id);
            return '';
        }
        if (this.$u.is.date(item))
            return item.toDateString();
        else if (this.$u.is.function(item)) {
            return '<function>';
        }
        return item.toString();
    }
    stringified(input, options = { uglify: true, includeEmpty: false, excludePrivate: true }, startTab = 0) {
        if (this.$u.is.nil(input))
            return '';
        if (this.$u.is.string(input))
            return JSON.stringify(input);
        if (this.$u.is.date(input))
            return '"' + input.toISOString() + '"';
        if (this.$u.is.function(input)) {
            if (input.__body)
                return JSON.stringify(input.__body);
            const fnStr = input.toString();
            if (fnStr.includes('[native code]'))
                return input.name;
            return fnStr;
        }
        if (this.$u.is.object(input)) {
            startTab = this.integer(startTab);
            const padding = options.uglify ? '' : '\n' + '\t'.repeat(startTab + 1);
            let str = '{';
            let i = 0;
            Object.entries(input).forEach(([key, value]) => {
                if (this.$u.is.nil(value) && !options.includeEmpty)
                    return;
                if (key != '_id' && key != '_ts' && options.excludePrivate && key.startsWith('_'))
                    return;
                if (i !== 0) {
                    str += ',';
                }
                i++;
                str += padding;
                if (this.$u.is.function(value)) {
                    const fnStr = value.toString();
                    if (value.__body) {
                        str += '"' + key.replace(/"/g, '\\"') + '"' + ': ' + JSON.stringify(value.name);
                    }
                    else if (fnStr.includes('[native code]')) {
                        str += '"' + key.replace(/"/g, '\\"') + '"' + ': ' + value.name;
                    }
                    else {
                        let fullFnDef = false;
                        if (value.name) {
                            const rgxBody = '^(async\\s+){0,1}' + value.name + '\\s*\\(';
                            const rgx = new RegExp(rgxBody);
                            fullFnDef = rgx.test(fnStr);
                        }
                        if (fullFnDef) {
                            str += fnStr;
                        }
                        else {
                            str += '"' + key.replace(/"/g, '\\"') + '"' + ': ' + fnStr;
                        }
                    }
                }
                else {
                    str += '"' + key.replace(/"/g, '\\"') + '"' + ': ';
                    str += this.stringified(value, options, startTab + 1);
                }
            });
            if (i === 0)
                return '{}';
            str += (options.uglify ? '' : '\n' + '\t'.repeat(startTab)) + '}';
            return str;
        }
        else if (this.$u.is.array(input)) {
            if (input.length === 0)
                return '[]';
            startTab = this.integer(startTab);
            const padding = options.uglify ? '' : '\n' + '\t'.repeat(startTab + 1);
            let str = '[';
            input.forEach((p, i) => {
                if (i !== 0) {
                    str += ',';
                }
                str += padding;
                str += this.stringified(p, options, startTab + 1);
            });
            str += (options.uglify ? '' : '\n' + '\t'.repeat(startTab)) + ']';
            return str;
        }
        else {
            return input.toString();
        }
    }
    capitalFirst(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
    titlecase(str) {
        const result = str.replace(/([a-z])(?=[A-Z])/g, '$1 ');
        return this.capitalFirst(result);
    }
}
exports.default = As;
//# sourceMappingURL=as.js.map