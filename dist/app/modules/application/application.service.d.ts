export declare const ApplicationServices: {
    createApplication: (userId: string, payload: any) => Promise<{
        user: {
            email: string;
            mobile: string;
            profile: {
                name: string | null;
                photo: string | null;
            } | null;
        };
        job: {
            slug: string;
            id: string;
            title: string;
        };
    } & {
        isDeleted: boolean;
        createdAt: Date;
        updatedAt: Date;
        status: boolean;
        id: string;
        resume: string | null;
        applyStatus: string;
        applyNote: string | null;
        applyComment: string | null;
        jobId: string;
        userId: string;
        coverLetter: string | null;
        isRead: boolean;
    }>;
    getAllApplications: (query: any) => Promise<{
        data: ({
            user: {
                email: string;
                mobile: string;
                profile: {
                    name: string | null;
                    photo: string | null;
                } | null;
            };
            job: {
                slug: string;
                id: string;
                title: string;
            };
        } & {
            isDeleted: boolean;
            createdAt: Date;
            updatedAt: Date;
            status: boolean;
            id: string;
            resume: string | null;
            applyStatus: string;
            applyNote: string | null;
            applyComment: string | null;
            jobId: string;
            userId: string;
            coverLetter: string | null;
            isRead: boolean;
        })[];
        meta: {
            page: number;
            limit: number;
            total: number;
        };
    }>;
    getApplicationById: (id: string) => Promise<{
        comments: ({
            user: {
                email: string;
                mobile: string;
                profile: {
                    name: string | null;
                    photo: string | null;
                } | null;
            };
        } & {
            isDeleted: boolean;
            createdAt: Date;
            updatedAt: Date;
            id: string;
            comment: string;
            userId: string;
            applicationId: string;
        })[];
        user: {
            email: string;
            mobile: string;
            profile: {
                name: string | null;
                photo: string | null;
            } | null;
        };
        job: {
            slug: string;
            id: string;
            title: string;
        };
    } & {
        isDeleted: boolean;
        createdAt: Date;
        updatedAt: Date;
        status: boolean;
        id: string;
        resume: string | null;
        applyStatus: string;
        applyNote: string | null;
        applyComment: string | null;
        jobId: string;
        userId: string;
        coverLetter: string | null;
        isRead: boolean;
    }>;
    updateApplication: (id: string, payload: any) => Promise<{
        user: {
            email: string;
            mobile: string;
            profile: {
                name: string | null;
                photo: string | null;
            } | null;
        };
        job: {
            slug: string;
            id: string;
            title: string;
        };
    } & {
        isDeleted: boolean;
        createdAt: Date;
        updatedAt: Date;
        status: boolean;
        id: string;
        resume: string | null;
        applyStatus: string;
        applyNote: string | null;
        applyComment: string | null;
        jobId: string;
        userId: string;
        coverLetter: string | null;
        isRead: boolean;
    }>;
    deleteApplication: (id: string) => Promise<{
        message: string;
    }>;
};
//# sourceMappingURL=application.service.d.ts.map