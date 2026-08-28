import { initializeApp, cert } from "firebase-admin";

// Production: pass the full service-account JSON (or base64 of it) in the
// FIREBASE_SERVICE_ACCOUNT env var. Local dev: falls back to the local
// serviceAccountKey.json file (gitignored).
const getServiceAccount = async () => {
    const raw = process.env.FIREBASE_SERVICE_ACCOUNT;
    if (raw && raw.trim()) {
        const value = raw.trim();
        if (value.startsWith("{")) {
            return JSON.parse(value);
        }
        return JSON.parse(Buffer.from(value, "base64").toString("utf8"));
    }
    // local dev fallback — file only exists on your machine
    const module = await import("../serviceAccountKey.json", { with: { type: "json" } });
    return module.default;
};

const serviceAccount = await getServiceAccount();

export const app = initializeApp({
  credential: cert(serviceAccount)
});
