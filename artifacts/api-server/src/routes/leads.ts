import { Router } from "express";
import { db } from "@workspace/db";
import { leadsTable } from "@workspace/db";
import { eq, and, ilike, sql } from "drizzle-orm";
import { CreateLeadBody, UpdateLeadBody, ListLeadsQueryParams, GetLeadParams, UpdateLeadParams } from "@workspace/api-zod";

const router = Router();
const DEMO_AGENT_ID = 1;

router.get("/leads", async (req, res) => {
  const query = ListLeadsQueryParams.parse(req.query);

  let dbQuery = db
    .select()
    .from(leadsTable)
    .where(eq(leadsTable.agentId, DEMO_AGENT_ID))
    .$dynamic();

  const conditions = [eq(leadsTable.agentId, DEMO_AGENT_ID)];

  if (query.status) {
    conditions.push(eq(leadsTable.status, query.status));
  }
  if (query.search) {
    conditions.push(ilike(leadsTable.name, `%${query.search}%`));
  }

  const leads = await db
    .select()
    .from(leadsTable)
    .where(and(...conditions))
    .orderBy(sql`${leadsTable.createdAt} DESC`);

  res.json(leads);
});

router.post("/leads", async (req, res) => {
  const body = CreateLeadBody.parse(req.body);
  const created = await db
    .insert(leadsTable)
    .values({ ...body, agentId: DEMO_AGENT_ID })
    .returning();
  res.status(201).json(created[0]);
});

router.get("/leads/stats", async (req, res) => {
  const leads = await db
    .select()
    .from(leadsTable)
    .where(eq(leadsTable.agentId, DEMO_AGENT_ID));

  const counts: Record<string, number> = {};
  for (const lead of leads) {
    counts[lead.status] = (counts[lead.status] || 0) + 1;
  }

  const stats = Object.entries(counts).map(([status, count]) => ({ status, count }));
  res.json(stats);
});

router.get("/leads/:id", async (req, res) => {
  const { id } = GetLeadParams.parse(req.params);
  const lead = await db
    .select()
    .from(leadsTable)
    .where(and(eq(leadsTable.id, id), eq(leadsTable.agentId, DEMO_AGENT_ID)))
    .limit(1);

  if (lead.length === 0) return res.status(404).json({ error: "Not found" });
  res.json(lead[0]);
});

router.put("/leads/:id", async (req, res) => {
  const { id } = UpdateLeadParams.parse(req.params);
  const body = UpdateLeadBody.parse(req.body);
  const updated = await db
    .update(leadsTable)
    .set({ ...body, updatedAt: new Date() })
    .where(and(eq(leadsTable.id, id), eq(leadsTable.agentId, DEMO_AGENT_ID)))
    .returning();
  if (updated.length === 0) return res.status(404).json({ error: "Not found" });
  res.json(updated[0]);
});

export default router;
