import crypto from "crypto";
import type { NextFunction, Request, Response } from "express";

const COOKIE_NAME = "mpf_admin_session";
const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 7; // 7 days

function getSecret(): string {
  const secret = process.env.ADMIN_PASSWORD;
  if (!secret) {
    throw new Error(
      "ADMIN_PASSWORD must be set. Did you forget to add the secret?",
    );
  }
  return secret;
}

function sign(payload: string, secret: string): string {
  return crypto.createHmac("sha256", secret).update(payload).digest("hex");
}

export function createSessionToken(): string {
  const secret = getSecret();
  const expires = Date.now() + SESSION_TTL_MS;
  const payload = `${expires}`;
  const signature = sign(payload, secret);
  return `${payload}.${signature}`;
}

export function isValidSessionToken(token: string | undefined): boolean {
  if (!token) return false;
  const secret = process.env.ADMIN_PASSWORD;
  if (!secret) return false;
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return false;
  const expected = sign(payload, secret);
  const sigBuf = Buffer.from(signature);
  const expBuf = Buffer.from(expected);
  if (sigBuf.length !== expBuf.length) return false;
  if (!crypto.timingSafeEqual(sigBuf, expBuf)) return false;
  const expires = Number(payload);
  if (Number.isNaN(expires) || Date.now() > expires) return false;
  return true;
}

export function checkPassword(candidate: string): boolean {
  const secret = getSecret();
  const candidateBuf = Buffer.from(candidate);
  const secretBuf = Buffer.from(secret);
  if (candidateBuf.length !== secretBuf.length) return false;
  return crypto.timingSafeEqual(candidateBuf, secretBuf);
}

export const ADMIN_COOKIE_NAME = COOKIE_NAME;
export const ADMIN_COOKIE_MAX_AGE_MS = SESSION_TTL_MS;

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies?.[COOKIE_NAME];
  if (!isValidSessionToken(token)) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  next();
}
