import { Router } from "express";
import { db } from "@workspace/db";
import { voiceSettingsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { UpdateVoiceSettingsBody } from "@workspace/api-zod";

const router = Router();

// Helper function to get agent ID from request
const getAgentId = (req: any): number => {
  const agentId = req.headers['x-agent-id'] || req.user?.id;
  if (!agentId) {
    throw new Error('Agent ID not found in request');
  }
  return parseInt(agentId.toString(), 10);
};

router.get("/voice-settings", async (req, res) => {
  try {
    const agentId = getAgentId(req);
    const settings = await db
      .select()
      .from(voiceSettingsTable)
      .where(eq(voiceSettingsTable.agentId, agentId))
      .limit(1);

    if (settings.length === 0) {
      const created = await db
        .insert(voiceSettingsTable)
        .values({
          agentId,
          selectedVoice: "nova",
          greeting: "Hi, you've reached my real estate office. How can I help you today?",
          isActive: false,
        })
        .returning();
      return res.json(created[0]);
    }
    return res.json(settings[0]);
  } catch (error) {
    return res.status(400).json({ error: (error as Error).message });
  }
});

router.put("/voice-settings", async (req, res) => {
  try {
    const agentId = getAgentId(req);
    const body = UpdateVoiceSettingsBody.parse(req.body);

    const existing = await db
      .select()
      .from(voiceSettingsTable)
      .where(eq(voiceSettingsTable.agentId, agentId))
      .limit(1);

    if (existing.length === 0) {
      const created = await db
        .insert(voiceSettingsTable)
        .values({ agentId, ...body })
        .returning();
      return res.json(created[0]);
    }

    const updated = await db
      .update(voiceSettingsTable)
      .set({ ...body, updatedAt: new Date() })
      .where(eq(voiceSettingsTable.agentId, agentId))
      .returning();
    return res.json(updated[0]);
  } catch (error) {
    return res.status(400).json({ error: (error as Error).message });
  }
});

router.get("/vapi/assistant/status", async (req, res) => {
  try {
    const agentId = getAgentId(req);
    const settings = await db
      .select()
      .from(voiceSettingsTable)
      .where(eq(voiceSettingsTable.agentId, agentId))
      .limit(1);

    if (settings.length === 0) {
      return res.json({ assistantId: null, isActive: false, phoneNumber: null, status: "not_configured" });
    }

    const s = settings[0];
    return res.json({
      assistantId: s.vapiAssistantId,
      isActive: s.isActive,
      phoneNumber: s.linkedPhone,
      status: s.vapiAssistantId ? "configured" : "not_configured",
    });
  } catch (error) {
    return res.status(400).json({ error: (error as Error).message });
  }
});

export default router;
