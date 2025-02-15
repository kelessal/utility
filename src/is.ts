import { IIs, IUtility } from "./types";
export default class Is implements IIs {
  private readonly $u: IUtility;
  constructor(util: IUtility) {
    this.$u = util;
  }
  public array(item: any, path?: string): boolean {
    return Array.isArray(this.$u.get(item, path));
  }
  public boolean(item: any, path?: string): boolean {
    return typeof this.$u.get(item, path) === "boolean";
  }
  public empty(item: any, path?: string): boolean {
    item = this.$u.get(item, path);
    if (this.nil(item) || item === "") {
      return true;
    }
    if (item instanceof Date) {
      return false;
    }
    if (this.array(item)) {
      return item.length === 0;
    }
    if (item instanceof Set) return item.size == 0;
    if (item instanceof Map) return item.size == 0;
    if (this.object(item)) return Object.keys(item).length == 0;
    return false;
  }
  public function(item: any, path?: string): boolean {
    item = this.$u.get(item, path);
    return typeof item === "function";
  }
  public id(val: any, path?: string): boolean {
    val = this.$u.get(val, path);
    return this.string(val) && val && val != "new";
  }
  public ip(val: any, path?: string): boolean {
    val = this.$u.get(val, path);
    return this.ipv4(val) || this.ipv6(val);
  }
  public date(val: any, path?: string): boolean {
    return this.$u.get(val, path) instanceof Date;
  }
  public image(item: any, path?: string): boolean {
    return this.string(item, path) && !!item;
  }
  public integer(val: any, path?: string): boolean {
    val = this.$u.get(val, path);
    return Number.isInteger(val);
  }
  public money(item: any, path?: string): boolean {
    item = this.$u.get(item, path);
    if (!item) return false;
    if (!item.cur || !item.val) return false;
    return this.string(item.cur) && this.number(item.val);
  }
  public nil(item: any, path?: string): boolean {
    item = this.$u.get(item, path);
    return item === null || item === undefined;
  }
  public number(value: any, path?: string): boolean {
    return Number.isFinite(this.$u.get(value, path));
  }
  public object(A: any, path?: string): boolean {
    A = this.$u.get(A, path);
    return (
      typeof A === "object" && A !== null && !Array.isArray(A) && !this.date(A)
    );
  }
  public primitive(obj: any, path?: string) {
    obj = this.$u.get(obj, path);
    return Object(obj) !== obj;
  }
  public string(val: any, path?: string): boolean {
    val = this.$u.get(val, path);
    return typeof val === "string" || val instanceof String;
  }
  public alphaNumeric(val: any, path?: string): boolean {
    val = this.$u.get(val, path);
    return /^[A-Za-z0-9]+$/.test(val);
  }
  public creditCard(val: any, path?: string): boolean {
    val = this.$u.get(val, path);
    return /^(?:(4[0-9]{12}(?:[0-9]{3})?)|(5[1-5][0-9]{14})|(6(?:011|5[0-9]{2})[0-9]{12})|(3[47][0-9]{13})|(3(?:0[0-5]|[68][0-9])[0-9]{11})|((?:2131|1800|35[0-9]{3})[0-9]{11}))$/.test(
      val
    );
  }
  public dateString(val: any, path?: string): boolean {
    val = this.$u.get(val, path);
    return /^(1[0-2]|0?[1-9])([\/-])(3[01]|[12][0-9]|0?[1-9])(?:\2)(?:[0-9]{2})?[0-9]{2}$/.test(
      val
    );
  }
  public email(val: any, path?: string): boolean {
    val = this.$u.get(val, path);
    var regex =
      /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i; // eslint-disable-line no-control-regex
    return regex.test(val);
  }
  public eppPhone(val: any, path?: string): boolean {
    val = this.$u.get(val, path);
    var regex = /^\+[0-9]{1,3}\.[0-9]{4,14}(?:x.+)?$/;
    return regex.test(val);
  }
  public hexadecimal(val: any, path?: string): boolean {
    val = this.$u.get(val, path);
    var regex = /^(?:0x)?[0-9a-fA-F]+$/;
    return regex.test(val);
  }
  public hexColor(val: any, path?: string): boolean {
    val = this.$u.get(val, path);
    var regex = /^#?([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;
    return regex.test(val);
  }
  public ipv4(val: any, path?: string): boolean {
    val = this.$u.get(val, path);
    var regex =
      /^(?:(?:\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])\.){3}(?:\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])$/;
    return regex.test(val);
  }
  public ipv6(val: any, path?: string): boolean {
    val = this.$u.get(val, path);
    var regex =
      /^((?=.*::)(?!.*::.+::)(::)?([\dA-F]{1,4}:(:|\b)|){5}|([\dA-F]{1,4}:){6})((([\dA-F]{1,4}((?!\3)::|:\b|$))|(?!\2\3)){2}|(((2[0-4]|1\d|[1-9])?\d|25[0-5])\.?\b){4})$/i;
    return regex.test(val);
  }
  public nanpPhone(val: any, path?: string): boolean {
    val = this.$u.get(val, path);
    var regex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
    return regex.test(val);
  }
  public timeString(val: any, path?: string): boolean {
    val = this.$u.get(val, path);
    var regex = /^(2[0-3]|[01]?[0-9]):([0-5]?[0-9]):([0-5]?[0-9])$/;
    return regex.test(val);
  }
  public url(val: any, path?: string): boolean {
    val = this.$u.get(val, path);
    var regex =
      /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/i;
    return regex.test(val);
  }
}
