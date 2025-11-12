import { describe, it, expect } from "bun:test";
import { extractOptions } from "../src/utils/extractOptions.js";

describe("extractOptions", () => {
  it("should extract compressed option", () => {
    const result = extractOptions("curl --compressed https://example.com");
    expect(result.compressed).toBe(true);
    expect(result.followRedirects).toBe(false);
    expect(result.insecure).toBe(false);
    expect(result.verbose).toBe(false);
    expect(result.timeout).toBeNull();
    expect(result.connectTimeout).toBeNull();
  });

  it("should extract insecure option with --insecure", () => {
    const result = extractOptions("curl --insecure https://example.com");
    expect(result.insecure).toBe(true);
  });

  it("should extract insecure option with -k", () => {
    const result = extractOptions("curl -k https://example.com");
    expect(result.insecure).toBe(true);
  });

  it("should extract followRedirects with --location", () => {
    const result = extractOptions("curl --location https://example.com");
    expect(result.followRedirects).toBe(true);
  });

  it("should extract followRedirects with -L", () => {
    const result = extractOptions("curl -L https://example.com");
    expect(result.followRedirects).toBe(true);
  });

  it("should extract verbose with --verbose", () => {
    const result = extractOptions("curl --verbose https://example.com");
    expect(result.verbose).toBe(true);
  });

  it("should extract verbose with -v", () => {
    const result = extractOptions("curl -v https://example.com");
    expect(result.verbose).toBe(true);
  });

  it("should extract timeout with --max-time", () => {
    const result = extractOptions("curl --max-time 30 https://example.com");
    expect(result.timeout).toBe(30);
  });

  it("should extract timeout with decimal value", () => {
    const result = extractOptions("curl --max-time 30.5 https://example.com");
    expect(result.timeout).toBe(30);
  });

  it("should handle invalid timeout value", () => {
    const result = extractOptions(
      "curl --max-time invalid https://example.com"
    );
    expect(result.timeout).toBeNull();
  });

  it("should handle missing timeout value", () => {
    const result = extractOptions("curl --max-time https://example.com");
    expect(result.timeout).toBeNull();
  });

  it("should extract connectTimeout with --connect-timeout", () => {
    const result = extractOptions(
      "curl --connect-timeout 10 https://example.com"
    );
    expect(result.connectTimeout).toBe(10);
  });

  it("should handle invalid connectTimeout value", () => {
    const result = extractOptions(
      "curl --connect-timeout invalid https://example.com"
    );
    expect(result.connectTimeout).toBeNull();
  });

  it("should handle missing connectTimeout value", () => {
    const result = extractOptions("curl --connect-timeout https://example.com");
    expect(result.connectTimeout).toBeNull();
  });

  it("should extract multiple options", () => {
    const result = extractOptions(
      "curl --compressed --insecure --location --verbose --max-time 60 --connect-timeout 5 https://example.com"
    );
    expect(result.compressed).toBe(true);
    expect(result.insecure).toBe(true);
    expect(result.followRedirects).toBe(true);
    expect(result.verbose).toBe(true);
    expect(result.timeout).toBe(60);
    expect(result.connectTimeout).toBe(5);
  });

  it("should handle mixed short and long flags", () => {
    const result = extractOptions(
      "curl -k -L -v --compressed https://example.com"
    );
    expect(result.insecure).toBe(true);
    expect(result.followRedirects).toBe(true);
    expect(result.verbose).toBe(true);
    expect(result.compressed).toBe(true);
  });

  it("should return default options when no options specified", () => {
    const result = extractOptions("curl https://example.com");
    expect(result.followRedirects).toBe(false);
    expect(result.insecure).toBe(false);
    expect(result.compressed).toBe(false);
    expect(result.verbose).toBe(false);
    expect(result.timeout).toBeNull();
    expect(result.connectTimeout).toBeNull();
  });

  it("should handle zero timeout", () => {
    const result = extractOptions("curl --max-time 0 https://example.com");
    expect(result.timeout).toBe(0);
  });

  it("should handle negative timeout", () => {
    const result = extractOptions("curl --max-time -5 https://example.com");
    expect(result.timeout).toBe(-5);
  });

  it("should handle very large timeout", () => {
    const result = extractOptions("curl --max-time 999999 https://example.com");
    expect(result.timeout).toBe(999999);
  });

  it("should handle empty string", () => {
    const result = extractOptions("");
    expect(result.followRedirects).toBe(false);
    expect(result.insecure).toBe(false);
    expect(result.compressed).toBe(false);
    expect(result.verbose).toBe(false);
    expect(result.timeout).toBeNull();
    expect(result.connectTimeout).toBeNull();
  });

  it("should handle non-string input", () => {
    // @ts-expect-error
    const result = extractOptions(null);
    expect(result.followRedirects).toBe(false);
    expect(result.insecure).toBe(false);
    expect(result.compressed).toBe(false);
    expect(result.verbose).toBe(false);
    expect(result.timeout).toBeNull();
    expect(result.connectTimeout).toBeNull();
    // @ts-expect-error
    const result2 = extractOptions(undefined);
    expect(result2.followRedirects).toBe(false);
    // @ts-expect-error
    const result3 = extractOptions(123);
    expect(result3.followRedirects).toBe(false);
  });

  it("should handle pre-tokenized command", () => {
    const tokens = ["curl", "--compressed", "--insecure"];
    const result = extractOptions("", tokens);
    expect(result.compressed).toBe(true);
    expect(result.insecure).toBe(true);
  });
});
