import { describe, it, expect } from "bun:test";
import { parseQueryString } from "../src/utils/parseQueryString.js";

describe("parseQueryString", () => {
  it("should parse simple query string", () => {
    const result = parseQueryString("key=value");
    expect(result).toEqual({ key: "value" });
  });

  it("should parse query string with leading ?", () => {
    const result = parseQueryString("?key=value");
    expect(result).toEqual({ key: "value" });
  });

  it("should parse multiple parameters", () => {
    const result = parseQueryString("key1=value1&key2=value2");
    expect(result).toEqual({ key1: "value1", key2: "value2" });
  });

  it("should parse URL encoded values", () => {
    const result = parseQueryString("key=value%20with%20spaces");
    expect(result).toEqual({ key: "value with spaces" });
  });

  it("should parse URL encoded keys", () => {
    const result = parseQueryString("key%20name=value");
    expect(result).toEqual({ "key name": "value" });
  });

  it("should handle parameters without values", () => {
    const result = parseQueryString("key=");
    expect(result).toEqual({ key: "" });
  });

  it("should handle parameters without equals sign", () => {
    const result = parseQueryString("key");
    expect(result).toEqual({ key: "" });
  });

  it("should handle duplicate keys as array", () => {
    const result = parseQueryString("key=value1&key=value2");
    expect(result).toEqual({ key: ["value1", "value2"] });
  });

  it("should handle multiple duplicate keys", () => {
    const result = parseQueryString("key=value1&key=value2&key=value3");
    expect(result).toEqual({ key: ["value1", "value2", "value3"] });
  });

  it("should handle empty string", () => {
    const result = parseQueryString("");
    expect(result).toEqual({});
  });

  it("should handle only question mark", () => {
    const result = parseQueryString("?");
    expect(result).toEqual({});
  });

  it("should handle empty pairs", () => {
    const result = parseQueryString("key=value&&other=test");
    expect(result).toEqual({ key: "value", other: "test" });
  });

  it("should handle special characters", () => {
    const result = parseQueryString("key=value%40%23%24%25%5E%26%2A%28%29");
    expect(result).toEqual({ key: "value@#$%^&*()" });
  });

  it("should handle plus signs as spaces", () => {
    const result = parseQueryString("key=value+with+plus");
    expect(result).toEqual({ key: "value+with+plus" });
  });

  it("should handle empty key", () => {
    const result = parseQueryString("=value");
    expect(result).toEqual({});
  });

  it("should handle multiple empty keys", () => {
    const result = parseQueryString("=value1&=value2");
    expect(result).toEqual({});
  });

  it("should handle non-string input", () => {
    // @ts-expect-error
    const result = parseQueryString(null);
    expect(result).toEqual({});
    // @ts-expect-error
    const result2 = parseQueryString(undefined);
    expect(result2).toEqual({});
    // @ts-expect-error
    const result3 = parseQueryString(123);
    expect(result3).toEqual({});
  });

  it("should handle complex query string", () => {
    const result = parseQueryString(
      "name=John&age=30&city=New%20York&tags=tag1&tags=tag2"
    );
    expect(result).toEqual({
      name: "John",
      age: "30",
      city: "New York",
      tags: ["tag1", "tag2"],
    });
  });

  it("should handle query string with colons", () => {
    const result = parseQueryString("timestamp=2024-01-01T12:00:00Z");
    expect(result).toEqual({ timestamp: "2024-01-01T12:00:00Z" });
  });

  it("should handle query string with equals in value", () => {
    const result = parseQueryString("expression=a=b");
    expect(result).toEqual({ expression: "a=b" });
  });
});

