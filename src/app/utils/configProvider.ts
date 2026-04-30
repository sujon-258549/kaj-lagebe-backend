import prisma from "./prismaClient.js";

export const getConfig = async (key: string, defaultValue?: string): Promise<string | null> => {
  const config = await prisma.systemConfig.findUnique({
    where: { key },
  });
  return config ? config.value : defaultValue || null;
};

export const setConfig = async (key: string, value: string, description?: string, userId?: string) => {
  return await prisma.systemConfig.upsert({
    where: { key },
    update: { 
      value, 
      description: description || null,
      updatedById: userId ?? null
    },
    create: { 
      key, 
      value, 
      description: description || null,
      createdById: userId ?? null,
      updatedById: userId ?? null
    },
  });
};

export const ConfigKeys = {
  FOLLOW_UP_CRON_TIME: "FOLLOW_UP_CRON_TIME",
  FOLLOW_UP_INTERVAL_DAYS: "FOLLOW_UP_INTERVAL_DAYS",
  AI_API_TOKEN: "AI_API_TOKEN",
};

export const seedSystemConfigs = async () => {
  console.log("📝 Seeding system configurations...");
  
  // Default Cron Time
  const cronTime = await getConfig(ConfigKeys.FOLLOW_UP_CRON_TIME);
  if (!cronTime) {
    await setConfig(ConfigKeys.FOLLOW_UP_CRON_TIME, "0 12 * * *", "Default Follow-up Cron Time (12 PM)");
  }

  // Default Interval Days
  const intervalDays = await getConfig(ConfigKeys.FOLLOW_UP_INTERVAL_DAYS);
  if (!intervalDays) {
    await setConfig(ConfigKeys.FOLLOW_UP_INTERVAL_DAYS, "7", "Days interval between follow-up emails");
  }

  console.log("✅ System configurations seeded successfully!");
};
