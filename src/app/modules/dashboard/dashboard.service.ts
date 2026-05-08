import { OverviewDashboardServices } from "./services/overview.service.ts";
import { AdminDashboardServices } from "./services/admin.service.ts";
import { RealtimeDashboardServices } from "./services/realtime.service.ts";

export const DashboardServices = {
  ...OverviewDashboardServices,
  ...AdminDashboardServices,
  ...RealtimeDashboardServices,
};
