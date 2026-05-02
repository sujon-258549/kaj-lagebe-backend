import prisma from "../../utils/prismaClient.js";
import { AgentService } from "../agent/agent.services.js";
import { sendEmail } from "../../utils/sendEmail.js";
import { sendWhatsAppMessage } from "../../utils/whatsapp.js";
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
    
    // Find unique emails to nurture
    // We want to send a maximum of 3 nurturing emails
    // 1st email: 1 day after contact
    // 2nd email: 3 days after 1st email
    // 3rd email: 7 days after 2nd email
    
    const unNurturedContacts = await prisma.contact.findMany({
      where: {
        nurtureCount: { lt: 10 }, // Max 3 emails
        OR: [
          {
            // Case 1: First email (nurtureCount = 0), > 1 day since contact
            nurtureCount: 0,
            createdAt: { lt: new Date(now.getTime() - 24 * 60 * 60 * 1000) }
          },
          {
            // Case 2: Second email (nurtureCount = 1), > 3 days since last nurture
            nurtureCount: 1,
            lastNurturedAt: { lt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000) }
          },
          {
            // Case 3: Third email (nurtureCount = 2), > 7 days since last nurture
            nurtureCount: 2,
            lastNurturedAt: { lt: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000) }
          }
        ]
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const emailsToNurture = new Set<string>();
    const contactsToProcess = [];

    for (const contact of unNurturedContacts) {
      if (!contact.email) continue;
      
      // Keep only unique emails per run
      if (!emailsToNurture.has(contact.email)) {
        emailsToNurture.add(contact.email);
        contactsToProcess.push(contact);
      }
    }

    console.log(`🔍 [Automation] Found ${contactsToProcess.length} contacts for nurturing at this time.`);

    for (const contact of contactsToProcess) {
      if (!contact.email) continue;

      const userName = contact.firstName || "সম্মানিত গ্রাহক";
      const userMessage = contact.message;
      const currentNurtureStep = contact.nurtureCount + 1; // 1, 2, or 3

      let promptInstructions = "";
      if (currentNurtureStep === 1) {
        promptInstructions = "This is our first follow-up. Gently remind them we are ready to help with their task and offer our reliable workers.";
      } else if (currentNurtureStep === 2) {
        promptInstructions = "This is our second follow-up after a few days. Ask if they are still struggling with their work/task, and emphasize our fast hiring process and low cost.";
      } else {
        promptInstructions = "This is our final follow-up after a week. Provide a final friendly reminder that KajLagbe is the best platform to hire workers for any job, anytime.";
      }

      const prompt = `
        You are a persuasive business developer for "Kaj Lagbe" (কাজ লাগবে), a service platform where users can hire reliable workers very quickly.
        A user named "${userName}" contacted us previously with this message/inquiry: "${userMessage}".
        
        Write a professional, warm, and highly persuasive Bengali (বাংলা) email to nurture this lead.
        
        Context for this email: ${promptInstructions}
        
        Instructions:
        1. Address them politely.
        2. Acknowledge their past inquiry.
        3. Explain how our workers can solve their specific problem quickly.
        4. Provide our company contact information (e.g., Phone: +880 1234 567890, Email: support@kajlagbe.com).
        5. Tone must be helpful, professional, and not overly salesy.
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

      // Send WhatsApp if phone number exists
      if (contact.phone) {
        // Use the raw AI response (which is HTML) and the utility will format it for WA
        await sendWhatsAppMessage(contact.phone, aiResponse);
      }

      // Increment nurtureCount and set lastNurturedAt for ALL contacts with this email
      await prisma.contact.updateMany({
        where: { email: contact.email },
        data: { 
          nurtureCount: { increment: 1 },
          lastNurturedAt: now
        },
      });

      console.log(`✅ [Automation] Nurturing email step ${currentNurtureStep} sent to: ${contact.email}`);
    }
  } catch (error) {
    console.error("❌ [Automation] Error in Contact Nurturing Process:", error);
  }

  console.log("🏁 [Automation] Contact Nurturing Process Completed.");
};

const autoPostBlogs = async () => {
  console.log("🚀 [Automation] Starting Auto Blog Posting Agent...");

  try {
    const adminUser = await prisma.user.findFirst({
      where: { role: { role: "SUPER_ADMIN" } },
    });

    if (!adminUser) {
      console.log("⚠️ [Automation] No SUPER_ADMIN found. Skipping auto-blog.");
      return;
    }

    const categories = ["Marketplace Tips", "Worker Success", "Safety", "Technology", "Home Improvement", "Career Advice", "Business Growth"];
    const selectedCategory = categories[Math.floor(Math.random() * categories.length)];

    const prompt = `
      You are an expert content writer for "Kaj Lagbe" (কাজ লাগবে), a service-based marketplace in Bangladesh.
      Generate a professional, engaging, and high-quality blog post in Bengali (বাংলা).
      
      Topic: ${selectedCategory}
      
      Instructions:
      1. Provide a catchy Title.
      2. Provide a short SEO Excerpt (max 150 chars).
      3. Provide a list of 3-5 tags.
      4. The Content should be in professional Bengali, including <h3>, <ul>, <li> and <p> tags.
      5. Make the content informative and helpful for both workers and clients.
      6. IMPORTANT: Return the result ONLY as a valid JSON object with keys: title, excerpt, tags (array of strings), content. No other text.
    `;

    const aiResponse = await AgentService.generateResponse(prompt);
    
    // Attempt to parse JSON from AI response
    let blogData;
    try {
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        blogData = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("No JSON found in AI response");
      }
    } catch (e) {
      console.error("❌ [Automation] Error parsing AI blog JSON. Response was:", aiResponse);
      return;
    }

    // Fetch a random image from media library for cover
    const availableImages = await prisma.image.findMany({ 
      take: 200, 
      select: { id: true },
      orderBy: { createdAt: 'desc' }
    });
    
    const randomImgObj = availableImages.length > 0 
      ? availableImages[Math.floor(Math.random() * availableImages.length)]
      : null;
    const randomImg = randomImgObj ? randomImgObj.id : null;

    const slug = (blogData.title.toLowerCase().replace(/ /g, "-") + "-" + Math.floor(Math.random() * 10000)).substring(0, 50);

    await prisma.blog.create({
      data: {
        title: blogData.title,
        slug: slug,
        content: blogData.content,
        excerpt: blogData.excerpt,
        tags: blogData.tags || [],
        category: selectedCategory || null,
        authorId: adminUser.id,
        authorName: "Kaj Lagbe Agent",
        coverId: randomImg,
        isPublished: true,
        publishedAt: new Date(),
      }
    });

    console.log(`✅ [Automation] Auto-blog posted: ${blogData.title}`);

  } catch (error) {
    console.error("❌ [Automation] Error in Auto Blog Posting:", error);
  }
};

export const AutomationService = {
  processFollowUpEmails,
  sendIndividualFollowUp,
  processContactNurturingEmails,
  autoPostBlogs,
};
