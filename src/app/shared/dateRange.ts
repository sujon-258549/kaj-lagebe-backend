export type DateRangeKey =
  | "today"
  | "yesterday"
  | "this-week"
  | "last-week"
  | "this-month"
  | "last-month"
  | "this-year"
  | "all";

export interface ResolvedRange {
  from: Date;
  to: Date;
  bucket: "hour" | "day" | "week" | "month";
  label: string;
}

const startOfDay = (d: Date) => {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
};

const endOfDay = (d: Date) => {
  const x = new Date(d);
  x.setHours(23, 59, 59, 999);
  return x;
};

const startOfWeek = (d: Date) => {
  const x = startOfDay(d);
  const day = x.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  x.setDate(x.getDate() + diff);
  return x;
};

const startOfMonth = (d: Date) =>
  new Date(d.getFullYear(), d.getMonth(), 1, 0, 0, 0, 0);

const endOfMonth = (d: Date) =>
  new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59, 999);

const startOfYear = (d: Date) =>
  new Date(d.getFullYear(), 0, 1, 0, 0, 0, 0);

export const resolveRange = (key: DateRangeKey | string): ResolvedRange => {
  const now = new Date();
  switch (key) {
    case "today":
      return {
        from: startOfDay(now),
        to: endOfDay(now),
        bucket: "hour",
        label: "Today",
      };
    case "yesterday": {
      const y = new Date(now);
      y.setDate(y.getDate() - 1);
      return {
        from: startOfDay(y),
        to: endOfDay(y),
        bucket: "hour",
        label: "Yesterday",
      };
    }
    case "this-week":
      return {
        from: startOfWeek(now),
        to: endOfDay(now),
        bucket: "day",
        label: "This Week",
      };
    case "last-week": {
      const start = startOfWeek(now);
      const lastStart = new Date(start);
      lastStart.setDate(lastStart.getDate() - 7);
      const lastEnd = new Date(start);
      lastEnd.setDate(lastEnd.getDate() - 1);
      return {
        from: lastStart,
        to: endOfDay(lastEnd),
        bucket: "day",
        label: "Last Week",
      };
    }
    case "this-month":
      return {
        from: startOfMonth(now),
        to: endOfDay(now),
        bucket: "day",
        label: "This Month",
      };
    case "last-month": {
      const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      return {
        from: startOfMonth(lastMonth),
        to: endOfMonth(lastMonth),
        bucket: "day",
        label: "Last Month",
      };
    }
    case "this-year":
      return {
        from: startOfYear(now),
        to: endOfDay(now),
        bucket: "month",
        label: "This Year",
      };
    case "all":
    default:
      return {
        from: new Date("2000-01-01T00:00:00Z"),
        to: endOfDay(now),
        bucket: "month",
        label: "All Time",
      };
  }
};

export const previousRange = (range: ResolvedRange): ResolvedRange => {
  const span = range.to.getTime() - range.from.getTime();
  return {
    from: new Date(range.from.getTime() - span - 1),
    to: new Date(range.from.getTime() - 1),
    bucket: range.bucket,
    label: `Previous ${range.label}`,
  };
};

const pad = (n: number) => String(n).padStart(2, "0");

export const bucketKey = (
  d: Date,
  bucket: ResolvedRange["bucket"],
): string => {
  switch (bucket) {
    case "hour":
      return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}`;
    case "day":
      return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
    case "week": {
      const tmp = new Date(d);
      tmp.setHours(0, 0, 0, 0);
      const day = tmp.getDay();
      const diff = day === 0 ? -6 : 1 - day;
      tmp.setDate(tmp.getDate() + diff);
      return `${tmp.getFullYear()}-${pad(tmp.getMonth() + 1)}-${pad(tmp.getDate())}`;
    }
    case "month":
      return `${d.getFullYear()}-${pad(d.getMonth() + 1)}`;
  }
};

export const bucketLabel = (
  key: string,
  bucket: ResolvedRange["bucket"],
): string => {
  switch (bucket) {
    case "hour":
      return key.split("T")[1] + ":00";
    case "day": {
      const [, m, d] = key.split("-");
      return `${m}/${d}`;
    }
    case "week":
      return `Wk ${key.slice(5)}`;
    case "month": {
      const [, m] = key.split("-");
      return [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ][Number(m) - 1] || key;
    }
  }
};

export const buildBucketTimeline = (range: ResolvedRange): string[] => {
  const buckets: string[] = [];
  const cursor = new Date(range.from);
  while (cursor <= range.to) {
    buckets.push(bucketKey(cursor, range.bucket));
    switch (range.bucket) {
      case "hour":
        cursor.setHours(cursor.getHours() + 1);
        break;
      case "day":
        cursor.setDate(cursor.getDate() + 1);
        break;
      case "week":
        cursor.setDate(cursor.getDate() + 7);
        break;
      case "month":
        cursor.setMonth(cursor.getMonth() + 1);
        break;
    }
  }
  return buckets;
};
