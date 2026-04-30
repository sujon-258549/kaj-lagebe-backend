import type { Prisma } from "@prisma/client";
export declare const SiteSettingService: {
    upsertSetting: (payload: any) => Promise<{
        name: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        id: string;
        description: string | null;
        type: string;
        value: string | null;
        key: string;
        imageId: string | null;
        group: string;
    }>;
    bulkUpsertSettings: (settings: any[]) => Promise<{
        name: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        id: string;
        description: string | null;
        type: string;
        value: string | null;
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
        type: string;
        value: string | null;
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
        type: string;
        value: string | null;
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
        type: string;
        value: string | null;
        key: string;
        imageId: string | null;
        group: string;
    })[]>;
};
//# sourceMappingURL=siteSetting.services.d.ts.map