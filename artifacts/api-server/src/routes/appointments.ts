import { Router } from "express";
import { db } from "@workspace/db";
import { appointmentsTable } from "@workspace/db";
import { eq, and, sql } from "drizzle-orm";
import { CreateAppointmentBody, UpdateAppointmentBody, ListAppointmentsQueryParams, UpdateAppointmentParams } from "@workspace/api-zod";

const router = Router();
const DEMO_AGENT_ID = 1;

router.get("/appointments", async (req, res) => {
  const query = ListAppointmentsQueryParams.parse(req.query);

  const conditions = [eq(appointmentsTable.agentId, DEMO_AGENT_ID)];
  if (query.status) {
    conditions.push(eq(appointmentsTable.status, query.status));
  }

  const appointments = await db
    .select()
    .from(appointmentsTable)
    .where(and(...conditions))
    .orderBy(sql`${appointmentsTable.scheduledAt} DESC`);

  res.json(appointments);
});

router.post("/appointments", async (req, res) => {
  const body = CreateAppointmentBody.parse(req.body);
  const created = await db
    .insert(appointmentsTable)
    .values({ ...body, agentId: DEMO_AGENT_ID })
    .returning();
  res.status(201).json(created[0]);
});

router.put("/appointments/:id", async (req, res) => {
  const { id } = UpdateAppointmentParams.parse(req.params);
  const body = UpdateAppointmentBody.parse(req.body);
  const updated = await db
    .update(appointmentsTable)
    .set(body)
    .where(and(eq(appointmentsTable.id, id), eq(appointmentsTable.agentId, DEMO_AGENT_ID)))
    .returning();
  if (updated.length === 0) return res.status(404).json({ error: "Not found" });
  res.json(updated[0]);
});

export default router;
