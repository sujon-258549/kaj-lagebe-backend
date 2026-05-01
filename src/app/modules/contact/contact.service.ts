import type { IContact } from "./contact.interface.ts";
import prisma from "../../utils/prismaClient.ts";

import { AgentService } from "../agent/agent.services.ts";
import { NotificationServices } from "../notification/notification.service.ts";
import { USER_ROLE } from "../users/user.constant.ts";
import { contactAcknowledgmentTemplate, adminContactNotificationTemplate, sendEmail, contactFeedbackTemplate } from "../../utils/sendEmail.js";
import { emitToUser } from "../../utils/socket.js";
import { sendWhatsAppMessage } from "../../utils/whatsapp.js";

const createContact = async (payload: IContact) => {
  // 1. Generate AI Response
  const prompt = `You are a professional customer support assistant for KajLagbe. 
  A user named ${payload.firstName} ${payload.lastName || ""} has sent a message with the subject: "${payload.subject || "No Subject"}".
  Message content: "${payload.message}"
  
  Provide a short, polite, and professional acknowledgment response in Bengali (বাংলা) that addresses the user's query if possible, or assures them that an admin will get back to them soon. Use a warm but professional tone. Max 2-3 sentences.`;

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
      message: `📩 নতুন মেসেজ: ${payload.firstName} একটি মেসেজ পাঠিয়েছেন ("${payload.subject || "সাধারণ জিজ্ঞাসা"}"). এখনই চেক করুন!`,
    });

    // 3b. Real-time Dashboard Update for each admin
    emitToUser(admin.id, "new-contact", result);

    // 3c. Admin Email Notification
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
      message: `✅ ধন্যবাদ ${payload.firstName}! আপনার মেসেজটি আমরা পেয়েছি। আমাদের একজন প্রতিনিধি খুব শীঘ্রই আপনার সাথে যোগাযোগ করবে।`,
    });
  }

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

const sendContactFeedback = async (id: string, feedbackMessage: string, senderId: string) => {
  const contact = await prisma.contact.findUnique({
    where: { id },
  });

  if (!contact) {
    throw new Error("Contact message not found");
  }

  if (!contact.email) {
    throw new Error("User email not found for this contact");
  }

  // 1. Generate Smart AI Response from admin message
  const prompt = `You are a professional customer support manager at KajLagbe. 
  An admin has provided this raw feedback/response for a user: "${feedbackMessage}"
  
  Please rewrite this into a very professional, polite, and smart Bengali (বাংলা) response. 
  The tone should be helpful and build trust. Ensure it sounds natural and high-quality. 
  Output ONLY the polished Bengali response.`;

  const polishedFeedback = await AgentService.generateResponse(prompt);

  const emailHtml = contactFeedbackTemplate({
    name: `${contact.firstName} ${contact.lastName || ""}`.trim(),
    originalMessage: contact.message,
    feedbackMessage: polishedFeedback,
  });

  await sendEmail(contact.email, emailHtml, `Re: ${contact.subject || "Contact Inquiry Response"}`);

  if (contact.phone) {
    await sendWhatsAppMessage(contact.phone, polishedFeedback);
  }

  // 2. Store the feedback record in the new model
  await prisma.contactFeedback.create({
    data: {
      contactId: id,
      senderId: senderId,
      feedbackMessage: polishedFeedback, // Store the polished version
    },
  });

  // 3. Update contact status or store the feedback in DB if needed
  const result = await prisma.contact.update({
    where: { id },
    data: {
      aiResponse: polishedFeedback, 
    },
  });

  return result;
};

export const ContactService = {
  createContact,
  getAllContacts,
  getContactById,
  sendContactFeedback,
};
