import type { Prisma } from "@prisma/client";
export declare const SiteSettingService: {
    upsertSetting: (payload: any, userId?: string) => Promise<{
        name: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        id: string;
        description: string | null;
        updatedById: string | null;
        type: string;
        value: Prisma.JsonValue | null;
        key: string;
        imageId: string | null;
        group: string;
    }>;
    bulkUpsertSettings: (settings: any[], userId?: string) => Promise<{
        name: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        id: string;
        description: string | null;
        updatedById: string | null;
        type: string;
        value: Prisma.JsonValue | null;
        key: string;
        imageId: string | null;
        group: string;
    }[]>;
    getSettingsByGroup: (group: string) => Promise<({
        image: {
            name: string;
            url: string;
            createdAt: Date;
            updatedAt: Date;
            id: string;
            createdById: string | null;
            updatedById: string | null;
            folderId: string | null;
            slug: string;
            status: boolean;
        } | null;
    } & {
        name: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        id: string;
        description: string | null;
        updatedById: string | null;
        type: string;
        value: Prisma.JsonValue | null;
        key: string;
        imageId: string | null;
        group: string;
    })[]>;
    getSettingsMap: (group?: string) => Promise<any>;
    deleteSetting: (key: string) => Promise<{
        name: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        id: string;
        description: string | null;
        updatedById: string | null;
        type: string;
        value: Prisma.JsonValue | null;
        key: string;
        imageId: string | null;
        group: string;
    }>;
    bulkDeleteSettings: (keys: string[]) => Promise<Prisma.BatchPayload>;
    getAllSettings: (query: any) => Promise<({
        image: {
            name: string;
            url: string;
            createdAt: Date;
            updatedAt: Date;
            id: string;
            createdById: string | null;
            updatedById: string | null;
            folderId: string | null;
            slug: string;
            status: boolean;
        } | null;
        updatedBy: {
            email: string;
            profile: {
                name: string | null;
                mobile: string;
                id: string;
                gender: import("@prisma/client").$Enums.Gender | null;
                age: number | null;
                dob: Date | null;
                bloodGroup: import("@prisma/client").$Enums.BloodGroup | null;
                photoId: string | null;
                photo: string | null;
                nid: string | null;
                nidPhoto: string[];
                emailVerified: boolean;
                phoneVerified: boolean;
                nidVerified: boolean;
                serialId: string | null;
            } | null;
            id: string;
        } | null;
        histories: ({
            updatedBy: {
                email: string;
                id: string;
            } | null;
        } & {
            createdAt: Date;
            id: string;
            updatedById: string | null;
            oldValue: Prisma.JsonValue | null;
            newValue: Prisma.JsonValue | null;
            siteSettingId: string;
        })[];
    } & {
        name: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        id: string;
        description: string | null;
        updatedById: string | null;
        type: string;
        value: Prisma.JsonValue | null;
        key: string;
        imageId: string | null;
        group: string;
    })[]>;
};
//# sourceMappingURL=siteSetting.services.d.ts.map