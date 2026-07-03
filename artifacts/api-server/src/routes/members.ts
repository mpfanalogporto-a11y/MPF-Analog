import { Router, type IRouter, type Request, type Response } from "express";
import { eq, or, asc } from "drizzle-orm";
import { db, membersTable } from "@workspace/db";
import { CreateMemberBody, UpdateMemberBody } from "@workspace/api-zod";
import { requireAdmin } from "../lib/adminAuth";

const router: IRouter = Router();

router.get("/members", async (_req: Request, res: Response) => {
  const members = await db
    .select()
    .from(membersTable)
    .orderBy(asc(membersTable.sortOrder), asc(membersTable.id));
  res.json(members);
});

router.get("/members/:id", async (req: Request, res: Response) => {
  const id = String(req.params.id);
  const numericId = Number(id);
  const whereClause = Number.isNaN(numericId)
    ? eq(membersTable.slug, id)
    : (or(eq(membersTable.id, numericId), eq(membersTable.slug, id)) as ReturnType<typeof eq>);

  const [member] = await db.select().from(membersTable).where(whereClause).limit(1);
  if (!member) {
    res.status(404).json({ error: "Member not found" });
    return;
  }
  res.json(member);
});

router.post("/members", requireAdmin, async (req: Request, res: Response) => {
  const parsed = CreateMemberBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid member data" });
    return;
  }

  const [created] = await db.insert(membersTable).values(parsed.data).returning();
  res.status(201).json(created);
});

router.patch("/members/:id", requireAdmin, async (req: Request, res: Response) => {
  const parsed = UpdateMemberBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid member data" });
    return;
  }

  const numericId = Number(req.params.id);
  if (Number.isNaN(numericId)) {
    res.status(400).json({ error: "Invalid member id" });
    return;
  }

  const [updated] = await db
    .update(membersTable)
    .set({ ...parsed.data, updatedAt: new Date() })
    .where(eq(membersTable.id, numericId))
    .returning();

  if (!updated) {
    res.status(404).json({ error: "Member not found" });
    return;
  }
  res.json(updated);
});

router.delete("/members/:id", requireAdmin, async (req: Request, res: Response) => {
  const numericId = Number(req.params.id);
  if (Number.isNaN(numericId)) {
    res.status(400).json({ error: "Invalid member id" });
    return;
  }

  await db.delete(membersTable).where(eq(membersTable.id, numericId));
  res.json({ authenticated: true });
});

export default router;
