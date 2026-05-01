import config from "../config/index.js";

/**
 * Utility to send WhatsApp messages using Meta Official Cloud API or a similar HTTP provider.
 * You must configure WHATSAPP_API_URL and WHATSAPP_ACCESS_TOKEN in your .env file.
 */
export const sendWhatsAppMessage = async (phone: string, message: string) => {
  try {
    // 1. Format the phone number (remove +, spaces, dashes, etc.)
    let formattedPhone = phone.replace(/[^0-9]/g, "");
    
    // Ensure it has country code (Assuming BD +880 if missing)
    if (formattedPhone.length === 11 && formattedPhone.startsWith("01")) {
      formattedPhone = "88" + formattedPhone;
    }

    if (!formattedPhone) {
      console.log("⚠️ [WhatsApp] Invalid phone number provided.");
      return false;
    }

    // Replace HTML tags with simple WhatsApp formatting (bold, italic, newlines)
    let plainTextMessage = message
      .replace(/<br\s*[\/]?>/gi, "\n")
      .replace(/<p>/gi, "")
      .replace(/<\/p>/gi, "\n\n")
      .replace(/<strong>/gi, "*")
      .replace(/<\/strong>/gi, "*")
      .replace(/<em>/gi, "_")
      .replace(/<\/em>/gi, "_")
      .replace(/<[^>]+>/g, ""); // Remove any other HTML tags
      
    // Trim extra newlines
    plainTextMessage = plainTextMessage.trim();

    // Check if WhatsApp config exists (using placeholder names, update index.ts later)
    const apiUrl = process.env.WHATSAPP_API_URL;
    const token = process.env.WHATSAPP_ACCESS_TOKEN;

    if (!apiUrl || !token) {
      console.log("⚠️ [WhatsApp] Configuration missing. Cannot send WhatsApp message to", formattedPhone);
      console.log("📝 [WhatsApp] Message content would have been:\n", plainTextMessage);
      return false; // Skip silently in dev if not configured
    }

    // Example payload for Meta Cloud API
    const payload = {
      messaging_product: "whatsapp",
      to: formattedPhone,
      type: "text",
      text: {
        body: plainTextMessage,
      },
    };

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(`WhatsApp API Error: ${JSON.stringify(data)}`);
    }

    console.log(`✅ [WhatsApp] Message sent successfully to ${formattedPhone}`);
    return true;

  } catch (error) {
    console.error("❌ [WhatsApp] Failed to send message:", error);
    return false;
  }
};
