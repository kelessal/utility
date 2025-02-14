"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Is {
    constructor(util) {
        this.$u = util;
    }
    array(item, path) {
        return Array.isArray(this.$u.get(item, path));
    }
    boolean(item, path) {
        return typeof this.$u.get(item, path) === 'boolean';
    }
    empty(item, path) {
        item = this.$u.get(item, path);
        if (this.nil(item) || item === '') {
            return true;
        }
        if (item instanceof Date) {
            return false;
        }
        if (this.array(item)) {
            return item.length === 0;
        }
        if (item instanceof Set)
            return item.size == 0;
        if (item instanceof Map)
            return item.size == 0;
        if (this.object(item))
            return Object.keys(item).length == 0;
        return false;
    }
    function(item, path) {
        return this.$u.get(item, path) instanceof Function;
    }
    id(val, path) {
        val = this.$u.get(val, path);
        return this.string(val) && val && val != 'new';
    }
    ip(val, path) {
        val = this.$u.get(val, path);
        return this.ipv4(val) || this.ipv6(val);
    }
    date(val, path) {
        return this.$u.get(val, path) instanceof Date;
    }
    image(item, path) {
        return this.string(item, path) && !!item;
    }
    integer(val, path) {
        val = this.$u.get(val, path);
        return Number.isInteger(val);
    }
    money(item, path) {
        item = this.$u.get(item, path);
        if (!item)
            return false;
        if (!item.cur || !item.val)
            return false;
        return this.string(item.cur) && this.number(item.val);
    }
    nil(item, path) {
        item = this.$u.get(item, path);
        return item === null || item === undefined;
    }
    number(value, path) {
        return Number.isFinite(this.$u.get(value, path));
    }
    object(A, path) {
        A = this.$u.get(A, path);
        return typeof A === 'object' && A !== null && !Array.isArray(A) && !this.date(A);
    }
    primitive(obj, path) {
        obj = this.$u.get(obj, path);
        return Object(obj) !== obj;
    }
    string(val, path) {
        val = this.$u.get(val, path);
        return typeof val === 'string' || val instanceof String;
    }
    alphaNumeric(val, path) {
        val = this.$u.get(val, path);
        return /^[A-Za-z0-9]+$/.test(val);
    }
    creditCard(val, path) {
        val = this.$u.get(val, path);
        return /^(?:(4[0-9]{12}(?:[0-9]{3})?)|(5[1-5][0-9]{14})|(6(?:011|5[0-9]{2})[0-9]{12})|(3[47][0-9]{13})|(3(?:0[0-5]|[68][0-9])[0-9]{11})|((?:2131|1800|35[0-9]{3})[0-9]{11}))$/.test(val);
    }
    dateString(val, path) {
        val = this.$u.get(val, path);
        return /^(1[0-2]|0?[1-9])([\/-])(3[01]|[12][0-9]|0?[1-9])(?:\2)(?:[0-9]{2})?[0-9]{2}$/.test(val);
    }
    email(val, path) {
        val = this.$u.get(val, path);
        var regex = /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i; // eslint-disable-line no-control-regex
        return regex.test(val);
    }
    eppPhone(val, path) {
        val = this.$u.get(val, path);
        var regex = /^\+[0-9]{1,3}\.[0-9]{4,14}(?:x.+)?$/;
        return regex.test(val);
    }
    hexadecimal(val, path) {
        val = this.$u.get(val, path);
        var regex = /^(?:0x)?[0-9a-fA-F]+$/;
        return regex.test(val);
    }
    hexColor(val, path) {
        val = this.$u.get(val, path);
        var regex = /^#?([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;
        return regex.test(val);
    }
    ipv4(val, path) {
        val = this.$u.get(val, path);
        var regex = /^(?:(?:\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])\.){3}(?:\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])$/;
        return regex.test(val);
    }
    ipv6(val, path) {
        val = this.$u.get(val, path);
        var regex = /^((?=.*::)(?!.*::.+::)(::)?([\dA-F]{1,4}:(:|\b)|){5}|([\dA-F]{1,4}:){6})((([\dA-F]{1,4}((?!\3)::|:\b|$))|(?!\2\3)){2}|(((2[0-4]|1\d|[1-9])?\d|25[0-5])\.?\b){4})$/i;
        return regex.test(val);
    }
    nanpPhone(val, path) {
        val = this.$u.get(val, path);
        var regex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
        return regex.test(val);
    }
    timeString(val, path) {
        val = this.$u.get(val, path);
        var regex = /^(2[0-3]|[01]?[0-9]):([0-5]?[0-9]):([0-5]?[0-9])$/;
        return regex.test(val);
    }
    url(val, path) {
        val = this.$u.get(val, path);
        var regex = /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/i;
        return regex.test(val);
    }
}
exports.default = Is;
//# sourceMappingURL=is.js.map