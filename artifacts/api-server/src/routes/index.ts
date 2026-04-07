import { Router, type IRouter } from "express";
import healthRouter from "./health";
import agentsRouter from "./agents";
import voiceRouter from "./voice";
import leadsRouter from "./leads";
import callsRouter from "./calls";
import appointmentsRouter from "./appointments";
import listingsRouter from "./listings";
import faqsRouter from "./faqs";
import dashboardRouter from "./dashboard";
import integrationsRouter from "./integrations";

const router: IRouter = Router();

router.use(healthRouter);
router.use(agentsRouter);
router.use(voiceRouter);
router.use(leadsRouter);
router.use(callsRouter);
router.use(appointmentsRouter);
router.use(listingsRouter);
router.use(faqsRouter);
router.use(dashboardRouter);
router.use(integrationsRouter);

export default router;
