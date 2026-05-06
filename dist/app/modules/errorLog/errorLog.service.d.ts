import { Prisma } from "@prisma/client";
export declare const ErrorLogServices: {
    getAllErrorLogs: (query: any) => Promise<{
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
            query: Prisma.JsonValue | null;
            url: string | null;
            email: string | null;
            createdAt: Date;
            id: string;
            route: string | null;
            body: Prisma.JsonValue | null;
            message: string;
            params: Prisma.JsonValue | null;
            method: string | null;
            statusCode: number;
            ip: string | null;
            userAgent: string | null;
            userId: string | null;
            stack: string | null;
            resolved: boolean;
        })[];
        meta: {
            page: number;
            limit: number;
            total: number;
        };
    }>;
    getErrorLogById: (id: string) => Promise<{
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
        query: Prisma.JsonValue | null;
        url: string | null;
        email: string | null;
        createdAt: Date;
        id: string;
        route: string | null;
        body: Prisma.JsonValue | null;
        message: string;
        params: Prisma.JsonValue | null;
        method: string | null;
        statusCode: number;
        ip: string | null;
        userAgent: string | null;
        userId: string | null;
        stack: string | null;
        resolved: boolean;
    }>;
    markResolved: (id: string, resolved: boolean) => Promise<{
        query: Prisma.JsonValue | null;
        url: string | null;
        email: string | null;
        createdAt: Date;
        id: string;
        route: string | null;
        body: Prisma.JsonValue | null;
        message: string;
        params: Prisma.JsonValue | null;
        method: string | null;
        statusCode: number;
        ip: string | null;
        userAgent: string | null;
        userId: string | null;
        stack: string | null;
        resolved: boolean;
    }>;
    deleteErrorLog: (id: string) => Promise<{
        message: string;
    }>;
    getErrorSummary: (query: any) => Promise<{
        total: number;
        unresolved: number;
        byStatus: (Prisma.PickEnumerable<Prisma.ErrorLogGroupByOutputType, "statusCode"[]> & {
            _count: {
                _all: number;
            };
        })[];
        topRoutes: (Prisma.PickEnumerable<Prisma.ErrorLogGroupByOutputType, ("route" | "method")[]> & {
            _count: {
                _all: number;
            };
        })[];
    }>;
};
//# sourceMappingURL=errorLog.service.d.ts.map