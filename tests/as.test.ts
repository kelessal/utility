import As from "../src/as";
import Utility from "../src/main";

const as = new As(Utility);

describe("As class", () => {
  test("array method", () => {
    expect(as.array(null)).toEqual([]);
    expect(as.array([1, 2, 3])).toEqual([1, 2, 3]);
    expect(as.array(1)).toEqual([1]);
  });

  test("asyncFn method", async () => {
    const asyncFunction = as.asyncFn(() => 42);
    await expect(asyncFunction()).resolves.toBeUndefined();
  });

  test("boolean method", () => {
    expect(as.boolean(1)).toBe(true);
    expect(as.boolean(0)).toBe(false);
  });

  test("camelcase method", () => {
    expect(as.camelcase("hello-world")).toBe("helloWorld");
  });

  test("dashCase method", () => {
    expect(as.dashCase("helloWorld")).toBe("hello-world");
  });

  test("datetime method", () => {
    expect(as.datetime("2021-01-01")).toEqual(new Date("2021-01-01"));
  });

  test("id method", () => {
    expect(as.id()).toHaveLength(21);
  });

  test("integer method", () => {
    expect(as.integer(1.5)).toBe(2);
  });

  test("json method", () => {
    expect(as.json('{"key": "value"}')).toEqual({ key: "value" });
  });

  test("number method", () => {
    expect(as.number("42")).toBe(42);
  });

  test("object method", () => {
    expect(as.object({ key: "value" })).toEqual({ key: "value" });
  });

  test("string method", () => {
    expect(as.string(123)).toBe("123");
  });

  test("stringified method", () => {
    expect(as.stringified({ key: "value" })).toBe('{"key":"value"}');
  });

  test("capitalFirst method", () => {
    expect(as.capitalFirst("hello")).toBe("Hello");
  });

  test("titlecase method", () => {
    expect(as.titlecase("helloWorld")).toBe("Hello World");
  });

  test("enum method", () => {
    enum Colors {
      RED = "red",
      GREEN = "green",
      BLUE = "blue",
    }
    expect(as.enum("red", Colors)).toBe(Colors.RED);
    expect(as.enum("yellow", Colors)).toBe(Colors.RED); // default to first enum value
  });
});
