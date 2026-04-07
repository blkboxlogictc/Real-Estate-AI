import { Router } from "express";

const router = Router();

const INTEGRATIONS = [
  {
    id: "supabase",
    name: "Supabase",
    description: "Auth and real-time database (optional — currently using built-in Replit DB)",
    status: "disconnected",
    configuredAt: null,
  },
  {
    id: "twilio",
    name: "Twilio",
    description: "Purchase and manage phone numbers for your AI voice assistant",
    status: "disconnected",
    configuredAt: null,
  },
  {
    id: "vapi",
    name: "Vapi",
    description: "AI voice agent platform — powers your phone assistant",
    status: "disconnected",
    configuredAt: null,
  },
  {
    id: "openai",
    name: "OpenAI",
    description: "AI backbone for call summarization, lead extraction, and intent classification",
    status: "disconnected",
    configuredAt: null,
  },
  {
    id: "google_calendar",
    name: "Google Calendar",
    description: "Sync appointments and check availability for scheduling",
    status: "disconnected",
    configuredAt: null,
  },
  {
    id: "mls_idx",
    name: "MLS / IDX",
    description: "Connect your real estate data source for live listing information",
    status: "disconnected",
    configuredAt: null,
  },
];

router.get("/integrations", async (req, res) => {
  res.json(INTEGRATIONS);
});

router.get("/twilio/numbers/search", async (req, res) => {
  const { areaCode = "415", contains } = req.query as { areaCode?: string; contains?: string };

  const mockNumbers = [
    { phoneNumber: `+1${areaCode}5550100`, friendlyName: `(${areaCode}) 555-0100`, locality: "San Francisco", region: "CA", monthlyFee: "$1.00" },
    { phoneNumber: `+1${areaCode}5550101`, friendlyName: `(${areaCode}) 555-0101`, locality: "San Francisco", region: "CA", monthlyFee: "$1.00" },
    { phoneNumber: `+1${areaCode}5550102`, friendlyName: `(${areaCode}) 555-0102`, locality: "Oakland", region: "CA", monthlyFee: "$1.00" },
    { phoneNumber: `+1${areaCode}5550103`, friendlyName: `(${areaCode}) 555-0103`, locality: "Berkeley", region: "CA", monthlyFee: "$1.00" },
    { phoneNumber: `+1${areaCode}5550104`, friendlyName: `(${areaCode}) 555-0104`, locality: "San Jose", region: "CA", monthlyFee: "$1.00" },
  ];

  res.json(mockNumbers);
});

router.post("/twilio/numbers/purchase", async (req, res) => {
  const { phoneNumber } = req.body;
  res.json({
    phoneNumber,
    sid: `PN${Math.random().toString(36).substring(2, 18).toUpperCase()}`,
    status: "purchased",
  });
});

export default router;
