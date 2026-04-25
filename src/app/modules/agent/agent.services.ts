import OpenAI from "openai";
import config from "../../config/index.ts";

const openai = new OpenAI({
  baseURL: config.openRouter.baseUrl,
  apiKey: config.openRouter.apiKey,
  defaultHeaders: {
    "HTTP-Referer": config.openRouter.siteUrl,
    "X-OpenRouter-Title": config.openRouter.siteName,
  },
});

const generateResponse = async (content: string) => {
  const models = [
    "google/gemini-2.0-flash-exp:free",
    "meta-llama/llama-3.1-8b-instruct:free",
    "openrouter/auto" // এটি একটি অটোমেটিক ট্রাই
  ];

  let lastError = "";

  for (const model of models) {
    try {
      console.log(`Trying model: ${model}`);
      const completion = await openai.chat.completions.create({
        model: model,
        messages: [{ role: "user", content: content }],
      });

      return completion.choices[0]?.message?.content || "No content";
    } catch (error: any) {
      console.error(`Error with ${model}:`, error.message);
      lastError = error.message;
      continue;
    }
  }

  return `Service Error: ${lastError}. Please check your API key or balance.`;
};

export const AgentService = {
  generateResponse,
};
