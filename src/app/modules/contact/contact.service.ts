import type { IContact } from "./contact.interface.ts";
import prisma from "../../utils/prismaClient.ts";

import { AgentService } from "../agent/agent.services.ts";
import { NotificationServices } from "../notification/notification.service.ts";
import { USER_ROLE } from "../users/user.constant.ts";

const createContact = async (payload: IContact) => {
  // 1. Generate AI Response
  const prompt = `You are a professional customer support assistant for KajLagbe. 
  A user named ${payload.firstName} ${payload.lastName || ""} has sent a message: 
  "${payload.message}"
  
  Provide a short, polite, and professional acknowledgment response that addresses the user's query if possible, or assures them that an admin will get back to them soon. Max 2-3 sentences.`;

  const aiResponse = await AgentService.generateResponse(prompt);
  payload.aiResponse = aiResponse;

  // 2. Save Contact to DB
  const result = await prisma.contact.create({
    data: payload,
  });

  // 3. Create Notifications for Admins
  const admins = await prisma.user.findMany({
    where: {
      role: {
        role: {
          in: [USER_ROLE.SUPER_ADMIN, USER_ROLE.ADMIN],
        },
      },
    },
  });

  for (const admin of admins) {
    await NotificationServices.createNotification({
      userId: admin.id,
      type: "CONTACT",
      message: `New contact message from ${payload.firstName}: ${payload.message.substring(0, 50)}...`,
    });
  }

  return result;
};

const getAllContacts = async () => {
  const result = await prisma.contact.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          profile: true,
        },
      },
    },
  });
  return result;
};

const getContactById = async (id: string) => {
  const result = await prisma.contact.findUnique({
    where: { id },
    include: {
      user: true,
    },
  });
  return result;
};

export const ContactService = {
  createContact,
  getAllContacts,
  getContactById,
};
