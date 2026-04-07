import { createCipheriv, createDecipheriv, randomBytes, scryptSync } from "crypto";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 16;
const SALT = "lafondation-v1";
const KEY_LENGTH = 32;

function getKey(): Buffer {
  const secret = process.env.ENCRYPTION_MASTER_KEY;
  if (!secret || secret.length < 32) {
    throw new Error(
      "ENCRYPTION_MASTER_KEY must be set to a strong secret (min 32 characters)."
    );
  }
  return scryptSync(secret, SALT, KEY_LENGTH);
}

export type FinancialPayload = {
  cardNumber: string;
  nameOnCard: string;
  cvc: string;
  expiry: string;
  accountPin: string;
};

export function encryptFinancialPayload(payload: FinancialPayload): {
  ciphertext: string;
  iv: string;
  authTag: string;
} {
  const key = getKey();
  const iv = randomBytes(IV_LENGTH);
  const cipher = createCipheriv(ALGORITHM, key, iv);
  const json = JSON.stringify(payload);
  const encrypted = Buffer.concat([cipher.update(json, "utf8"), cipher.final()]);
  const authTag = cipher.getAuthTag();
  return {
    ciphertext: encrypted.toString("base64"),
    iv: iv.toString("base64"),
    authTag: authTag.toString("base64"),
  };
}

export function decryptFinancialPayload(parts: {
  ciphertext: string;
  iv: string;
  authTag: string;
}): FinancialPayload {
  const key = getKey();
  const iv = Buffer.from(parts.iv, "base64");
  const authTag = Buffer.from(parts.authTag, "base64");
  const encrypted = Buffer.from(parts.ciphertext, "base64");
  const decipher = createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(authTag);
  const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);
  return JSON.parse(decrypted.toString("utf8")) as FinancialPayload;
}

export function encryptText(value: string): string {
  const key = getKey();
  const iv = randomBytes(IV_LENGTH);
  const cipher = createCipheriv(ALGORITHM, key, iv);
  const encrypted = Buffer.concat([cipher.update(value, "utf8"), cipher.final()]);
  const authTag = cipher.getAuthTag();
  return `${iv.toString("base64")}:${authTag.toString("base64")}:${encrypted.toString("base64")}`;
}

export function decryptText(value: string): string {
  const [ivPart, authTagPart, encryptedPart] = value.split(":");
  if (!ivPart || !authTagPart || !encryptedPart) {
    throw new Error("Encrypted text has invalid format.");
  }
  const key = getKey();
  const iv = Buffer.from(ivPart, "base64");
  const authTag = Buffer.from(authTagPart, "base64");
  const encrypted = Buffer.from(encryptedPart, "base64");
  const decipher = createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(authTag);
  const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);
  return decrypted.toString("utf8");
}
