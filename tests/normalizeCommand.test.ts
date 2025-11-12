import { describe, it, expect } from "bun:test";
import { normalizeCommand } from "../src/utils/normalizeCommand.js";

describe("normalizeCommand", () => {
  it("should normalize line continuations", () => {
    const result = normalizeCommand('curl \\\n-H "Header: value"');
    expect(result).toBe('curl -H "Header: value"');
  });

  it("should normalize line continuations with Windows line endings", () => {
    const result = normalizeCommand('curl \\\r\n-H "Header: value"');
    expect(result).toBe('curl -H "Header: value"');
  });

  it("should normalize multiple line continuations", () => {
    const result = normalizeCommand(
      'curl \\\n-H "Header: value" \\\n-d "data"'
    );
    expect(result).toBe('curl -H "Header: value" -d "data"');
  });

  it("should normalize multiple spaces", () => {
    const result = normalizeCommand("curl    https://example.com");
    expect(result).toBe("curl https://example.com");
  });

  it("should normalize tabs", () => {
    const result = normalizeCommand("curl\t\thttps://example.com");
    expect(result).toBe("curl https://example.com");
  });

  it("should normalize mixed whitespace", () => {
    const result = normalizeCommand("curl \t \t https://example.com");
    expect(result).toBe("curl https://example.com");
  });

  it("should trim whitespace", () => {
    const result = normalizeCommand("  curl https://example.com  ");
    expect(result).toBe("curl https://example.com");
  });

  it("should trim leading whitespace", () => {
    const result = normalizeCommand("   curl https://example.com");
    expect(result).toBe("curl https://example.com");
  });

  it("should trim trailing whitespace", () => {
    const result = normalizeCommand("curl https://example.com   ");
    expect(result).toBe("curl https://example.com");
  });

  it("should handle empty string", () => {
    const result = normalizeCommand("");
    expect(result).toBe("");
  });

  it("should handle whitespace only", () => {
    const result = normalizeCommand("   \t  ");
    expect(result).toBe("");
  });

  it("should handle command with only line continuation", () => {
    const result = normalizeCommand("curl \\\n");
    expect(result).toBe("curl");
  });

  it("should handle multiple consecutive line continuations", () => {
    const result = normalizeCommand("curl \\\n\\\n-H header");
    expect(result).toBe("curl -H header");
  });

  it("should preserve single spaces", () => {
    const result = normalizeCommand("curl https://example.com");
    expect(result).toBe("curl https://example.com");
  });

  it("should handle non-string input", () => {
    // @ts-expect-error
    const result = normalizeCommand(null);
    expect(result).toBe("");
    // @ts-expect-error
    const result2 = normalizeCommand(undefined);
    expect(result2).toBe("");
    // @ts-expect-error
    const result3 = normalizeCommand(123);
    expect(result3).toBe("");
  });

  it("should handle complex multi-line command", () => {
    const cmd = `curl \\
    -X POST \\
    -H "Content-Type: application/json" \\
    -d '{"key":"value"}' \\
    https://example.com`;
    const result = normalizeCommand(cmd);
    expect(result).toBe(
      'curl -X POST -H "Content-Type: application/json" -d \'{"key":"value"}\' https://example.com'
    );
  });
});
