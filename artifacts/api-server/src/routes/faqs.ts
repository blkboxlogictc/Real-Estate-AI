import { Router } from "express";
import { db } from "@workspace/db";
import { faqsTable } from "@workspace/db";
import { eq, and } from "drizzle-orm";
import { CreateFaqBody, UpdateFaqBody, UpdateFaqParams, DeleteFaqParams } from "@workspace/api-zod";

const router = Router();
const DEMO_AGENT_ID = 1;

router.get("/faqs", async (req, res) => {
  const faqs = await db
    .select()
    .from(faqsTable)
    .where(eq(faqsTable.agentId, DEMO_AGENT_ID))
    .orderBy(faqsTable.createdAt);
  res.json(faqs);
});

router.post("/faqs", async (req, res) => {
  const body = CreateFaqBody.parse(req.body);
  const created = await db
    .insert(faqsTable)
    .values({ ...body, agentId: DEMO_AGENT_ID })
    .returning();
  res.status(201).json(created[0]);
});

router.put("/faqs/:id", async (req, res) => {
  const { id } = UpdateFaqParams.parse(req.params);
  const body = UpdateFaqBody.parse(req.body);
  const updated = await db
    .update(faqsTable)
    .set(body)
    .where(and(eq(faqsTable.id, id), eq(faqsTable.agentId, DEMO_AGENT_ID)))
    .returning();
  if (updated.length === 0) return res.status(404).json({ error: "Not found" });
  res.json(updated[0]);
});

router.delete("/faqs/:id", async (req, res) => {
  const { id } = DeleteFaqParams.parse(req.params);
  await db
    .delete(faqsTable)
    .where(and(eq(faqsTable.id, id), eq(faqsTable.agentId, DEMO_AGENT_ID)));
  res.status(204).send();
});

export default router;
