import type { Prisma } from "@prisma/client";
export declare const SiteSettingService: {
    upsertSetting: (payload: any, userId?: string) => Promise<{
        image: string | null;
        url: string | null;
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
        image: string | null;
        url: string | null;
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
    getSettingsByGroup: (group: string) => Promise<any[]>;
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
    getAllSettings: (query: any) => Promise<any[]>;
};
//# sourceMappingURL=siteSetting.services.d.ts.map