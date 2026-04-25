export declare const getConfig: (key: string, defaultValue?: string) => Promise<string | null>;
export declare const setConfig: (key: string, value: string, description?: string) => Promise<{
    createdAt: Date;
    updatedAt: Date;
    id: string;
    description: string | null;
    value: string;
    key: string;
}>;
export declare const ConfigKeys: {
    FOLLOW_UP_CRON_TIME: string;
    FOLLOW_UP_INTERVAL_DAYS: string;
    AI_API_TOKEN: string;
};
export declare const seedSystemConfigs: () => Promise<void>;
//# sourceMappingURL=configProvider.d.ts.map