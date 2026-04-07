import { Router } from "express";
import { db } from "@workspace/db";
import { voiceSettingsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { UpdateVoiceSettingsBody } from "@workspace/api-zod";

const router = Router();
const DEMO_AGENT_ID = 1;

router.get("/voice-settings", async (req, res) => {
  const settings = await db
    .select()
    .from(voiceSettingsTable)
    .where(eq(voiceSettingsTable.agentId, DEMO_AGENT_ID))
    .limit(1);

  if (settings.length === 0) {
    const created = await db
      .insert(voiceSettingsTable)
      .values({
        agentId: DEMO_AGENT_ID,
        selectedVoice: "nova",
        greeting: "Hi, you've reached the office of Alex Johnson with Premier Realty Group. How can I help you today?",
        personality: "professional, warm, knowledgeable",
        allowedActions: "Answer questions about listings,Schedule appointments,Collect contact information,Provide neighborhood information",
        escalationBehavior: "Transfer to agent for offers, legal questions, or when caller explicitly requests a human.",
        isActive: false,
      })
      .returning();
    return res.json(created[0]);
  }
  res.json(settings[0]);
});

router.put("/voice-settings", async (req, res) => {
  const body = UpdateVoiceSettingsBody.parse(req.body);

  const existing = await db
    .select()
    .from(voiceSettingsTable)
    .where(eq(voiceSettingsTable.agentId, DEMO_AGENT_ID))
    .limit(1);

  if (existing.length === 0) {
    const created = await db
      .insert(voiceSettingsTable)
      .values({ agentId: DEMO_AGENT_ID, ...body })
      .returning();
    return res.json(created[0]);
  }

  const updated = await db
    .update(voiceSettingsTable)
    .set({ ...body, updatedAt: new Date() })
    .where(eq(voiceSettingsTable.agentId, DEMO_AGENT_ID))
    .returning();
  res.json(updated[0]);
});

router.get("/vapi/assistant/status", async (req, res) => {
  const settings = await db
    .select()
    .from(voiceSettingsTable)
    .where(eq(voiceSettingsTable.agentId, DEMO_AGENT_ID))
    .limit(1);

  if (settings.length === 0) {
    return res.json({ assistantId: null, isActive: false, linkedPhone: null, status: "not_configured" });
  }

  const s = settings[0];
  res.json({
    assistantId: s.vapiAssistantId,
    isActive: s.isActive,
    linkedPhone: s.linkedPhone,
    status: s.vapiAssistantId ? "configured" : "not_configured",
  });
});

export default router;
