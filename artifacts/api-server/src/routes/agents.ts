import { Router } from "express";
import { db } from "@workspace/db";
import {
  agentProfilesTable,
  businessSettingsTable,
  onboardingProgressTable,
} from "@workspace/db";
import { eq } from "drizzle-orm";
import {
  UpdateAgentProfileBody,
  UpdateBusinessSettingsBody,
  UpdateOnboardingProgressBody,
} from "@workspace/api-zod";

const router = Router();

const DEMO_AGENT_ID = 1;

async function ensureAgent() {
  const existing = await db
    .select()
    .from(agentProfilesTable)
    .where(eq(agentProfilesTable.id, DEMO_AGENT_ID))
    .limit(1);

  if (existing.length === 0) {
    await db.insert(agentProfilesTable).values({
      id: DEMO_AGENT_ID,
      fullName: "Alex Johnson",
      brokerage: "Premier Realty Group",
      email: "alex@premierrealty.com",
      phone: "(555) 867-5309",
      bio: "Experienced real estate agent with 10+ years helping buyers and sellers in the greater metro area.",
      serviceAreas: "Downtown, Midtown, Eastside, Westside",
      escalationContact: "manager@premierrealty.com",
    });
  }
  return existing[0];
}

router.get("/agents/profile", async (req, res) => {
  await ensureAgent();
  const profile = await db
    .select()
    .from(agentProfilesTable)
    .where(eq(agentProfilesTable.id, DEMO_AGENT_ID))
    .limit(1);
  res.json(profile[0]);
});

router.put("/agents/profile", async (req, res) => {
  const body = UpdateAgentProfileBody.parse(req.body);
  const updated = await db
    .update(agentProfilesTable)
    .set({ ...body, updatedAt: new Date() })
    .where(eq(agentProfilesTable.id, DEMO_AGENT_ID))
    .returning();
  res.json(updated[0]);
});

router.get("/agents/business-settings", async (req, res) => {
  await ensureAgent();
  const settings = await db
    .select()
    .from(businessSettingsTable)
    .where(eq(businessSettingsTable.agentId, DEMO_AGENT_ID))
    .limit(1);

  if (settings.length === 0) {
    const newSettings = await db
      .insert(businessSettingsTable)
      .values({
        agentId: DEMO_AGENT_ID,
        appointmentTypes: "Buyer Consultation,Listing Appointment,Property Showing,Follow-up Call",
        appointmentDuration: 60,
        bookingBuffer: 15,
        officeHours: "Mon-Fri 9am-6pm, Sat 10am-4pm",
        leadRoutingPrefs: "immediate",
        handoffRules: "Escalate to human agent if caller requests to speak with someone or asks questions I cannot answer.",
        transferInstructions: "Transfer to main office at (555) 867-5300 during business hours.",
        businessNotes: "Specializing in residential real estate. Focus on first-time homebuyers and move-up buyers.",
      })
      .returning();
    return res.json(newSettings[0]);
  }
  res.json(settings[0]);
});

router.put("/agents/business-settings", async (req, res) => {
  const body = UpdateBusinessSettingsBody.parse(req.body);
  const existing = await db
    .select()
    .from(businessSettingsTable)
    .where(eq(businessSettingsTable.agentId, DEMO_AGENT_ID))
    .limit(1);

  if (existing.length === 0) {
    const created = await db
      .insert(businessSettingsTable)
      .values({ agentId: DEMO_AGENT_ID, ...body })
      .returning();
    return res.json(created[0]);
  }

  const updated = await db
    .update(businessSettingsTable)
    .set({ ...body, updatedAt: new Date() })
    .where(eq(businessSettingsTable.agentId, DEMO_AGENT_ID))
    .returning();
  res.json(updated[0]);
});

router.get("/agents/onboarding", async (req, res) => {
  const progress = await db
    .select()
    .from(onboardingProgressTable)
    .where(eq(onboardingProgressTable.agentId, DEMO_AGENT_ID))
    .limit(1);

  if (progress.length === 0) {
    const created = await db
      .insert(onboardingProgressTable)
      .values({ agentId: DEMO_AGENT_ID })
      .returning();
    const row = created[0];
    return res.json({
      currentStep: row.currentStep,
      completedSteps: JSON.parse(row.completedSteps),
      isComplete: row.isComplete,
    });
  }

  const row = progress[0];
  res.json({
    currentStep: row.currentStep,
    completedSteps: JSON.parse(row.completedSteps),
    isComplete: row.isComplete,
  });
});

router.put("/agents/onboarding", async (req, res) => {
  const body = UpdateOnboardingProgressBody.parse(req.body);

  const existing = await db
    .select()
    .from(onboardingProgressTable)
    .where(eq(onboardingProgressTable.agentId, DEMO_AGENT_ID))
    .limit(1);

  let completedSteps: number[] = [];
  if (existing.length > 0) {
    completedSteps = JSON.parse(existing[0].completedSteps);
  }

  if (body.completedStep && !completedSteps.includes(body.completedStep)) {
    completedSteps.push(body.completedStep);
  }

  const isComplete = completedSteps.length >= 7;

  if (existing.length === 0) {
    const created = await db
      .insert(onboardingProgressTable)
      .values({
        agentId: DEMO_AGENT_ID,
        currentStep: body.currentStep,
        completedSteps: JSON.stringify(completedSteps),
        isComplete,
      })
      .returning();
    const row = created[0];
    return res.json({
      currentStep: row.currentStep,
      completedSteps: JSON.parse(row.completedSteps),
      isComplete: row.isComplete,
    });
  }

  const updated = await db
    .update(onboardingProgressTable)
    .set({
      currentStep: body.currentStep,
      completedSteps: JSON.stringify(completedSteps),
      isComplete,
      updatedAt: new Date(),
    })
    .where(eq(onboardingProgressTable.agentId, DEMO_AGENT_ID))
    .returning();

  const row = updated[0];
  res.json({
    currentStep: row.currentStep,
    completedSteps: JSON.parse(row.completedSteps),
    isComplete: row.isComplete,
  });
});

export default router;
