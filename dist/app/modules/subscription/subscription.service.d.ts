export declare const SubscriptionServices: {
    createSubscription: (payload: any, userId?: string) => Promise<{
        name: string;
        isDeleted: boolean;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        status: boolean;
        id: string;
        createdById: string | null;
        updatedById: string | null;
        description: string | null;
        price: string;
        duration: string;
        discount: string;
        isRecomended: boolean;
        featured: string[];
        activeDays: number;
        maxJobs: number;
        maxEmployees: number;
        hasAnalytics: boolean;
        supportLevel: string;
    }>;
    getAllSubscription: (query: any) => Promise<{
        data: ({
            createdBy: {
                email: string;
                id: string;
                profile: {
                    name: string | null;
                } | null;
            } | null;
            updatedBy: {
                email: string;
                id: string;
                profile: {
                    name: string | null;
                } | null;
            } | null;
        } & {
            name: string;
            isDeleted: boolean;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            slug: string;
            status: boolean;
            id: string;
            createdById: string | null;
            updatedById: string | null;
            description: string | null;
            price: string;
            duration: string;
            discount: string;
            isRecomended: boolean;
            featured: string[];
            activeDays: number;
            maxJobs: number;
            maxEmployees: number;
            hasAnalytics: boolean;
            supportLevel: string;
        })[];
        meta: {
            page: number;
            limit: number;
            total: number;
        };
    }>;
    getSubscriptionById: (id: string) => Promise<{
        createdBy: {
            email: string;
            id: string;
            profile: {
                name: string | null;
            } | null;
        } | null;
        updatedBy: {
            email: string;
            id: string;
            profile: {
                name: string | null;
            } | null;
        } | null;
    } & {
        name: string;
        isDeleted: boolean;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        status: boolean;
        id: string;
        createdById: string | null;
        updatedById: string | null;
        description: string | null;
        price: string;
        duration: string;
        discount: string;
        isRecomended: boolean;
        featured: string[];
        activeDays: number;
        maxJobs: number;
        maxEmployees: number;
        hasAnalytics: boolean;
        supportLevel: string;
    }>;
    updateSubscription: (id: string, payload: any, userId?: string) => Promise<{
        name: string;
        isDeleted: boolean;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        status: boolean;
        id: string;
        createdById: string | null;
        updatedById: string | null;
        description: string | null;
        price: string;
        duration: string;
        discount: string;
        isRecomended: boolean;
        featured: string[];
        activeDays: number;
        maxJobs: number;
        maxEmployees: number;
        hasAnalytics: boolean;
        supportLevel: string;
    }>;
    deleteSubscription: (id: string) => Promise<{
        message: string;
    }>;
    updateSubscriptionStatus: (id: string, userId?: string) => Promise<{
        name: string;
        isDeleted: boolean;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        status: boolean;
        id: string;
        createdById: string | null;
        updatedById: string | null;
        description: string | null;
        price: string;
        duration: string;
        discount: string;
        isRecomended: boolean;
        featured: string[];
        activeDays: number;
        maxJobs: number;
        maxEmployees: number;
        hasAnalytics: boolean;
        supportLevel: string;
    }>;
};
//# sourceMappingURL=subscription.service.d.ts.map