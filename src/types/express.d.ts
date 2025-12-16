import { IUserRole } from "../app/modules/users/user.interfaces";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        role: IUserRole;
        mobile?: string;
        isBlocked: boolean;
        isDeleted: boolean;
        isVerified: boolean;
        isActive: boolean;
        passwordChanged?: Date | null;
        passwordChangeTime?: Date | null;
      };
    }
  }
}

export {};

