import { Router } from "express";
import { db } from "@workspace/db";
import {
  leadsTable,
  callsTable,
  appointmentsTable,
  listingsTable,
  voiceSettingsTable,
  onboardingProgressTable,
} from "@workspace/db";
import { eq, and, gte, sql } from "drizzle-orm";

const router = Router();
const DEMO_AGENT_ID = 1;

router.get("/dashboard/summary", async (req, res) => {
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  const [
    allLeads,
    newLeads,
    allCalls,
    recentCalls,
    upcomingAppts,
    activeListings,
    voice,
    onboarding,
  ] = await Promise.all([
    db.select().from(leadsTable).where(eq(leadsTable.agentId, DEMO_AGENT_ID)),
    db.select().from(leadsTable).where(and(eq(leadsTable.agentId, DEMO_AGENT_ID), gte(leadsTable.createdAt, oneWeekAgo))),
    db.select().from(callsTable).where(eq(callsTable.agentId, DEMO_AGENT_ID)),
    db.select().from(callsTable).where(and(eq(callsTable.agentId, DEMO_AGENT_ID), gte(callsTable.calledAt, oneWeekAgo))),
    db.select().from(appointmentsTable).where(and(eq(appointmentsTable.agentId, DEMO_AGENT_ID), eq(appointmentsTable.status, "upcoming"))),
    db.select().from(listingsTable).where(and(eq(listingsTable.agentId, DEMO_AGENT_ID), eq(listingsTable.status, "active"))),
    db.select().from(voiceSettingsTable).where(eq(voiceSettingsTable.agentId, DEMO_AGENT_ID)).limit(1),
    db.select().from(onboardingProgressTable).where(eq(onboardingProgressTable.agentId, DEMO_AGENT_ID)).limit(1),
  ]);

  const voiceData = voice[0];
  const onboardingData = onboarding[0];

  res.json({
    totalLeads: allLeads.length,
    newLeadsThisWeek: newLeads.length,
    totalCalls: allCalls.length,
    callsThisWeek: recentCalls.length,
    upcomingAppointments: upcomingAppts.length,
    activeListings: activeListings.length,
    assistantStatus: voiceData?.isActive ? "active" : voiceData ? "inactive" : "not_configured",
    connectedPhone: voiceData?.linkedPhone || null,
    onboardingComplete: onboardingData?.isComplete || false,
    onboardingStep: onboardingData?.currentStep || 1,
  });
});

router.get("/dashboard/recent-activity", async (req, res) => {
  const [leads, calls, appts] = await Promise.all([
    db.select().from(leadsTable).where(eq(leadsTable.agentId, DEMO_AGENT_ID)).orderBy(sql`${leadsTable.createdAt} DESC`).limit(5),
    db.select().from(callsTable).where(eq(callsTable.agentId, DEMO_AGENT_ID)).orderBy(sql`${callsTable.calledAt} DESC`).limit(5),
    db.select().from(appointmentsTable).where(eq(appointmentsTable.agentId, DEMO_AGENT_ID)).orderBy(sql`${appointmentsTable.createdAt} DESC`).limit(5),
  ]);

  const activity = [
    ...leads.map(l => ({
      id: l.id * 100,
      type: "lead" as const,
      description: `New lead: ${l.name}`,
      timestamp: l.createdAt.toISOString(),
      icon: "user",
    })),
    ...calls.map(c => ({
      id: c.id * 100 + 1,
      type: "call" as const,
      description: `Call from ${c.callerName || c.callerPhone || "Unknown"} - ${c.outcome || "answered"}`,
      timestamp: c.calledAt.toISOString(),
      icon: "phone",
    })),
    ...appts.map(a => ({
      id: a.id * 100 + 2,
      type: "appointment" as const,
      description: `Appointment with ${a.leadName || "Unknown"} — ${a.type || "Consultation"}`,
      timestamp: a.createdAt.toISOString(),
      icon: "calendar",
    })),
  ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 10);

  res.json(activity);
});

export default router;
