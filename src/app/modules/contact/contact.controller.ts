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
    message: "Contact message sent successfully",
    data: result,
  });
});

const getAllContacts = catchAsync(async (req: Request, res: Response) => {
  const result = await ContactService.getAllContacts();
  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Contacts fetched successfully",
    data: result,
  });
});

const getContactById = catchAsync(async (req: Request, res: Response) => {
  const result = await ContactService.getContactById(req.params.id as string);
  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Contact fetched successfully",
    data: result,
  });
});

export const ContactController = {
  createContact,
  getAllContacts,
  getContactById,
};
