export const ANALYTICS_SOURCES = ["admin", "site", "blog", "job"] as const;
export type AnalyticsSource = (typeof ANALYTICS_SOURCES)[number];

export const TRAFFIC_RANGES = [
  "today",
  "yesterday",
  "this-week",
  "last-week",
  "this-month",
  "last-month",
  "this-year",
  "all",
] as const;

export type TrafficRange = (typeof TRAFFIC_RANGES)[number];
