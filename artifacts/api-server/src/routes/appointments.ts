import { Router } from "express";
import { db } from "@workspace/db";
import { appointmentsTable } from "@workspace/db";
import { eq, and, sql } from "drizzle-orm";
import { CreateAppointmentBody, UpdateAppointmentBody, ListAppointmentsQueryParams, UpdateAppointmentParams } from "@workspace/api-zod";

const router = Router();

// Helper function to get agent ID from request
const getAgentId = (req: any): number => {
  const agentId = req.headers['x-agent-id'] || req.user?.id;
  if (!agentId) {
    throw new Error('Agent ID not found in request');
  }
  return parseInt(agentId.toString(), 10);
};

router.get("/appointments", async (req, res) => {
  try {
    const agentId = getAgentId(req);
    const query = ListAppointmentsQueryParams.parse(req.query);

    const conditions = [eq(appointmentsTable.agentId, agentId)];
    if (query.status) {
      conditions.push(eq(appointmentsTable.status, query.status));
    }

    const appointments = await db
      .select()
      .from(appointmentsTable)
      .where(and(...conditions))
      .orderBy(sql`${appointmentsTable.scheduledAt} ASC`);

    res.json(appointments);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

router.post("/appointments", async (req, res) => {
  try {
    const agentId = getAgentId(req);
    const body = CreateAppointmentBody.parse(req.body);
    const created = await db
      .insert(appointmentsTable)
      .values({ ...body, agentId })
      .returning();
    res.status(201).json(created[0]);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

router.put("/appointments/:id", async (req, res) => {
  try {
    const agentId = getAgentId(req);
    const { id } = UpdateAppointmentParams.parse(req.params);
    const body = UpdateAppointmentBody.parse(req.body);
    const updated = await db
      .update(appointmentsTable)
      .set({ ...body, updatedAt: new Date() })
      .where(and(eq(appointmentsTable.id, id), eq(appointmentsTable.agentId, agentId)))
      .returning();
      
    if (updated.length === 0) {
      return res.status(404).json({ error: "Appointment not found" });
    }
    
    res.json(updated[0]);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

export default router;
