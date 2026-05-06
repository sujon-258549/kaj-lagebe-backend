import { Prisma } from "@prisma/client";
export declare const ActivityLogServices: {
    getAllActivityLogs: (query: any) => Promise<{
        data: ({
            user: {
                email: string;
                mobile: string;
                role: {
                    role: string;
                } | null;
                id: string;
                profile: {
                    name: string | null;
                } | null;
            } | null;
        } & {
            url: string | null;
            email: string | null;
            role: string | null;
            createdAt: Date;
            id: string;
            route: string | null;
            success: boolean;
            metadata: Prisma.JsonValue | null;
            action: string;
            method: string | null;
            statusCode: number | null;
            durationMs: number | null;
            ip: string | null;
            userAgent: string | null;
            userId: string | null;
        })[];
        meta: {
            page: number;
            limit: number;
            total: number;
        };
    }>;
    getActivityLogById: (id: string) => Promise<({
        user: {
            email: string;
            mobile: string;
            role: {
                role: string;
            } | null;
            id: string;
            profile: {
                name: string | null;
            } | null;
        } | null;
    } & {
        url: string | null;
        email: string | null;
        role: string | null;
        createdAt: Date;
        id: string;
        route: string | null;
        success: boolean;
        metadata: Prisma.JsonValue | null;
        action: string;
        method: string | null;
        statusCode: number | null;
        durationMs: number | null;
        ip: string | null;
        userAgent: string | null;
        userId: string | null;
    }) | null>;
    getActivitySummary: (query: any) => Promise<{
        total: number;
        success: number;
        failed: number;
        recentLogins: ({
            user: {
                email: string;
                role: {
                    role: string;
                } | null;
                id: string;
                profile: {
                    name: string | null;
                } | null;
            } | null;
        } & {
            url: string | null;
            email: string | null;
            role: string | null;
            createdAt: Date;
            id: string;
            route: string | null;
            success: boolean;
            metadata: Prisma.JsonValue | null;
            action: string;
            method: string | null;
            statusCode: number | null;
            durationMs: number | null;
            ip: string | null;
            userAgent: string | null;
            userId: string | null;
        })[];
        topUsers: (Prisma.PickEnumerable<Prisma.ActivityLogGroupByOutputType, ("email" | "userId")[]> & {
            _count: {
                _all: number;
            };
        })[];
    }>;
};
//# sourceMappingURL=activityLog.service.d.ts.map