import { describe, it, expect } from "bun:test";
import { extractMethod } from "../src/utils/extractMethod.js";

describe("extractMethod", () => {
  it("should extract method from -X flag", () => {
    const result = extractMethod("curl -X POST https://example.com");
    expect(result).toBe("POST");
  });

  it("should extract method from --request flag", () => {
    const result = extractMethod("curl --request PUT https://example.com");
    expect(result).toBe("PUT");
  });

  it("should infer POST from data flag", () => {
    const result = extractMethod('curl -d "data" https://example.com');
    expect(result).toBe("POST");
  });

  it("should default to GET", () => {
    const result = extractMethod("curl https://example.com");
    expect(result).toBe("GET");
  });

  it("should handle all HTTP methods", () => {
    expect(extractMethod("curl -X GET https://example.com")).toBe("GET");
    expect(extractMethod("curl -X POST https://example.com")).toBe("POST");
    expect(extractMethod("curl -X PUT https://example.com")).toBe("PUT");
    expect(extractMethod("curl -X DELETE https://example.com")).toBe("DELETE");
    expect(extractMethod("curl -X PATCH https://example.com")).toBe("PATCH");
    expect(extractMethod("curl -X HEAD https://example.com")).toBe("HEAD");
    expect(extractMethod("curl -X OPTIONS https://example.com")).toBe(
      "OPTIONS"
    );
    expect(extractMethod("curl -X TRACE https://example.com")).toBe("TRACE");
    expect(extractMethod("curl -X CONNECT https://example.com")).toBe(
      "CONNECT"
    );
  });

  it("should handle lowercase method names", () => {
    const result = extractMethod("curl -X post https://example.com");
    expect(result).toBe("POST");
  });

  it("should handle mixed case method names", () => {
    const result = extractMethod("curl -X PoSt https://example.com");
    expect(result).toBe("POST");
  });

  it("should use last method when multiple specified", () => {
    const result = extractMethod("curl -X POST -X PUT https://example.com");
    expect(result).toBe("PUT");
  });

  it("should use last method with mixed flags", () => {
    const result = extractMethod(
      "curl -X POST --request DELETE https://example.com"
    );
    expect(result).toBe("DELETE");
  });

  it("should ignore invalid method and default to GET", () => {
    const result = extractMethod("curl -X INVALID https://example.com");
    expect(result).toBe("GET");
  });

  it("should ignore invalid method but still infer POST from data", () => {
    const result = extractMethod(
      'curl -X INVALID -d "data" https://example.com'
    );
    expect(result).toBe("POST");
  });

  it("should infer POST from --data flag", () => {
    const result = extractMethod('curl --data "data" https://example.com');
    expect(result).toBe("POST");
  });

  it("should infer POST from --data-raw flag", () => {
    const result = extractMethod('curl --data-raw "data" https://example.com');
    expect(result).toBe("POST");
  });

  it("should infer POST from --data-binary flag", () => {
    const result = extractMethod(
      'curl --data-binary "data" https://example.com'
    );
    expect(result).toBe("POST");
  });

  it("should infer POST from --data-urlencode flag", () => {
    const result = extractMethod(
      'curl --data-urlencode "data" https://example.com'
    );
    expect(result).toBe("POST");
  });

  it("should infer POST from --data-ascii flag", () => {
    const result = extractMethod(
      'curl --data-ascii "data" https://example.com'
    );
    expect(result).toBe("POST");
  });

  it("should prioritize explicit method over data flag", () => {
    const result = extractMethod('curl -X PUT -d "data" https://example.com');
    expect(result).toBe("PUT");
  });

  it("should handle method flag without value", () => {
    const result = extractMethod("curl -X https://example.com");
    expect(result).toBe("GET");
  });

  it("should handle empty string", () => {
    const result = extractMethod("");
    expect(result).toBe("GET");
  });

  it("should handle command with only curl", () => {
    const result = extractMethod("curl");
    expect(result).toBe("GET");
  });

  it("should handle non-string input", () => {
    // @ts-expect-error
    const result = extractMethod(null);
    expect(result).toBe("GET");
    // @ts-expect-error
    const result2 = extractMethod(undefined);
    expect(result2).toBe("GET");
    // @ts-expect-error
    const result3 = extractMethod(123);
    expect(result3).toBe("GET");
  });

  it("should handle pre-tokenized command", () => {
    const tokens = ["curl", "-X", "POST"];
    const result = extractMethod("", tokens);
    expect(result).toBe("POST");
  });
});
