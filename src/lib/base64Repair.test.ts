import { describe, it, expect } from "vitest";
import { repairBase64 } from "./base64Repair";

// Helpers
const encode = (str: string) => btoa(str);

describe("repairBase64", () => {
  describe("valid inputs", () => {
    it("decodes a clean standard base64 string", () => {
      const result = repairBase64(encode("hello world"));
      expect(result.ok).toBe(true);
      expect(result.warnings).toHaveLength(0);
      expect(result.repaired).toBe(encode("hello world"));
    });

    it("returns UTF-8 text when returnUtf8Text is true", () => {
      const result = repairBase64(encode("hello world"), { returnUtf8Text: true });
      expect(result.ok).toBe(true);
      expect(result.textUtf8).toBe("hello world");
    });

    it("decodes a longer payload without warnings", () => {
      const payload = "The quick brown fox jumps over the lazy dog";
      const result = repairBase64(encode(payload), { returnUtf8Text: true });
      expect(result.ok).toBe(true);
      expect(result.textUtf8).toBe(payload);
    });
  });

  describe("whitespace handling", () => {
    it("strips whitespace inside the string", () => {
      const b64 = encode("hello");
      const withSpaces = b64.slice(0, 4) + " \n " + b64.slice(4);
      const result = repairBase64(withSpaces, { returnUtf8Text: true });
      expect(result.ok).toBe(true);
      expect(result.textUtf8).toBe("hello");
    });
  });

  describe("surrounding quotes", () => {
    it("removes double quotes and warns", () => {
      const result = repairBase64(`"${encode("test")}"`, { returnUtf8Text: true });
      expect(result.ok).toBe(true);
      expect(result.textUtf8).toBe("test");
      expect(result.warnings).toContain("Removed surrounding quotes.");
    });

    it("removes single quotes and warns", () => {
      const result = repairBase64(`'${encode("test")}'`, { returnUtf8Text: true });
      expect(result.ok).toBe(true);
      expect(result.textUtf8).toBe("test");
      expect(result.warnings).toContain("Removed surrounding quotes.");
    });
  });

  describe("URL-encoded input", () => {
    it("decodes percent-encoded base64 and warns", () => {
      const b64 = encode("url encoded test");
      const urlEncoded = encodeURIComponent(b64);
      const result = repairBase64(urlEncoded, { returnUtf8Text: true });
      expect(result.ok).toBe(true);
      expect(result.textUtf8).toBe("url encoded test");
      expect(result.warnings).toContain("Applied decodeURIComponent.");
    });
  });

  describe("base64url variant", () => {
    it("converts base64url (- and _) to standard base64 and warns", () => {
      // Craft a base64url string: replace + with - and / with _
      const standard = encode("\xFB\xFF"); // bytes that produce +/ in base64
      const urlVariant = standard.replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
      const result = repairBase64(urlVariant);
      expect(result.ok).toBe(true);
      expect(result.variant).toBe("url");
      expect(result.warnings).toContain("Converted base64url to standard base64.");
    });
  });

  describe("padding repair", () => {
    it("adds == padding when mod 4 is 2", () => {
      const b64 = encode("ab"); // "YWI=" (valid), strip = to force repair
      const stripped = b64.replace(/=/g, "");
      const result = repairBase64(stripped, { returnUtf8Text: true });
      expect(result.ok).toBe(true);
      expect(result.textUtf8).toBe("ab");
    });

    it("adds = padding when mod 4 is 3", () => {
      const b64 = encode("abc"); // "YWJj" (no padding needed; use "abcd" which needs =)
      // "abcde" encodes to "YWJjZGU=" - strip to "YWJjZGU" (mod 4 == 3)
      const stripped = encode("abcde").replace(/=/g, "");
      const result = repairBase64(stripped, { returnUtf8Text: true });
      expect(result.ok).toBe(true);
      expect(result.textUtf8).toBe("abcde");
      expect(result.warnings).toContain("Added '=' padding.");
    });

    it("removes stray = in the middle and warns", () => {
      const b64 = encode("test");
      // Insert a = in the middle
      const stray = b64.slice(0, 3) + "=" + b64.slice(3);
      const result = repairBase64(stray, { returnUtf8Text: true });
      expect(result.ok).toBe(true);
      expect(result.warnings).toContain("Removed stray '=' padding characters.");
      expect(result.textUtf8).toBe("test");
    });
  });

  describe("data URI handling", () => {
    it("strips data URI prefix, repairs payload, and warns", () => {
      const dataUri = `data:text/plain;base64,${encode("data uri content")}`;
      const result = repairBase64(dataUri, { returnUtf8Text: true });
      expect(result.ok).toBe(true);
      expect(result.dataUriPrefix).toBe("data:text/plain;base64,");
      expect(result.textUtf8).toBe("data uri content");
      expect(result.warnings).toContain("Detected data URI; repaired payload only.");
    });

    it("handles image data URIs", () => {
      const dataUri = `data:image/png;base64,${encode("fake png bytes")}`;
      const result = repairBase64(dataUri, { returnUtf8Text: true });
      expect(result.ok).toBe(true);
      expect(result.dataUriPrefix).toBe("data:image/png;base64,");
    });
  });

  describe("error cases", () => {
    it("returns ok:false for empty string", () => {
      const result = repairBase64("");
      expect(result.ok).toBe(false);
      expect(result.error).toBe("Empty input.");
      expect(result.repaired).toBe("");
    });

    it("returns ok:false for whitespace-only input", () => {
      const result = repairBase64("   \n\t  ");
      expect(result.ok).toBe(false);
      expect(result.error).toBe("Empty input.");
    });

    it("handles completely invalid base64 gracefully", () => {
      // Characters that can't be repaired at all - all non-base64, non-decodable
      const result = repairBase64("!!!###$$$");
      // After stripping non-base64 chars the string becomes empty or undecodable
      // The function should not throw
      expect(typeof result.ok).toBe("boolean");
    });
  });

  describe("return shape", () => {
    it("always returns variant field", () => {
      const result = repairBase64(encode("x"));
      expect(result.variant).toMatch(/^(standard|url)$/);
    });

    it("always returns warnings array", () => {
      const result = repairBase64(encode("x"));
      expect(Array.isArray(result.warnings)).toBe(true);
    });

    it("returns bytes when successful", () => {
      const result = repairBase64(encode("hello"));
      expect(result.ok).toBe(true);
      expect(result.bytes).toBeInstanceOf(Uint8Array);
      expect(result.bytes!.length).toBeGreaterThan(0);
    });

    it("does not return textUtf8 when returnUtf8Text is not set", () => {
      const result = repairBase64(encode("hello"));
      expect(result.textUtf8).toBeUndefined();
    });
  });
});
