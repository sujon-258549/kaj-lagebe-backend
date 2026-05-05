import type { Request, Response } from "express";
export declare const TenantController: {
    createTenant: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    getAllTenants: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    getTenantById: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    updateTenant: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    deleteTenant: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
};
//# sourceMappingURL=tenant.controller.d.ts.map