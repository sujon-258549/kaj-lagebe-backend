import type { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../shared/catchAsync.ts";
import sendResponse from "../../utils/response.ts";
import { ContactService } from "./contact.service.ts";

const createContact = catchAsync(async (req: Request, res: Response) => {
  const result = await ContactService.createContact(req.body);
  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "আপনার বার্তাটি সফলভাবে পাঠানো হয়েছে! আমরা শীঘ্রই আপনার সাথে যোগাযোগ করব।",
    data: result,
  });
});

const getAllContacts = catchAsync(async (req: Request, res: Response) => {
  const result = await ContactService.getAllContacts();
  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "All contacts retrieved successfully",
    data: result,
  });
});

const getContactById = catchAsync(async (req: Request, res: Response) => {
  const result = await ContactService.getContactById(req.params.id as string);
  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Contact details retrieved successfully",
    data: result,
  });
});

const sendFeedback = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { message } = req.body;
  const user = (req as any).user;
  const result = await ContactService.sendContactFeedback(id as string, message as string, user.id);
  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "ইউজারের ইমেইলে ফিডব্যাক সফলভাবে পাঠানো হয়েছে",
    data: result,
  });
});

export const ContactController = {
  createContact,
  getAllContacts,
  getContactById,
  sendFeedback,
};
