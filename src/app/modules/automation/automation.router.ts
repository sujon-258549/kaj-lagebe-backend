import { Router } from "express";
import { AutomationController } from "./automation.controller.js";

const router = Router();

router.post("/trigger-follow-up", AutomationController.triggerFollowUpEmails);
router.post("/send-individual", AutomationController.sendIndividualFollowUp);

export const AutomationRoutes = router;
