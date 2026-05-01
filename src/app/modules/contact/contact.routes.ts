import express from "express";
import validateRequest from "../../middleware/validateRequest.ts";
import { ContactController } from "./contact.controller.ts";
import { ContactValidation } from "./contact.validation.ts";
import auth from "../../utils/auth.ts";
import { USER_ROLE } from "../users/user.constant.ts";

const router = express.Router();

router.post(
  "/",
  validateRequest(ContactValidation.createContactZodSchema),
  ContactController.createContact
);

router.get(
  "/",
  auth(),
  ContactController.getAllContacts
);

router.get(
  "/:id",
  auth(),
  ContactController.getContactById
);

export const ContactRoutes = router;
