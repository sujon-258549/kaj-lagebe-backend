import type { IReview } from "./review.interface.ts";
export declare const ReviewService: {
    createReview: (payload: IReview, userId?: string) => Promise<{
        imageRel: {
            name: string;
            url: string;
            createdAt: Date;
            updatedAt: Date;
            slug: string;
            status: boolean;
            id: string;
            createdById: string | null;
            updatedById: string | null;
            folderId: string | null;
        } | null;
    } & {
        name: string;
        role: string | null;
        createdAt: Date;
        updatedAt: Date;
        status: boolean;
        id: string;
        createdById: string | null;
        updatedById: string | null;
        image: string | null;
        imageId: string | null;
        title: string | null;
        content: string;
        order: number;
    }>;
    getAllReviews: (query: any) => Promise<({
        imageRel: {
            name: string;
            url: string;
            createdAt: Date;
            updatedAt: Date;
            slug: string;
            status: boolean;
            id: string;
            createdById: string | null;
            updatedById: string | null;
            folderId: string | null;
        } | null;
    } & {
        name: string;
        role: string | null;
        createdAt: Date;
        updatedAt: Date;
        status: boolean;
        id: string;
        createdById: string | null;
        updatedById: string | null;
        image: string | null;
        imageId: string | null;
        title: string | null;
        content: string;
        order: number;
    })[]>;
    getReviewById: (id: string) => Promise<({
        imageRel: {
            name: string;
            url: string;
            createdAt: Date;
            updatedAt: Date;
            slug: string;
            status: boolean;
            id: string;
            createdById: string | null;
            updatedById: string | null;
            folderId: string | null;
        } | null;
    } & {
        name: string;
        role: string | null;
        createdAt: Date;
        updatedAt: Date;
        status: boolean;
        id: string;
        createdById: string | null;
        updatedById: string | null;
        image: string | null;
        imageId: string | null;
        title: string | null;
        content: string;
        order: number;
    }) | null>;
    updateReview: (id: string, payload: Partial<IReview>, userId?: string) => Promise<{
        imageRel: {
            name: string;
            url: string;
            createdAt: Date;
            updatedAt: Date;
            slug: string;
            status: boolean;
            id: string;
            createdById: string | null;
            updatedById: string | null;
            folderId: string | null;
        } | null;
    } & {
        name: string;
        role: string | null;
        createdAt: Date;
        updatedAt: Date;
        status: boolean;
        id: string;
        createdById: string | null;
        updatedById: string | null;
        image: string | null;
        imageId: string | null;
        title: string | null;
        content: string;
        order: number;
    }>;
    deleteReview: (id: string) => Promise<{
        name: string;
        role: string | null;
        createdAt: Date;
        updatedAt: Date;
        status: boolean;
        id: string;
        createdById: string | null;
        updatedById: string | null;
        image: string | null;
        imageId: string | null;
        title: string | null;
        content: string;
        order: number;
    }>;
};
//# sourceMappingURL=review.service.d.ts.map