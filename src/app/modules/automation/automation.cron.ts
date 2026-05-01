import cron from "node-cron";
import { AutomationService } from "./automation.services.js";
import { getConfig, ConfigKeys, setConfig } from "../../utils/configProvider.js";

const initAutomationCron = async () => {
  // 1. Get time from DB, if not exists set default 11:50 PM
  let cronTime = await getConfig(ConfigKeys.FOLLOW_UP_CRON_TIME);
  
  if (!cronTime) {
    cronTime = "0 12 * * *"; // Default: 12:00 PM
    await setConfig(ConfigKeys.FOLLOW_UP_CRON_TIME, cronTime, "Default Follow-up Cron Time (12 PM)");
  }

  // 2. Schedule the job
  cron.schedule(cronTime, async () => {
    await AutomationService.processFollowUpEmails();
  });

  // 3. Schedule Contact Nurturing (Hourly to match their original contact time)
  cron.schedule("0 * * * *", async () => {
    await AutomationService.processContactNurturingEmails();
  });

  console.log(`⏰ [Cron] Automation Cron Jobs Initialized (Schedule: ${cronTime})`);
};

export const AutomationCron = {
  initAutomationCron
};
