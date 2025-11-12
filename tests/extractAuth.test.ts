import { describe, it, expect } from "bun:test";
import { extractAuth } from "../src/utils/extractAuth.js";

describe("extractAuth", () => {
  it("should extract basic auth", () => {
    const result = extractAuth("curl -u username:password https://example.com");
    expect(result.type).toBe("basic");
    expect(result.username).toBe("username");
    expect(result.password).toBe("password");
    expect(result.token).toBe("");
  });

  it("should extract auth without password", () => {
    const result = extractAuth("curl -u username https://example.com");
    expect(result.type).toBe("basic");
    expect(result.username).toBe("username");
    expect(result.password).toBe("");
    expect(result.token).toBe("");
  });

  it("should extract auth with --user flag", () => {
    const result = extractAuth(
      "curl --user username:password https://example.com"
    );
    expect(result.type).toBe("basic");
    expect(result.username).toBe("username");
    expect(result.password).toBe("password");
  });

  it("should handle digest auth", () => {
    const result = extractAuth(
      "curl --digest -u username:password https://example.com"
    );
    expect(result.type).toBe("digest");
    expect(result.username).toBe("username");
    expect(result.password).toBe("password");
  });

  it("should handle --basic flag", () => {
    const result = extractAuth(
      "curl --basic -u username:password https://example.com"
    );
    expect(result.type).toBe("basic");
    expect(result.username).toBe("username");
    expect(result.password).toBe("password");
  });

  it("should extract bearer token from Authorization header", () => {
    const result = extractAuth(
      'curl -H "Authorization: Bearer abc123" https://example.com'
    );
    expect(result.type).toBe("bearer");
    expect(result.token).toBe("abc123");
    expect(result.username).toBe("");
    expect(result.password).toBe("");
  });

  it("should extract bearer token with lowercase", () => {
    const result = extractAuth(
      'curl -H "Authorization: bearer token123" https://example.com'
    );
    expect(result.type).toBe("bearer");
    expect(result.token).toBe("token123");
  });

  it("should handle bearer token with extra spaces", () => {
    const result = extractAuth(
      'curl -H "Authorization: Bearer  token123  " https://example.com'
    );
    expect(result.type).toBe("bearer");
    expect(result.token).toBe("token123");
  });

  it("should prioritize bearer token over basic auth", () => {
    const result = extractAuth(
      'curl -u username:password -H "Authorization: Bearer token123" https://example.com'
    );
    expect(result.type).toBe("bearer");
    expect(result.token).toBe("token123");
  });

  it("should handle auth with special characters in username", () => {
    const result = extractAuth(
      "curl -u user@domain.com:password https://example.com"
    );
    expect(result.username).toBe("user@domain.com");
    expect(result.password).toBe("password");
  });

  it("should handle auth with special characters in password", () => {
    const result = extractAuth(
      "curl -u username:p@ssw0rd!@#$ https://example.com"
    );
    expect(result.username).toBe("username");
    expect(result.password).toBe("p@ssw0rd!@#$");
  });

  it("should handle auth with colons in password", () => {
    const result = extractAuth(
      "curl -u username:pass:word https://example.com"
    );
    expect(result.username).toBe("username");
    expect(result.password).toBe("pass:word");
  });

  it("should skip URLs in auth credentials", () => {
    const result = extractAuth(
      "curl -u https://example.com https://api.example.com"
    );
    expect(result.username).toBe("");
    expect(result.password).toBe("");
  });

  it("should handle empty auth flag", () => {
    const result = extractAuth("curl -u https://example.com");
    expect(result.username).toBe("");
    expect(result.password).toBe("");
  });

  it("should handle multiple auth flags", () => {
    const result = extractAuth(
      "curl -u user1:pass1 -u user2:pass2 https://example.com"
    );
    expect(result.username).toBe("user2");
    expect(result.password).toBe("pass2");
  });

  it("should return default auth when no auth specified", () => {
    const result = extractAuth("curl https://example.com");
    expect(result.type).toBe("basic");
    expect(result.username).toBe("");
    expect(result.password).toBe("");
    expect(result.token).toBe("");
  });

  it("should handle empty string", () => {
    const result = extractAuth("");
    expect(result.type).toBe("basic");
    expect(result.username).toBe("");
    expect(result.password).toBe("");
    expect(result.token).toBe("");
  });

  it("should handle non-string input", () => {
    // @ts-expect-error
    const result = extractAuth(null);
    expect(result.type).toBe("basic");
    expect(result.username).toBe("");
    expect(result.password).toBe("");
    expect(result.token).toBe("");
    // @ts-expect-error
    const result2 = extractAuth(undefined);
    expect(result2.type).toBe("basic");
    // @ts-expect-error
    const result3 = extractAuth(123);
    expect(result3.type).toBe("basic");
  });

  it("should handle pre-tokenized command", () => {
    const tokens = ["curl", "-u", "username:password"];
    const result = extractAuth("", tokens);
    expect(result.type).toBe("basic");
    expect(result.username).toBe("username");
    expect(result.password).toBe("password");
  });
});
