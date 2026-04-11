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

// Helper function to get agent ID from request
const getAgentId = (req: any): string => {
  const agentId = req.headers['x-agent-id'] || req.user?.id;
  if (!agentId) {
    throw new Error('Agent ID not found in request');
  }
  return agentId;
};

router.get("/agents/profile", async (req, res) => {
  try {
    const agentId = getAgentId(req);
    const profile = await db
      .select()
      .from(agentProfilesTable)
      .where(eq(agentProfilesTable.id, agentId))
      .limit(1);
    
    if (profile.length === 0) {
      return res.status(404).json({ error: 'Agent profile not found' });
    }
    
    res.json(profile[0]);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

router.put("/agents/profile", async (req, res) => {
  try {
    const agentId = getAgentId(req);
    const body = UpdateAgentProfileBody.parse(req.body);
    const updated = await db
      .update(agentProfilesTable)
      .set({ ...body, updatedAt: new Date() })
      .where(eq(agentProfilesTable.id, agentId))
      .returning();
    
    if (updated.length === 0) {
      return res.status(404).json({ error: 'Agent profile not found' });
    }
    
    res.json(updated[0]);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

router.get("/agents/business-settings", async (req, res) => {
  try {
    const agentId = getAgentId(req);
    const settings = await db
      .select()
      .from(businessSettingsTable)
      .where(eq(businessSettingsTable.agentId, agentId))
      .limit(1);

    if (settings.length === 0) {
      const newSettings = await db
        .insert(businessSettingsTable)
        .values({
          agentId,
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
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

router.put("/agents/business-settings", async (req, res) => {
  try {
    const agentId = getAgentId(req);
    const body = UpdateBusinessSettingsBody.parse(req.body);
    const existing = await db
      .select()
      .from(businessSettingsTable)
      .where(eq(businessSettingsTable.agentId, agentId))
      .limit(1);

    if (existing.length === 0) {
      const created = await db
        .insert(businessSettingsTable)
        .values({ agentId, ...body })
        .returning();
      return res.json(created[0]);
    }

    const updated = await db
      .update(businessSettingsTable)
      .set({ ...body, updatedAt: new Date() })
      .where(eq(businessSettingsTable.agentId, agentId))
      .returning();
    res.json(updated[0]);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

router.get("/agents/onboarding", async (req, res) => {
  try {
    const agentId = getAgentId(req);
    const progress = await db
      .select()
      .from(onboardingProgressTable)
      .where(eq(onboardingProgressTable.agentId, agentId))
      .limit(1);

    if (progress.length === 0) {
      const created = await db
        .insert(onboardingProgressTable)
        .values({ agentId })
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
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

router.put("/agents/onboarding", async (req, res) => {
  try {
    const agentId = getAgentId(req);
    const body = UpdateOnboardingProgressBody.parse(req.body);

    const existing = await db
      .select()
      .from(onboardingProgressTable)
      .where(eq(onboardingProgressTable.agentId, agentId))
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
          agentId,
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
      .where(eq(onboardingProgressTable.agentId, agentId))
      .returning();

    const row = updated[0];
    res.json({
      currentStep: row.currentStep,
      completedSteps: JSON.parse(row.completedSteps),
      isComplete: row.isComplete,
    });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

export default router;
