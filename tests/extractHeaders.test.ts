import { describe, it, expect } from "bun:test";
import { extractHeaders } from "../src/utils/extractHeaders.js";

describe("extractHeaders", () => {
  it("should extract headers", () => {
    const result = extractHeaders(
      'curl -H "Header: value" https://example.com'
    );
    expect(result).toEqual({ Header: "value" });
  });

  it("should extract multiple headers", () => {
    const result = extractHeaders(
      'curl -H "Content-Type: application/json" -H "Authorization: Bearer token" https://example.com'
    );
    expect(result).toEqual({
      "Content-Type": "application/json",
      Authorization: "Bearer token",
    });
  });

  it("should handle --header flag", () => {
    const result = extractHeaders(
      'curl --header "X-Custom: value" https://example.com'
    );
    expect(result).toEqual({ "X-Custom": "value" });
  });

  it("should handle headers with single quotes", () => {
    const result = extractHeaders(
      "curl -H 'Content-Type: application/json' https://example.com"
    );
    expect(result).toEqual({ "Content-Type": "application/json" });
  });

  it("should handle headers without quotes", () => {
    const result = extractHeaders(
      "curl -H Content-Type:application/json https://example.com"
    );
    expect(result).toEqual({ "Content-Type": "application/json" });
  });

  it("should handle headers with spaces in value", () => {
    const result = extractHeaders(
      'curl -H "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64)" https://example.com'
    );
    expect(result).toEqual({
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
    });
  });

  it("should handle headers with colons in value", () => {
    const result = extractHeaders(
      'curl -H "X-Timestamp: 2024-01-01T12:00:00Z" https://example.com'
    );
    expect(result).toEqual({ "X-Timestamp": "2024-01-01T12:00:00Z" });
  });

  it("should handle empty header value", () => {
    const result = extractHeaders('curl -H "X-Empty:" https://example.com');
    expect(result).toEqual({ "X-Empty": "" });
  });

  it("should handle header with only name", () => {
    const result = extractHeaders('curl -H "X-Header" https://example.com');
    expect(result).toEqual({});
  });

  it("should skip URLs in header values", () => {
    const result = extractHeaders(
      'curl -H "Header: https://example.com" https://api.example.com'
    );
    expect(result).toEqual({});
  });

  it("should skip URLs when header value is a URL", () => {
    const result = extractHeaders(
      'curl -H "Referer: https://example.com" https://api.example.com'
    );
    expect(result).toEqual({});
  });

  it("should handle header flag without value", () => {
    const result = extractHeaders("curl -H https://example.com");
    expect(result).toEqual({});
  });

  it("should handle mixed -H and --header flags", () => {
    const result = extractHeaders(
      'curl -H "Header1: value1" --header "Header2: value2" https://example.com'
    );
    expect(result).toEqual({ Header1: "value1", Header2: "value2" });
  });

  it("should handle headers with special characters", () => {
    const result = extractHeaders(
      'curl -H "X-Special: value@#$%^&*()" https://example.com'
    );
    expect(result).toEqual({ "X-Special": "value@#$%^&*()" });
  });

  it("should handle case-insensitive header names", () => {
    const result = extractHeaders(
      'curl -H "content-type: application/json" https://example.com'
    );
    expect(result).toEqual({ "content-type": "application/json" });
  });

  it("should handle headers with trailing spaces", () => {
    const result = extractHeaders(
      'curl -H "Header: value " https://example.com'
    );
    expect(result).toEqual({ Header: "value" });
  });

  it("should handle headers with leading spaces in value", () => {
    const result = extractHeaders(
      'curl -H "Header:  value" https://example.com'
    );
    expect(result).toEqual({ Header: "value" });
  });

  it("should handle empty string input", () => {
    const result = extractHeaders("");
    expect(result).toEqual({});
  });

  it("should handle command without headers", () => {
    const result = extractHeaders("curl https://example.com");
    expect(result).toEqual({});
  });

  it("should handle non-string input", () => {
    // @ts-expect-error
    const result = extractHeaders(null);
    expect(result).toEqual({});
    // @ts-expect-error
    const result2 = extractHeaders(undefined);
    expect(result2).toEqual({});
    // @ts-expect-error
    const result3 = extractHeaders(123);
    expect(result3).toEqual({});
  });

  it("should handle pre-tokenized command", () => {
    const tokens = ["curl", "-H", "Content-Type: application/json"];
    const result = extractHeaders("", tokens);
    expect(result).toEqual({ "Content-Type": "application/json" });
  });
});
