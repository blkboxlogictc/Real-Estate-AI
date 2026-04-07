import { Router } from "express";
import { db } from "@workspace/db";
import { callsTable } from "@workspace/db";
import { eq, and, sql } from "drizzle-orm";
import { ListCallsQueryParams, GetCallParams } from "@workspace/api-zod";

const router = Router();
const DEMO_AGENT_ID = 1;

router.get("/calls", async (req, res) => {
  const query = ListCallsQueryParams.parse(req.query);

  const conditions = [eq(callsTable.agentId, DEMO_AGENT_ID)];
  if (query.outcome) {
    conditions.push(eq(callsTable.outcome, query.outcome));
  }

  const calls = await db
    .select()
    .from(callsTable)
    .where(and(...conditions))
    .orderBy(sql`${callsTable.calledAt} DESC`);

  res.json(calls);
});

router.get("/calls/:id", async (req, res) => {
  const { id } = GetCallParams.parse(req.params);
  const call = await db
    .select()
    .from(callsTable)
    .where(and(eq(callsTable.id, id), eq(callsTable.agentId, DEMO_AGENT_ID)))
    .limit(1);

  if (call.length === 0) return res.status(404).json({ error: "Not found" });
  res.json(call[0]);
});

export default router;
