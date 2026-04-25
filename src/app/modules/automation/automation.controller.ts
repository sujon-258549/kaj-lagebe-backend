import type { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync.js";
import { AutomationService } from "./automation.services.js";
import sendResponse from "../../utils/response.js";
import status from "http-status";

const triggerFollowUpEmails = catchAsync(async (req: Request, res: Response) => {
  AutomationService.processFollowUpEmails();

  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: "Follow-up email process triggered successfully in the background.",
    data: null,
  });
});

const sendIndividualFollowUp = catchAsync(async (req: Request, res: Response) => {
  const { userId, subject, content } = req.body;
  const result = await AutomationService.sendIndividualFollowUp(userId, subject, content);

  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: result.message,
    data: null,
  });
});

export const AutomationController = {
  triggerFollowUpEmails,
  sendIndividualFollowUp,
};
