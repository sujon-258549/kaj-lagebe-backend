import type { Request, Response } from "express";
export declare const SiteSettingController: {
    upsertSetting: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    bulkUpsertSettings: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    getSettingsByGroup: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    getSettingsMap: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    getAllSettings: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    deleteSetting: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    bulkDeleteSettings: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
};
//# sourceMappingURL=siteSetting.controller.d.ts.map