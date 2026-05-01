import type { IContact } from "./contact.interface.ts";
import prisma from "../../utils/prismaClient.ts";

import { AgentService } from "../agent/agent.services.ts";
import { NotificationServices } from "../notification/notification.service.ts";
import { USER_ROLE } from "../users/user.constant.ts";
import { contactAcknowledgmentTemplate, adminContactNotificationTemplate, sendEmail } from "../../utils/sendEmail.ts";

const createContact = async (payload: IContact) => {
  // 1. Generate AI Response
  const prompt = `You are a professional customer support assistant for KajLagbe. 
  A user named ${payload.firstName} ${payload.lastName || ""} has sent a message with the subject: "${payload.subject || "No Subject"}".
  Message content: "${payload.message}"
  
  Provide a short, polite, and professional acknowledgment response that addresses the user's query if possible, or assures them that an admin will get back to them soon. Use a warm but professional tone. Max 2-3 sentences.`;

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
    // 3a. System Notification
    await NotificationServices.createNotification({
      userId: admin.id,
      type: "CONTACT",
      message: `📩 New Contact: ${payload.firstName} reached out about "${payload.subject || "General Inquiry"}". Check the message now!`,
    });

    // 3b. Admin Email Notification
    if (admin.email) {
      const adminEmailHtml = adminContactNotificationTemplate({
        name: `${payload.firstName} ${payload.lastName || ""}`.trim(),
        email: payload.email || "Not provided",
        subject: payload.subject || "No Subject",
        message: payload.message,
      });

      try {
        await sendEmail(admin.email, adminEmailHtml, `New Contact Alert: ${payload.subject || "General Inquiry"}`);
      } catch (error) {
        console.error(`Error sending contact notification email to admin ${admin.email}:`, error);
      }
    }
  }

  // 3b. Create Notification for the User (if logged in)
  if (payload.userId) {
    await NotificationServices.createNotification({
      userId: payload.userId,
      type: "CONTACT",
      message: `✅ Message Sent: Hi ${payload.firstName}, we've received your message about "${payload.subject || "your inquiry"}". We'll get back to you soon!`,
    });
  }

  // 3c. Emit Socket Event to Admins for Real-time Dashboard Update
  const { emitToRole } = await import("../../utils/socket.js");
  emitToRole(USER_ROLE.SUPER_ADMIN, "new-contact", result);
  emitToRole(USER_ROLE.ADMIN, "new-contact", result);

  // 4. Send Auto-Feedback Email to User
  if (payload.email) {
    const emailHtml = contactAcknowledgmentTemplate({
      name: `${payload.firstName} ${payload.lastName || ""}`.trim(),
      subject: payload.subject || "Your message to KajLagbe",
      aiMessage: aiResponse,
    });

    try {
      await sendEmail(payload.email, emailHtml, `Re: ${payload.subject || "Contact Inquiry"}`);
    } catch (error) {
      console.error("Error sending contact feedback email:", error);
    }
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
  return result.map((contact) => ({
    ...contact,
    name: `${contact.firstName} ${contact.lastName || ""}`.trim(),
  }));
};

const getContactById = async (id: string) => {
  const contact = await prisma.contact.findUnique({
    where: { id },
    include: {
      user: true,
    },
  });
  if (!contact) return null;
  return {
    ...contact,
    name: `${contact.firstName} ${contact.lastName || ""}`.trim(),
  };
};

export const ContactService = {
  createContact,
  getAllContacts,
  getContactById,
};
