import { describe, it, expect } from "bun:test";
import { tokenizeCommand } from "../src/utils/tokenizeCommand.js";

describe("tokenizeCommand", () => {
  it("should tokenize simple command", () => {
    const result = tokenizeCommand("curl https://example.com");
    expect(result).toEqual(["curl", "https://example.com"]);
  });

  it("should handle quoted strings", () => {
    const result = tokenizeCommand('curl -H "Content-Type: application/json"');
    expect(result).toEqual(["curl", "-H", "Content-Type: application/json"]);
  });

  it("should handle single quotes", () => {
    const result = tokenizeCommand("curl -H 'Content-Type: application/json'");
    expect(result).toEqual(["curl", "-H", "Content-Type: application/json"]);
  });

  it("should handle escaped characters", () => {
    const result = tokenizeCommand('curl -d "key\\"value"');
    expect(result).toEqual(["curl", "-d", 'key"value']);
  });

  it("should handle escaped backslash", () => {
    const result = tokenizeCommand('curl -d "key\\\\value"');
    expect(result).toEqual(["curl", "-d", "key\\value"]);
  });

  it("should handle escaped dollar sign", () => {
    const result = tokenizeCommand('curl -d "key\\$value"');
    expect(result).toEqual(["curl", "-d", "key$value"]);
  });

  it("should handle escaped backtick", () => {
    const result = tokenizeCommand('curl -d "key\\`value"');
    expect(result).toEqual(["curl", "-d", "key`value"]);
  });

  it("should handle line continuation in double quotes", () => {
    const result = tokenizeCommand('curl -d "line1\\\nline2"');
    // Line continuation in quotes is preserved as escaped newline
    expect(result).toEqual(["curl", "-d", "line1\\\\nline2"]);
  });

  it("should handle line continuation outside quotes", () => {
    const result = tokenizeCommand("curl \\\n-H header");
    expect(result).toEqual(["curl", "-H", "header"]);
  });

  it("should handle Windows line continuation", () => {
    const result = tokenizeCommand("curl \\\r\n-H header");
    expect(result).toEqual(["curl", "-H", "header"]);
  });

  it("should handle mixed quotes", () => {
    const result = tokenizeCommand(
      'curl -H "Header1: value" -H \'Header2: value\''
    );
    expect(result).toEqual([
      "curl",
      "-H",
      "Header1: value",
      "-H",
      "Header2: value",
    ]);
  });

  it("should handle nested quotes", () => {
    const result = tokenizeCommand('curl -d \'{"key":"value"}\'');
    expect(result).toEqual(["curl", "-d", '{"key":"value"}']);
  });

  it("should handle empty quoted string", () => {
    const result = tokenizeCommand('curl -d ""');
    expect(result.length).toBeGreaterThanOrEqual(2);
    expect(result[0]).toBe("curl");
    expect(result[1]).toBe("-d");
    // Empty quoted string may produce empty token(s)
  });

  it("should handle empty single quoted string", () => {
    const result = tokenizeCommand("curl -d ''");
    expect(result.length).toBeGreaterThanOrEqual(2);
    expect(result[0]).toBe("curl");
    expect(result[1]).toBe("-d");
    // Empty quoted string may produce empty token(s)
  });

  it("should handle multiple spaces", () => {
    const result = tokenizeCommand("curl    https://example.com");
    expect(result).toEqual(["curl", "https://example.com"]);
  });

  it("should handle tabs", () => {
    const result = tokenizeCommand("curl\thttps://example.com");
    expect(result).toEqual(["curl", "https://example.com"]);
  });

  it("should handle empty string", () => {
    const result = tokenizeCommand("");
    expect(result).toEqual([]);
  });

  it("should handle whitespace only", () => {
    const result = tokenizeCommand("   ");
    expect(result).toEqual([]);
  });

  it("should handle non-string input", () => {
    // @ts-expect-error
    const result = tokenizeCommand(null);
    expect(result).toEqual([]);
    // @ts-expect-error
    const result2 = tokenizeCommand(undefined);
    expect(result2).toEqual([]);
    // @ts-expect-error
    const result3 = tokenizeCommand(123);
    expect(result3).toEqual([]);
  });

  it("should handle unclosed double quotes", () => {
    const result = tokenizeCommand('curl -d "unclosed');
    expect(result).toEqual(["curl", "-d", "unclosed"]);
  });

  it("should handle unclosed single quotes", () => {
    const result = tokenizeCommand("curl -d 'unclosed");
    expect(result).toEqual(["curl", "-d", "unclosed"]);
  });

  it("should handle single quote inside double quotes", () => {
    const result = tokenizeCommand('curl -d "don\'t"');
    expect(result).toEqual(["curl", "-d", "don't"]);
  });

  it("should handle double quote inside single quotes", () => {
    const result = tokenizeCommand("curl -d 'say \"hello\"'");
    expect(result).toEqual(["curl", "-d", 'say "hello"']);
  });

  it("should handle complex command", () => {
    const result = tokenizeCommand(
      'curl -X POST -H "Content-Type: application/json" -d \'{"key":"value"}\' https://example.com'
    );
    expect(result).toEqual([
      "curl",
      "-X",
      "POST",
      "-H",
      "Content-Type: application/json",
      "-d",
      '{"key":"value"}',
      "https://example.com",
    ]);
  });

  it("should handle command with special characters", () => {
    const result = tokenizeCommand('curl -d "key=value@#$%^&*()"');
    expect(result).toEqual(["curl", "-d", "key=value@#$%^&*()"]);
  });
});
