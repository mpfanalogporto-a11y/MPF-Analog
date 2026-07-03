import { Router, type IRouter, type Request, type Response } from "express";
import { eq, asc, and, type SQL } from "drizzle-orm";
import { db, photosTable } from "@workspace/db";
import { CreatePhotoBody, UpdatePhotoBody } from "@workspace/api-zod";
import { requireAdmin } from "../lib/adminAuth";

const router: IRouter = Router();

router.get("/photos", async (req: Request, res: Response) => {
  const { memberId, category } = req.query;
  const conditions: SQL[] = [];

  if (typeof memberId === "string" && memberId.length > 0) {
    const numericId = Number(memberId);
    if (!Number.isNaN(numericId)) {
      conditions.push(eq(photosTable.memberId, numericId));
    }
  }
  if (typeof category === "string" && category.length > 0) {
    conditions.push(eq(photosTable.category, category));
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  const photos = whereClause
    ? await db.select().from(photosTable).where(whereClause).orderBy(asc(photosTable.sortOrder), asc(photosTable.id))
    : await db.select().from(photosTable).orderBy(asc(photosTable.sortOrder), asc(photosTable.id));

  res.json(photos);
});

router.post("/photos", requireAdmin, async (req: Request, res: Response) => {
  const parsed = CreatePhotoBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid photo data" });
    return;
  }

  const [created] = await db.insert(photosTable).values(parsed.data).returning();
  res.status(201).json(created);
});

router.patch("/photos/:id", requireAdmin, async (req: Request, res: Response) => {
  const parsed = UpdatePhotoBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid photo data" });
    return;
  }

  const numericId = Number(req.params.id);
  if (Number.isNaN(numericId)) {
    res.status(400).json({ error: "Invalid photo id" });
    return;
  }

  const [updated] = await db
    .update(photosTable)
    .set(parsed.data)
    .where(eq(photosTable.id, numericId))
    .returning();

  if (!updated) {
    res.status(404).json({ error: "Photo not found" });
    return;
  }
  res.json(updated);
});

router.delete("/photos/:id", requireAdmin, async (req: Request, res: Response) => {
  const numericId = Number(req.params.id);
  if (Number.isNaN(numericId)) {
    res.status(400).json({ error: "Invalid photo id" });
    return;
  }

  await db.delete(photosTable).where(eq(photosTable.id, numericId));
  res.json({ authenticated: true });
});

export default router;
