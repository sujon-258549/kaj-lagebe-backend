export declare const AuthServices: {
    loginUser: (payload: any) => Promise<{
        accessToken: never;
        refreshToken: never;
    }>;
    refreshToken: (token: string) => Promise<{
        accessToken: never;
    }>;
    forgotPassword: (payload: {
        email: string;
    }) => Promise<{
        message: string;
    }>;
    resetPassword: (email: string, password: string, otp: string) => Promise<{
        id: string;
        email: string;
        password: string;
        mobile: string;
        role: import("@prisma/client").$Enums.Role;
        isBlocked: boolean;
        isDeleted: boolean;
        isVerified: boolean;
        isActive: boolean;
        passwordChanged: boolean;
        passwordChangeTime: Date | null;
        lastLogin: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
};
//# sourceMappingURL=login.services.d.ts.map