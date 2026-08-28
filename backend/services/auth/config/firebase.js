import { initializeApp, cert } from "firebase-admin";

// Production (Render): set FIREBASE_SERVICE_ACCOUNT_B64 to the base64 of
// serviceAccountKey.json (e.g. `base64 -w0 serviceAccountKey.json`).
// Alternatively FIREBASE_SERVICE_ACCOUNT may hold the raw JSON or its base64
// (auto-detected). Local dev: neither set → falls back to the gitignored
// serviceAccountKey.json file on disk.
//
// NOTE: never log the contents — errors below intentionally print only
// metadata, never the credential material.
const getServiceAccount = async () => {
    // 1) Explicit base64 variable — production-safe, no guessing.
    const b64 = process.env.FIREBASE_SERVICE_ACCOUNT_B64;
    if (b64 && b64.trim()) {
        const cleaned = b64.trim().replace(/\s+/g, "");
        if (!/^[A-Za-z0-9+/]+={0,2}$/.test(cleaned)) {
            throw new Error(
                "FIREBASE_SERVICE_ACCOUNT_B64 is not valid base64. " +
                "Re-generate with: base64 -w0 serviceAccountKey.json — " +
                `received ${cleaned.length} chars.`
            );
        }
        let decoded;
        try {
            decoded = Buffer.from(cleaned, "base64").toString("utf8");
        } catch {
            throw new Error("FIREBASE_SERVICE_ACCOUNT_B64 could not be base64-decoded.");
        }
        try {
            return JSON.parse(decoded);
        } catch {
            throw new Error(
                "FIREBASE_SERVICE_ACCOUNT_B64 decoded to invalid JSON " +
                `(decoded length: ${decoded.length}). The env var was likely ` +
                "truncated or corrupted in the dashboard — re-paste the base64 value."
            );
        }
    }

    // 2) Auto-detect variable: raw JSON or base64.
    const raw = process.env.FIREBASE_SERVICE_ACCOUNT;
    if (raw && raw.trim()) {
        const value = raw.trim().replace(/^["']|["']$/g, "");
        if (value.startsWith("{")) {
            try {
                return JSON.parse(value);
            } catch {
                throw new Error("FIREBASE_SERVICE_ACCOUNT contains invalid JSON.");
            }
        }
        const cleaned = value.replace(/\s+/g, "");
        if (!/^[A-Za-z0-9+/]+={0,2}$/.test(cleaned)) {
            throw new Error(
                "FIREBASE_SERVICE_ACCOUNT is neither JSON nor valid base64 " +
                `(received ${cleaned.length} chars, starts with: ${cleaned.slice(0, 1)}). ` +
                "Use FIREBASE_SERVICE_ACCOUNT_B64 for base64 credentials."
            );
        }
        const decoded = Buffer.from(cleaned, "base64").toString("utf8");
        try {
            return JSON.parse(decoded);
        } catch {
            throw new Error(
                "FIREBASE_SERVICE_ACCOUNT base64-decoded to invalid JSON " +
                `(decoded length: ${decoded.length}). The value was likely ` +
                "truncated or corrupted in the dashboard."
            );
        }
    }

    // 3) Local development fallback — gitignored file on disk only.
    const module = await import("../serviceAccountKey.json", { with: { type: "json" } });
    return module.default;
};

const serviceAccount = await getServiceAccount();

export const app = initializeApp({
  credential: cert(serviceAccount)
});
