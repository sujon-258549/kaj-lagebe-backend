import type { Request } from "express";
type LogActivityInput = {
    userId?: string | null;
    email?: string | null;
    role?: string | null;
    action: string;
    method?: string | null;
    route?: string | null;
    url?: string | null;
    statusCode?: number | null;
    durationMs?: number | null;
    ip?: string | null;
    userAgent?: string | null;
    metadata?: Record<string, unknown> | null;
    success?: boolean;
};
type LogErrorInput = {
    userId?: string | null;
    email?: string | null;
    method?: string | null;
    route?: string | null;
    url?: string | null;
    statusCode: number;
    message: string;
    stack?: string | null;
    body?: unknown;
    query?: unknown;
    params?: unknown;
    ip?: string | null;
    userAgent?: string | null;
};
export declare const ActivityLogger: {
    logActivity: (input: LogActivityInput) => Promise<void>;
    logError: (input: LogErrorInput) => Promise<void>;
    getIp: (req: Request) => string | undefined;
    isSkippedPath: (url: string) => boolean;
};
export {};
//# sourceMappingURL=activityLogger.d.ts.map