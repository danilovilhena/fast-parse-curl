import { describe, it, expect } from "bun:test";
import { parseJson } from "../src/utils/parseJson.js";

describe("parseJson", () => {
  it("should parse valid JSON string", () => {
    const result = parseJson('{"key":"value"}');
    expect(result).toEqual({ key: "value" });
  });

  it("should parse JSON with numbers", () => {
    const result = parseJson('{"age":30,"count":42}');
    expect(result).toEqual({ age: 30, count: 42 });
  });

  it("should parse JSON with booleans", () => {
    const result = parseJson('{"active":true,"deleted":false}');
    expect(result).toEqual({ active: true, deleted: false });
  });

  it("should parse JSON with null", () => {
    const result = parseJson('{"value":null}');
    expect(result).toEqual({ value: null });
  });

  it("should parse JSON with arrays", () => {
    const result = parseJson('{"items":[1,2,3]}');
    expect(result).toEqual({ items: [1, 2, 3] });
  });

  it("should parse JSON with nested objects", () => {
    const result = parseJson('{"user":{"name":"John","age":30}}');
    expect(result).toEqual({ user: { name: "John", age: 30 } });
  });

  it("should parse JSON array", () => {
    const result = parseJson('[1,2,3]');
    expect(result).toEqual([1, 2, 3]);
  });

  it("should parse JSON string", () => {
    const result = parseJson('"hello"');
    expect(result).toBe("hello");
  });

  it("should parse JSON number", () => {
    const result = parseJson("42");
    expect(result).toBe(42);
  });

  it("should parse JSON boolean", () => {
    const result = parseJson("true");
    expect(result).toBe(true);
  });

  it("should return object as-is", () => {
    const obj = { key: "value" };
    const result = parseJson(obj);
    expect(result).toBe(obj);
  });

  it("should return array as-is", () => {
    const arr = [1, 2, 3];
    const result = parseJson(arr);
    expect(result).toBe(arr);
  });

  it("should return null as-is", () => {
    const result = parseJson(null);
    expect(result).toBe(null);
  });

  it("should return undefined on invalid JSON", () => {
    const result = parseJson("invalid json");
    expect(result).toBeUndefined();
  });

  it("should return undefined on malformed JSON", () => {
    const result = parseJson('{"key":"value"');
    expect(result).toBeUndefined();
  });

  it("should return undefined on trailing comma", () => {
    const result = parseJson('{"key":"value",}');
    expect(result).toBeUndefined();
  });

  it("should return string on invalid JSON with fallback", () => {
    const result = parseJson("invalid json", { fallback: true });
    expect(result).toBe("invalid json");
  });

  it("should return string on malformed JSON with fallback", () => {
    const result = parseJson('{"key":"value"', { fallback: true });
    expect(result).toBe('{"key":"value"');
  });

  it("should not return fallback on valid JSON", () => {
    const result = parseJson('{"key":"value"}', { fallback: true });
    expect(result).toEqual({ key: "value" });
  });

  it("should handle empty string", () => {
    const result = parseJson("");
    expect(result).toBeUndefined();
  });

  it("should handle empty string with fallback", () => {
    const result = parseJson("", { fallback: true });
    expect(result).toBe("");
  });

  it("should handle whitespace only", () => {
    const result = parseJson("   ");
    expect(result).toBeUndefined();
  });

  it("should handle whitespace only with fallback", () => {
    const result = parseJson("   ", { fallback: true });
    expect(result).toBe("   ");
  });

  it("should handle empty object", () => {
    const result = parseJson("{}");
    expect(result).toEqual({});
  });

  it("should handle empty array", () => {
    const result = parseJson("[]");
    expect(result).toEqual([]);
  });
});

