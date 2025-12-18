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
        email: string;
        mobile: string;
        role: import("@prisma/client").$Enums.Role;
        createdAt: Date;
        id: string;
        password: string;
        isBlocked: boolean;
        isDeleted: boolean;
        isVerified: boolean;
        isActive: boolean;
        passwordChanged: boolean;
        passwordChangeTime: Date | null;
        lastLogin: Date | null;
        updatedAt: Date;
    }>;
};
//# sourceMappingURL=login.services.d.ts.map