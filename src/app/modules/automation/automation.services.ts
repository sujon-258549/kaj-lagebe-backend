import prisma from "../../utils/prismaClient.js";
import { AgentService } from "../agent/agent.services.js";
import { sendEmail } from "../../utils/sendEmail.js";
import { getConfig, ConfigKeys, setConfig } from "../../utils/configProvider.js";

const processFollowUpEmails = async () => {
  console.log("🚀 [Automation] Starting Follow-up Email Process...");

  // 1. Get Interval Days from DB (default 7 days)
  let intervalDaysStr = await getConfig(ConfigKeys.FOLLOW_UP_INTERVAL_DAYS);
  if (!intervalDaysStr) {
    intervalDaysStr = "7";
    await setConfig(ConfigKeys.FOLLOW_UP_INTERVAL_DAYS, intervalDaysStr, "Days interval between follow-up emails");
  }
  const intervalDays = parseInt(intervalDaysStr);

  // 2. Fetch users based on the interval
  const intervalDate = new Date();
  intervalDate.setDate(intervalDate.getDate() - intervalDays);

  const usersToFollowUp = await prisma.user.findMany({
    where: {
      isDeleted: false,
      isBlocked: false,
      isActive: true,
      role: {
        role: "USER",
      },
      OR: [{ lastFollowUp: null }, { lastFollowUp: { lte: intervalDate } }],
    },
    include: {
      profile: true,
      role: true,
      workInfo: {
        include: {
          subCategories: true,
        },
      },
    },
    take: 10, // Limit to 10 users per run to avoid rate limits
  });

  console.log(
    `🔍 [Automation] Found ${usersToFollowUp.length} users for follow-up.`,
  );

  for (const user of usersToFollowUp) {
    try {
      const userName = user.profile?.name || "সম্মানিত ইউজার";
      const userRole = user.role?.role || "ইউজার";
      const userCategories =
        user.workInfo?.subCategories?.map((s: any) => s.name).join(", ") ||
        "আপনার পছন্দের ক্যাটাগরি";

      const messageTypes = [
        "Job Alert (focus on new opportunities)",
        "Profile Optimization (encouraging to complete profile)",
        "Career Success & Motivation (how to succeed in their role)",
      ];
      const selectedType =
        messageTypes[Math.floor(Math.random() * messageTypes.length)]!;

      const prompt = `
        You are a professional customer success agent for "Kaj Lagbe" (কাজ লাগবে), a premium job portal in Bangladesh.
        Generate a unique, professional, and warm follow-up email in Bengali for a user named "${userName}".
        
        User Context:
        - Role: ${userRole}
        - Interested Categories: ${userCategories}
        - Email Type: ${selectedType}
        
        Instructions:
        1. Start with a professional and friendly greeting.
        2. Content Type: ${selectedType}.
        3. Make it highly personalized and engaging. Use professional Bengali (no slang).
        4. Mention "Kaj Lagbe" (কাজ লাগবে) naturally in the conversation.
        5. Provide a subject line separately at the top starting with "Subject: ".
        6. The body should be in clean HTML format (only <p>, <br>, <strong> tags).
        7. Ensure the tone is different from a generic template.
      `;

      const aiResponse = await AgentService.generateResponse(prompt);

      // Extract Subject and Body
      let subject = "আপনার জন্য নতুন কাজের সুযোগ - কাজ লাগবে";
      let content = aiResponse;

      if (aiResponse.includes("Subject:")) {
        const parts = aiResponse.split("Subject:");
        if (parts[1]) {
          const contentParts = parts[1].split("\n");
          subject = contentParts[0]?.trim() || subject;
          content = contentParts.slice(1).join("\n").trim();
        }
      }

      // Send Email
      await sendEmail(
        user.email,
        `
        <div style="font-family: 'Arial', sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #007bff; text-align: center;">কাজ লাগবে (Kaj Lagbe)</h2>
          ${content}
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #777; text-align: center;">
            <p>© ${new Date().getFullYear()} কাজ লাগবে। সর্বস্বত্ব সংরক্ষিত।</p>
          </div>
        </div>
      `,
        subject,
      );

      // Record History
      await prisma.$transaction([
        prisma.user.update({
          where: { id: user.id },
          data: { lastFollowUp: new Date() },
        }),
        prisma.followUpHistory.create({
          data: {
            userId: user.id,
            subject: subject,
            content: content,
          },
        }),
      ]);

      console.log(`✅ [Automation] Follow-up sent to: ${user.email}`);
    } catch (error) {
      console.error(
        `❌ [Automation] Error processing user ${user.email}:`,
        error,
      );
    }
  }

  console.log("🏁 [Automation] Follow-up Process Completed.");
};

