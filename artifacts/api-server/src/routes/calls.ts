import { Router } from "express";
import { db } from "@workspace/db";
import { callsTable } from "@workspace/db";
import { eq, and, sql } from "drizzle-orm";
import { ListCallsQueryParams, GetCallParams } from "@workspace/api-zod";

const router = Router();

// Helper function to get agent ID from request
const getAgentId = (req: any): number => {
  const agentId = req.headers['x-agent-id'] || req.user?.id;
  if (!agentId) {
    throw new Error('Agent ID not found in request');
  }
  return parseInt(agentId.toString(), 10);
};

router.get("/calls", async (req, res) => {
  try {
    const agentId = getAgentId(req);
    const query = ListCallsQueryParams.parse(req.query);

    const conditions = [eq(callsTable.agentId, agentId)];
    if (query.outcome) {
      conditions.push(eq(callsTable.outcome, query.outcome));
    }

    const calls = await db
      .select()
      .from(callsTable)
      .where(and(...conditions))
      .orderBy(sql`${callsTable.createdAt} DESC`);

    res.json(calls);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

router.get("/calls/:id", async (req, res) => {
  try {
    const agentId = getAgentId(req);
    const { id } = GetCallParams.parse(req.params);
    const call = await db
      .select()
      .from(callsTable)
      .where(and(eq(callsTable.id, id), eq(callsTable.agentId, agentId)))
      .limit(1);

    if (call.length === 0) {
      return res.status(404).json({ error: "Call not found" });
    }
    
    res.json(call[0]);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

export default router;
