import { Router } from "express";
import { AgentController } from "./agent.controller.ts";

const router = Router();

router.post("/generate", AgentController.generateAgentResponse);

export const AgentRouter = router;
