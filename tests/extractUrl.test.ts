import { describe, it, expect } from "bun:test";
import { extractUrl } from "../src/utils/extractUrl.js";

describe("extractUrl", () => {
  it("should extract URL from --url flag", () => {
    const result = extractUrl("curl --url https://example.com");
    expect(result).toBe("https://example.com");
  });

  it("should extract positional URL", () => {
    const result = extractUrl("curl https://example.com");
    expect(result).toBe("https://example.com");
  });

  it("should extract URL with path", () => {
    const result = extractUrl("curl https://example.com/api/v1/users");
    expect(result).toBe("https://example.com/api/v1/users");
  });

  it("should extract URL with query params", () => {
    const result = extractUrl(
      "curl https://example.com?key=value&other=test"
    );
    expect(result).toBe("https://example.com?key=value&other=test");
  });

  it("should extract URL with hash", () => {
    const result = extractUrl("curl https://example.com#section");
    expect(result).toBe("https://example.com#section");
  });

  it("should extract URL with port", () => {
    const result = extractUrl("curl https://example.com:8080/api");
    expect(result).toBe("https://example.com:8080/api");
  });

  it("should extract HTTP URL", () => {
    const result = extractUrl("curl http://example.com");
    expect(result).toBe("http://example.com");
  });

  it("should handle curl.exe", () => {
    const result = extractUrl("curl.exe https://example.com");
    expect(result).toBe("https://example.com");
  });

  it("should prioritize --url flag over positional URL", () => {
    const result = extractUrl(
      "curl --url https://api.example.com https://example.com"
    );
    expect(result).toBe("https://api.example.com");
  });

  it("should skip URLs in header values", () => {
    const result = extractUrl(
      'curl -H "Referer: https://other.com" https://example.com'
    );
    expect(result).toBe("https://example.com");
  });

  it("should skip URLs in data values", () => {
    const result = extractUrl(
      'curl -d "https://other.com" https://example.com'
    );
    expect(result).toBe("https://example.com");
  });

  it("should skip URLs in cookie values", () => {
    const result = extractUrl(
      'curl -b "https://other.com" https://example.com'
    );
    expect(result).toBe("https://example.com");
  });

  it("should extract URL after flags", () => {
    const result = extractUrl(
      "curl -X POST -H 'Content-Type: application/json' https://example.com"
    );
    expect(result).toBe("https://example.com");
  });

  it("should extract URL with special characters", () => {
    const result = extractUrl(
      "curl https://example.com/path%20with%20spaces?key=value%20here"
    );
    expect(result).toBe(
      "https://example.com/path%20with%20spaces?key=value%20here"
    );
  });

  it("should handle empty --url flag", () => {
    const result = extractUrl("curl --url");
    expect(result).toBe("");
  });

  it("should return empty string when no URL", () => {
    const result = extractUrl("curl -X POST");
    expect(result).toBe("");
  });

  it("should return empty string for command with only curl", () => {
    const result = extractUrl("curl");
    expect(result).toBe("");
  });

  it("should handle empty string", () => {
    const result = extractUrl("");
    expect(result).toBe("");
  });

  it("should handle non-string input", () => {
    // @ts-expect-error
    const result = extractUrl(null);
    expect(result).toBe("");
    // @ts-expect-error
    const result2 = extractUrl(undefined);
    expect(result2).toBe("");
    // @ts-expect-error
    const result3 = extractUrl(123);
    expect(result3).toBe("");
  });

  it("should handle pre-tokenized command", () => {
    const tokens = ["curl", "https://example.com"];
    const result = extractUrl("", tokens);
    expect(result).toBe("https://example.com");
  });
});
