import { Router, type IRouter, type Request, type Response } from "express";
import { AdminLoginBody } from "@workspace/api-zod";
import {
  ADMIN_COOKIE_NAME,
  ADMIN_COOKIE_MAX_AGE_MS,
  checkPassword,
  createSessionToken,
  isValidSessionToken,
} from "../lib/adminAuth";

const router: IRouter = Router();

router.post("/auth/login", (req: Request, res: Response) => {
  const parsed = AdminLoginBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Missing or invalid password" });
    return;
  }

  if (!checkPassword(parsed.data.password)) {
    res.status(401).json({ error: "Invalid password" });
    return;
  }

  const token = createSessionToken();
  res.cookie(ADMIN_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: ADMIN_COOKIE_MAX_AGE_MS,
  });
  res.json({ authenticated: true });
});

router.post("/auth/logout", (_req: Request, res: Response) => {
  res.clearCookie(ADMIN_COOKIE_NAME);
  res.json({ authenticated: false });
});

router.get("/auth/me", (req: Request, res: Response) => {
  const token = req.cookies?.[ADMIN_COOKIE_NAME];
  res.json({ authenticated: isValidSessionToken(token) });
});

export default router;
