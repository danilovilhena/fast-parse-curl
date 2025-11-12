import { describe, it, expect } from "bun:test";
import { extractCookies } from "../src/utils/extractCookies.js";

describe("extractCookies", () => {
  it("should extract cookies", () => {
    const result = extractCookies('curl -b "key=value" https://example.com');
    expect(result).toEqual({ key: "value" });
  });

  it("should extract multiple cookies separated by semicolon", () => {
    const result = extractCookies(
      'curl -b "sessionId=abc123; userId=789" https://example.com'
    );
    expect(result).toEqual({ sessionId: "abc123", userId: "789" });
  });

  it("should handle --cookie flag", () => {
    const result = extractCookies(
      'curl --cookie "key=value" https://example.com'
    );
    expect(result).toEqual({ key: "value" });
  });

  it("should handle cookie without value", () => {
    const result = extractCookies('curl -b "key" https://example.com');
    expect(result).toEqual({ key: "" });
  });

  it("should handle cookies with spaces", () => {
    const result = extractCookies(
      'curl -b "sessionId=abc 123; userId=789" https://example.com'
    );
    expect(result).toEqual({ sessionId: "abc 123", userId: "789" });
  });

  it("should handle cookies with special characters", () => {
    const result = extractCookies(
      'curl -b "key=value@#$%^&*()" https://example.com'
    );
    expect(result).toEqual({ key: "value@#$%^&*()" });
  });

  it("should handle cookies with colons", () => {
    const result = extractCookies(
      'curl -b "timestamp=2024-01-01T12:00:00Z" https://example.com'
    );
    expect(result).toEqual({ timestamp: "2024-01-01T12:00:00Z" });
  });

  it("should handle cookies with equals signs in value", () => {
    const result = extractCookies(
      'curl -b "key=value=more" https://example.com'
    );
    expect(result).toEqual({ key: "value=more" });
  });

  it("should handle multiple cookie flags", () => {
    const result = extractCookies(
      'curl -b "key1=value1" -b "key2=value2" https://example.com'
    );
    expect(result).toEqual({ key1: "value1", key2: "value2" });
  });

  it("should merge cookies from multiple flags", () => {
    const result = extractCookies(
      'curl -b "key1=value1" -b "key2=value2; key3=value3" https://example.com'
    );
    expect(result).toEqual({
      key1: "value1",
      key2: "value2",
      key3: "value3",
    });
  });

  it("should handle cookies with empty values", () => {
    const result = extractCookies(
      'curl -b "key1=; key2=value2" https://example.com'
    );
    expect(result).toEqual({ key1: "", key2: "value2" });
  });

  it("should handle cookies with extra semicolons", () => {
    const result = extractCookies(
      'curl -b "key1=value1;; key2=value2" https://example.com'
    );
    expect(result).toEqual({ key1: "value1", key2: "value2" });
  });

  it("should handle cookies with spaces around semicolons", () => {
    const result = extractCookies(
      'curl -b "key1=value1 ; key2=value2" https://example.com'
    );
    expect(result).toEqual({ key1: "value1", key2: "value2" });
  });

  it("should skip URLs in cookie values", () => {
    const result = extractCookies(
      'curl -b "https://example.com" https://api.example.com'
    );
    expect(result).toEqual({});
  });

  it("should handle empty cookie flag", () => {
    const result = extractCookies("curl -b https://example.com");
    expect(result).toEqual({});
  });

  it("should handle empty cookie string", () => {
    const result = extractCookies('curl -b "" https://example.com');
    expect(result).toEqual({});
  });

  it("should return empty object when no cookies", () => {
    const result = extractCookies("curl https://example.com");
    expect(result).toEqual({});
  });

  it("should handle empty string", () => {
    const result = extractCookies("");
    expect(result).toEqual({});
  });

  it("should handle non-string input", () => {
    // @ts-expect-error
    const result = extractCookies(null);
    expect(result).toEqual({});
    // @ts-expect-error
    const result2 = extractCookies(undefined);
    expect(result2).toEqual({});
    // @ts-expect-error
    const result3 = extractCookies(123);
    expect(result3).toEqual({});
  });

  it("should handle pre-tokenized command", () => {
    const tokens = ["curl", "-b", "key=value"];
    const result = extractCookies("", tokens);
    expect(result).toEqual({ key: "value" });
  });
});
