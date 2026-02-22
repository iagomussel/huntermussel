export type Base64Variant = "standard" | "url";

export type RepairResult = {
  ok: boolean;
  variant: Base64Variant;
  repaired: string;
  dataUriPrefix?: string;
  bytes?: Uint8Array;
  textUtf8?: string;
  warnings: string[];
  error?: string;
};

const BASE64_RE = /^[A-Za-z0-9+/]*={0,2}$/;

function stripDataUri(input: string): { prefix?: string; payload: string } {
  const m = input.match(/^\s*(data:[^,]+,)(.*)\s*$/i);
  if (!m) return { payload: input.trim() };
  return { prefix: m[1], payload: (m[2] ?? "").trim() };
}

function guessVariant(s: string): Base64Variant {
  return /[-_]/.test(s) ? "url" : "standard";
}

function normalize(input: string): { normalized: string; warnings: string[] } {
  const warnings: string[] = [];
  let s = input.replace(/\s+/g, "");

  if (
    (s.startsWith('"') && s.endsWith('"')) ||
    (s.startsWith("'") && s.endsWith("'"))
  ) {
    s = s.slice(1, -1);
    warnings.push("Removed surrounding quotes.");
  }

  if (/%[0-9A-Fa-f]{2}/.test(s)) {
    try {
      const decoded = decodeURIComponent(s);
      if (decoded !== s) {
        s = decoded.replace(/\s+/g, "");
        warnings.push("Applied decodeURIComponent.");
      }
    } catch {
      warnings.push("decodeURIComponent failed; kept original.");
    }
  }

  return { normalized: s, warnings };
}

function toStandardBase64(
  s: string,
  variant: Base64Variant,
  warnings: string[],
): string {
  let out = s;
  if (variant === "url") {
    out = out.replace(/-/g, "+").replace(/_/g, "/");
    warnings.push("Converted base64url to standard base64.");
  }

  const before = out;
  out = out.replace(/[^A-Za-z0-9+/=]/g, "");
  if (out !== before) warnings.push("Removed non-base64 characters.");
  return out;
}

function fixPadding(s: string, warnings: string[]): string {
  const before = s;
  s = s.replace(/=+(?=.)/g, "");
  if (s !== before) warnings.push("Removed stray '=' padding characters.");

  const mod = s.length % 4;
  if (mod === 1) {
    s = s.slice(0, -1);
    warnings.push("Length mod 4 was 1; trimmed 1 char (best-effort).");
  } else if (mod === 2) {
    s += "==";
    warnings.push("Added '==' padding.");
  } else if (mod === 3) {
    s += "=";
    warnings.push("Added '=' padding.");
  }
  return s;
}

function decodeBase64ToBytes(b64: string): Uint8Array {
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i += 1) bytes[i] = bin.charCodeAt(i);
  return bytes;
}

function encodeBytesToBase64(bytes: Uint8Array): string {
  let bin = "";
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    bin += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  return btoa(bin);
}

export function repairBase64(
  inputRaw: string,
  opts?: { returnUtf8Text?: boolean },
): RepairResult {
  const warnings: string[] = [];

  try {
    const { prefix, payload } = stripDataUri(inputRaw);
    if (prefix) warnings.push("Detected data URI; repaired payload only.");

    const { normalized, warnings: initialWarnings } = normalize(payload);
    warnings.push(...initialWarnings);

    if (!normalized) {
      return {
        ok: false,
        variant: "standard",
        repaired: "",
        dataUriPrefix: prefix,
        warnings,
        error: "Empty input.",
      };
    }

    const variant = guessVariant(normalized);
    let b64 = toStandardBase64(normalized, variant, warnings);
    b64 = fixPadding(b64, warnings);

    if (!BASE64_RE.test(b64)) {
      warnings.push("Regex validation failed; attempting decode anyway.");
    }

    const bytes = decodeBase64ToBytes(b64);
    const canonical = encodeBytesToBase64(bytes);
    if (canonical !== b64) {
      warnings.push("Canonicalized output by re-encoding decoded bytes.");
    }

    const result: RepairResult = {
      ok: true,
      variant,
      repaired: canonical,
      dataUriPrefix: prefix,
      bytes,
      warnings,
    };

    if (opts?.returnUtf8Text) {
      try {
        result.textUtf8 = new TextDecoder("utf-8", { fatal: false }).decode(
          bytes,
        );
      } catch {
        warnings.push("UTF-8 decode failed; bytes preserved.");
      }
    }

    return result;
  } catch (error: unknown) {
    return {
      ok: false,
      variant: "standard",
      repaired: "",
      warnings,
      error:
        error instanceof Error
          ? error.message
          : "Failed to repair/decode base64.",
    };
  }
}
