import { describe, it, expect } from "bun:test";
import { extractData } from "../src/utils/extractData.js";

describe("extractData", () => {
  it("should extract data", () => {
    const result = extractData('curl -d "data" https://example.com');
    expect(result).toBe("data");
  });

  it("should extract data with --data flag", () => {
    const result = extractData('curl --data "data" https://example.com');
    expect(result).toBe("data");
  });

  it("should extract data with --data-raw flag", () => {
    const result = extractData('curl --data-raw "data" https://example.com');
    expect(result).toBe("data");
  });

  it("should extract data with --data-binary flag", () => {
    const result = extractData('curl --data-binary "data" https://example.com');
    expect(result).toBe("data");
  });

  it("should extract data with --data-urlencode flag", () => {
    const result = extractData(
      'curl --data-urlencode "data" https://example.com'
    );
    expect(result).toBe("data");
  });

  it("should extract data with --data-ascii flag", () => {
    const result = extractData('curl --data-ascii "data" https://example.com');
    expect(result).toBe("data");
  });

  it("should combine multiple data flags with &", () => {
    const result = extractData(
      'curl -d "key1=value1" -d "key2=value2" https://example.com'
    );
    expect(result).toBe("key1=value1&key2=value2");
  });

  it("should combine multiple data flags with different flags", () => {
    const result = extractData(
      'curl -d "key1=value1" --data-raw "key2=value2" https://example.com'
    );
    expect(result).toBe("key1=value1&key2=value2");
  });

  it("should handle data with special characters", () => {
    const result = extractData(
      'curl -d "key=value@#$%^&*()" https://example.com'
    );
    expect(result).toBe("key=value@#$%^&*()");
  });

  it("should handle data with newlines", () => {
    const result = extractData('curl -d "line1\nline2" https://example.com');
    expect(result).toBe("line1\nline2");
  });

  it("should handle empty data flag", () => {
    const result = extractData("curl -d https://example.com");
    expect(result).toBeNull();
  });

  it("should skip URLs in data values", () => {
    const result = extractData(
      'curl -d "https://example.com" https://api.example.com'
    );
    expect(result).toBeNull();
  });

  it("should return null when no data", () => {
    const result = extractData("curl https://example.com");
    expect(result).toBeNull();
  });

  it("should handle JSON data", () => {
    const result = extractData(
      'curl -d \'{"key":"value"}\' https://example.com'
    );
    expect(result).toBe('{"key":"value"}');
  });

  it("should handle data with single quotes", () => {
    const result = extractData("curl -d 'data' https://example.com");
    expect(result).toBe("data");
  });

  it("should handle data with escaped quotes", () => {
    const result = extractData('curl -d "key=\\"value\\"" https://example.com');
    expect(result).toBe('key="value"');
  });

  it("should handle multiple empty data flags", () => {
    const result = extractData("curl -d -d");
    // When -d is followed by another flag, it treats the flag as data
    expect(result).toBe("-d");
  });

  it("should handle data flag at end of command", () => {
    const result = extractData('curl -d "data"');
    expect(result).toBe("data");
  });

  it("should handle empty string", () => {
    const result = extractData("");
    expect(result).toBeNull();
  });

  it("should handle non-string input", () => {
    // @ts-expect-error
    const result = extractData(null);
    expect(result).toBeNull();
    // @ts-expect-error
    const result2 = extractData(undefined);
    expect(result2).toBeNull();
    // @ts-expect-error
    const result3 = extractData(123);
    expect(result3).toBeNull();
  });

  it("should handle pre-tokenized command", () => {
    const tokens = ["curl", "-d", "data"];
    const result = extractData("", tokens);
    expect(result).toBe("data");
  });
});
