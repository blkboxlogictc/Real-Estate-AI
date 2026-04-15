import { Router } from "express";
import { db } from "@workspace/db";
import { faqsTable } from "@workspace/db";
import { eq, and } from "drizzle-orm";
import { CreateFaqBody, UpdateFaqBody, UpdateFaqParams, DeleteFaqParams } from "@workspace/api-zod";

const router = Router();

// Helper function to get agent ID from request
const getAgentId = (req: any): number => {
  const agentId = req.headers['x-agent-id'] || req.user?.id;
  if (!agentId) {
    throw new Error('Agent ID not found in request');
  }
  return parseInt(agentId.toString(), 10);
};

router.get("/faqs", async (req, res) => {
  try {
    const agentId = getAgentId(req);
    const faqs = await db
      .select()
      .from(faqsTable)
      .where(eq(faqsTable.agentId, agentId))
      .orderBy(faqsTable.id);
    return res.json(faqs);
  } catch (error) {
    return res.status(400).json({ error: (error as Error).message });
  }
});

router.post("/faqs", async (req, res) => {
  try {
    const agentId = getAgentId(req);
    const body = CreateFaqBody.parse(req.body);
    const created = await db
      .insert(faqsTable)
      .values({ ...body, agentId })
      .returning();
    res.status(201).json(created[0]);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

router.put("/faqs/:id", async (req, res) => {
  try {
    const agentId = getAgentId(req);
    const { id } = UpdateFaqParams.parse(req.params);
    const body = UpdateFaqBody.parse(req.body);
    const updated = await db
      .update(faqsTable)
      .set({ ...body })
      .where(and(eq(faqsTable.id, id), eq(faqsTable.agentId, agentId)))
      .returning();
      
    if (updated.length === 0) {
      return res.status(404).json({ error: "FAQ not found" });
    }
    
    return res.json(updated[0]);
  } catch (error) {
    return res.status(400).json({ error: (error as Error).message });
  }
});

router.delete("/faqs/:id", async (req, res) => {
  try {
    const agentId = getAgentId(req);
    const { id } = DeleteFaqParams.parse(req.params);
    const deleted = await db
      .delete(faqsTable)
      .where(and(eq(faqsTable.id, id), eq(faqsTable.agentId, agentId)))
      .returning();
      
    if (deleted.length === 0) {
      return res.status(404).json({ error: "FAQ not found" });
    }
    
    return res.status(204).send();
  } catch (error) {
    return res.status(400).json({ error: (error as Error).message });
  }
});

export default router;