const sendIndividualFollowUp = async (userId: string, subject: string, content: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { profile: true },
  });

  if (!user) {
    throw new Error("User not found");
  }

  // Send Email
  await sendEmail(
    user.email,
    `
    <div style="font-family: 'Arial', sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
      <h2 style="color: #007bff; text-align: center;">কাজ লাগবে (Kaj Lagbe)</h2>
      ${content}
      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #777; text-align: center;">
        <p>© ${new Date().getFullYear()} কাজ লাগবে। সর্বস্বত্ব সংরক্ষিত।</p>
      </div>
    </div>
  `,
    subject,
  );

  // Record History
  await prisma.$transaction([
    prisma.user.update({
      where: { id: user.id },
      data: { lastFollowUp: new Date() },
    }),
    prisma.followUpHistory.create({
      data: {
        userId: user.id,
        subject: subject,
        content: content,
      },
    }),
  ]);

  return { message: `Follow-up email sent to ${user.email}` };
};

const processContactNurturingEmails = async () => {
  console.log("🚀 [Automation] Starting Contact Nurturing Process...");

  try {
    const now = new Date();
    const currentHour = now.getHours();

    // Find contacts that have not been nurtured, are at least 24 hours old
    const unNurturedContacts = await prisma.contact.findMany({
      where: {
        isNurtured: false,
        createdAt: {
          lt: new Date(now.getTime() - 24 * 60 * 60 * 1000), // older than 24 hours
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Filter contacts where the original contact hour matches current hour
    // And keep only unique emails to avoid spamming the same person in one run
    const emailsToNurture = new Set<string>();
    const contactsToProcess = [];

    for (const contact of unNurturedContacts) {
      if (!contact.email) continue;
      
      const contactHour = contact.createdAt.getHours();
      
      // If hour matches (or is within 1 hour to handle slight delays) and we haven't processed this email yet
      if (contactHour === currentHour && !emailsToNurture.has(contact.email)) {
        emailsToNurture.add(contact.email);
        contactsToProcess.push(contact);
      }
    }

    console.log(`🔍 [Automation] Found ${contactsToProcess.length} contacts for nurturing at this hour.`);

    for (const contact of contactsToProcess) {
      if (!contact.email) continue;

      const userName = contact.firstName || "সম্মানিত গ্রাহক";
      const userMessage = contact.message;

      const prompt = `
        You are a persuasive business developer for "Kaj Lagbe" (কাজ লাগবে), a service platform where users can hire reliable workers very quickly.
        A user named "${userName}" contacted us previously with this message/inquiry: "${userMessage}".
        
        Write a professional, warm, and highly persuasive Bengali (বাংলা) email to nurture this lead.
        
        Instructions:
        1. Address them politely.
        2. Acknowledge their past inquiry politely.
        3. Explain that if they have any pending work, tasks, or projects, they can easily hire our fast and reliable workers to solve it quickly.
        4. Provide our company contact information (e.g., Phone: +880 1234 567890, Email: support@kajlagbe.com).
        5. Tone must be helpful, professional, and not overly salesy, but clearly offering our workers' help.
        6. Provide a Subject line separately at the top starting with "Subject: ".
        7. The body should be in clean HTML format (only <p>, <br>, <strong> tags).
      `;

      const aiResponse = await AgentService.generateResponse(prompt);

      // Extract Subject and Body
      let subject = "আপনার কোনো কাজ লাগবে কি? - কাজ লাগবে";
      let content = aiResponse;

      if (aiResponse.includes("Subject:")) {
        const parts = aiResponse.split("Subject:");
        if (parts[1]) {
          const contentParts = parts[1].split("\n");
          subject = contentParts[0]?.trim() || subject;
          content = contentParts.slice(1).join("\n").trim();
        }
      }

      // Send Email
      await sendEmail(
        contact.email,
        `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 30px; border: 1px solid #e5e7eb; border-radius: 12px; background-color: #f9fafb;">
          <h2 style="color: #4F46E5; text-align: center; margin-bottom: 20px;">কাজ লাগবে (Kaj Lagbe)</h2>
          <div style="background: #ffffff; padding: 25px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.02);">
            ${content}
          </div>
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #9ca3af; text-align: center;">
            <p>আপনার যেকোনো প্রয়োজনে আমরা আছি আপনার পাশে।</p>
            <p>© ${new Date().getFullYear()} কাজ লাগবে। সর্বস্বত্ব সংরক্ষিত।</p>
          </div>
        </div>
      `,
        subject,
      );

      // Mark ALL contacts with this email as nurtured to avoid duplicate nurturing
      await prisma.contact.updateMany({
        where: { email: contact.email },
        data: { isNurtured: true },
      });

      console.log(`✅ [Automation] Nurturing email sent to: ${contact.email}`);
    }
  } catch (error) {
    console.error("❌ [Automation] Error in Contact Nurturing Process:", error);
  }

  console.log("🏁 [Automation] Contact Nurturing Process Completed.");
};

export const AutomationService = {
  processFollowUpEmails,
  sendIndividualFollowUp,
  processContactNurturingEmails,
};
