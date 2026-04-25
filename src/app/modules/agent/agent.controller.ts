import type { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync.ts";
import sendResponse from "../../utils/response.ts";
import httpStatus from "http-status";
import { AgentService } from "./agent.services.ts";

const generateAgentResponse = catchAsync(async (req: Request, res: Response) => {
  const { content } = req.body;
  
  // চেক করুন টার্মিনালে কী প্রিন্ট হচ্ছে
  console.log("----------------------------");
  console.log("Received Content:", content);
  console.log("----------------------------");

  const result = await AgentService.generateResponse(content);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Agent response generated successfully",
    data: result,
  });
});

export const AgentController = {
  generateAgentResponse,
};
