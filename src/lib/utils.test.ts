import { describe, it, expect } from "vitest";
import { cn } from "./utils";

describe("cn", () => {
  it("returns a single class unchanged", () => {
    expect(cn("foo")).toBe("foo");
  });

  it("joins multiple class strings", () => {
    expect(cn("foo", "bar")).toBe("foo bar");
  });

  it("filters out falsy values", () => {
    expect(cn("foo", false, undefined, null, "bar")).toBe("foo bar");
  });

  it("handles conditional object syntax from clsx", () => {
    expect(cn({ foo: true, bar: false, baz: true })).toBe("foo baz");
  });

  it("deduplicates conflicting Tailwind classes (twMerge)", () => {
    // twMerge resolves conflicts: the last of conflicting utilities wins
    expect(cn("p-2", "p-4")).toBe("p-4");
    expect(cn("text-red-500", "text-blue-500")).toBe("text-blue-500");
  });

  it("handles arrays of classes via clsx", () => {
    expect(cn(["foo", "bar"], "baz")).toBe("foo bar baz");
  });

  it("returns empty string when no classes provided", () => {
    expect(cn()).toBe("");
  });

  it("merges conditional classes with Tailwind deduplication", () => {
    const isActive = true;
    const result = cn("px-2 py-1 text-sm", isActive && "bg-blue-500 text-white", "text-gray-900");
    // text-white and text-gray-900 conflict; text-gray-900 wins
    expect(result).toContain("bg-blue-500");
    expect(result).toContain("text-gray-900");
    expect(result).not.toContain("text-white");
  });
});
