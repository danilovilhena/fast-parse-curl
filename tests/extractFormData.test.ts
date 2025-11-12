import { describe, it, expect } from "bun:test";
import { extractFormData } from "../src/utils/extractFormData.js";

describe("extractFormData", () => {
  it("should extract form data", () => {
    const result = extractFormData('curl -F "key=value" https://example.com');
    expect(result).toEqual({ key: "value" });
  });

  it("should extract form data with --form flag", () => {
    const result = extractFormData(
      'curl --form "key=value" https://example.com'
    );
    expect(result).toEqual({ key: "value" });
  });

  it("should extract multiple form fields", () => {
    const result = extractFormData(
      'curl -F "key1=value1" -F "key2=value2" https://example.com'
    );
    expect(result).toEqual({ key1: "value1", key2: "value2" });
  });

  it("should handle file uploads", () => {
    const result = extractFormData(
      'curl -F "file=@/path/to/file.jpg" https://example.com'
    );
    expect(result).toEqual({ file: "@/path/to/file.jpg" });
  });

  it("should handle form field without value", () => {
    const result = extractFormData('curl -F "key" https://example.com');
    expect(result).toEqual({ key: "" });
  });

  it("should handle form fields with special characters", () => {
    const result = extractFormData(
      'curl -F "key=value@#$%^&*()" https://example.com'
    );
    expect(result).toEqual({ key: "value@#$%^&*()" });
  });

  it("should handle form fields with spaces", () => {
    const result = extractFormData(
      'curl -F "key=value with spaces" https://example.com'
    );
    expect(result).toEqual({ key: "value with spaces" });
  });

  it("should handle form fields with colons", () => {
    const result = extractFormData(
      'curl -F "timestamp=2024-01-01T12:00:00Z" https://example.com'
    );
    expect(result).toEqual({ timestamp: "2024-01-01T12:00:00Z" });
  });

  it("should handle form fields with equals signs in value", () => {
    const result = extractFormData(
      'curl -F "key=value=more" https://example.com'
    );
    expect(result).toEqual({ key: "value=more" });
  });

  it("should handle form fields with single quotes", () => {
    const result = extractFormData(
      "curl -F 'key=value' https://example.com"
    );
    expect(result).toEqual({ key: "value" });
  });

  it("should skip URLs in form values", () => {
    const result = extractFormData(
      'curl -F "key=https://example.com" https://api.example.com'
    );
    expect(result).toEqual({});
  });

  it("should handle empty form flag", () => {
    const result = extractFormData("curl -F https://example.com");
    expect(result).toEqual({});
  });

  it("should handle empty form value", () => {
    const result = extractFormData('curl -F "" https://example.com');
    expect(result).toEqual({});
  });

  it("should handle form field with only equals sign", () => {
    const result = extractFormData('curl -F "=" https://example.com');
    expect(result).toEqual({});
  });

  it("should return empty object when no form data", () => {
    const result = extractFormData("curl https://example.com");
    expect(result).toEqual({});
  });

  it("should handle empty string", () => {
    const result = extractFormData("");
    expect(result).toEqual({});
  });

  it("should handle non-string input", () => {
    // @ts-expect-error
    const result = extractFormData(null);
    expect(result).toEqual({});
    // @ts-expect-error
    const result2 = extractFormData(undefined);
    expect(result2).toEqual({});
    // @ts-expect-error
    const result3 = extractFormData(123);
    expect(result3).toEqual({});
  });

  it("should handle pre-tokenized command", () => {
    const tokens = ["curl", "-F", "key=value"];
    const result = extractFormData("", tokens);
    expect(result).toEqual({ key: "value" });
  });
});
