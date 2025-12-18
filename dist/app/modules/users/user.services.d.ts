export declare const UserServices: {
    createUserIntoDB: (payload: any) => Promise<{
        user: {
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
        };
        profile: {
            name: string | null;
            mobile: string;
            id: string;
            gender: import("@prisma/client").$Enums.Gender | null;
            age: number | null;
            dob: Date | null;
            bloodGroup: import("@prisma/client").$Enums.BloodGroup | null;
            photo: string | null;
            nid: string | null;
            nidPhoto: string[];
            emailVerified: boolean;
            phoneVerified: boolean;
            nidVerified: boolean;
        };
        address: {
            mobile: string;
            address: string | null;
            id: string;
            division: string | null;
            district: string | null;
            upazila: string | null;
        };
        workInfo: {
            mobile: string;
            id: string;
            isBlocked: boolean;
            passwordChanged: boolean;
            passwordChangeTime: Date | null;
            idDeleted: boolean;
            verified: boolean;
            categories: string[];
            experience: string | null;
            workType: string | null;
            availableTime: string | null;
        };
    } | {
        message: string;
    }>;
    getUserById: (id: string) => Promise<({
        profile: {
            name: string | null;
            mobile: string;
            id: string;
            gender: import("@prisma/client").$Enums.Gender | null;
            age: number | null;
            dob: Date | null;
            bloodGroup: import("@prisma/client").$Enums.BloodGroup | null;
            photo: string | null;
            nid: string | null;
            nidPhoto: string[];
            emailVerified: boolean;
            phoneVerified: boolean;
            nidVerified: boolean;
        } | null;
        address: {
            mobile: string;
            address: string | null;
            id: string;
            division: string | null;
            district: string | null;
            upazila: string | null;
        } | null;
        workInfo: {
            mobile: string;
            id: string;
            isBlocked: boolean;
            passwordChanged: boolean;
            passwordChangeTime: Date | null;
            idDeleted: boolean;
            verified: boolean;
            categories: string[];
            experience: string | null;
            workType: string | null;
            availableTime: string | null;
        } | null;
    } & {
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
    }) | {
        password: undefined;
        profile: {
            name: string | null;
            mobile: string;
            id: string;
            gender: import("@prisma/client").$Enums.Gender | null;
            age: number | null;
            dob: Date | null;
            bloodGroup: import("@prisma/client").$Enums.BloodGroup | null;
            photo: string | null;
            nid: string | null;
            nidPhoto: string[];
            emailVerified: boolean;
            phoneVerified: boolean;
            nidVerified: boolean;
        } | null;
        address: {
            mobile: string;
            address: string | null;
            id: string;
            division: string | null;
            district: string | null;
            upazila: string | null;
        } | null;
        workInfo: {
            mobile: string;
            id: string;
            isBlocked: boolean;
            passwordChanged: boolean;
            passwordChangeTime: Date | null;
            idDeleted: boolean;
            verified: boolean;
            categories: string[];
            experience: string | null;
            workType: string | null;
            availableTime: string | null;
        } | null;
        email: string;
        mobile: string;
        role: import("@prisma/client").$Enums.Role;
        createdAt: Date;
        id: string;
        isBlocked: boolean;
        isDeleted: boolean;
        isVerified: boolean;
        isActive: boolean;
        passwordChanged: boolean;
        passwordChangeTime: Date | null;
        lastLogin: Date | null;
        updatedAt: Date;
    } | null>;
    getAllUsers: (query: any) => Promise<{
        data: {
            profile: {
                name: string | null;
                mobile: string;
                id: string;
                gender: import("@prisma/client").$Enums.Gender | null;
                age: number | null;
                dob: Date | null;
                bloodGroup: import("@prisma/client").$Enums.BloodGroup | null;
                photo: string | null;
                nid: string | null;
                nidPhoto: string[];
                emailVerified: boolean;
                phoneVerified: boolean;
                nidVerified: boolean;
            } | null;
            address: {
                mobile: string;
                address: string | null;
                id: string;
                division: string | null;
                district: string | null;
                upazila: string | null;
            } | null;
            workInfo: {
                mobile: string;
                id: string;
                isBlocked: boolean;
                passwordChanged: boolean;
                passwordChangeTime: Date | null;
                idDeleted: boolean;
                verified: boolean;
                categories: string[];
                experience: string | null;
                workType: string | null;
                availableTime: string | null;
            } | null;
            email: string;
            mobile: string;
            role: import("@prisma/client").$Enums.Role;
            createdAt: Date;
            id: string;
            isBlocked: boolean;
            isDeleted: boolean;
            isVerified: boolean;
            isActive: boolean;
            passwordChanged: boolean;
            passwordChangeTime: Date | null;
            lastLogin: Date | null;
            updatedAt: Date;
        }[];
        meta: {
            page: number;
            limit: number;
            total: number;
        };
    }>;
    updateUser: (id: string, payload: any) => Promise<{
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
    getMyData: (id: string) => Promise<({
        profile: {
            name: string | null;
            gender: import("@prisma/client").$Enums.Gender | null;
            age: number | null;
            dob: Date | null;
            bloodGroup: import("@prisma/client").$Enums.BloodGroup | null;
            photo: string | null;
            nid: string | null;
        } | null;
        address: {
            mobile: string;
            address: string | null;
            id: string;
            division: string | null;
            district: string | null;
            upazila: string | null;
        } | null;
        workInfo: {
            mobile: string;
            id: string;
            isBlocked: boolean;
            passwordChanged: boolean;
            passwordChangeTime: Date | null;
            idDeleted: boolean;
            verified: boolean;
            categories: string[];
            experience: string | null;
            workType: string | null;
            availableTime: string | null;
        } | null;
    } & {
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
    }) | {
        password: undefined;
        profile: {
            name: string | null;
            gender: import("@prisma/client").$Enums.Gender | null;
            age: number | null;
            dob: Date | null;
            bloodGroup: import("@prisma/client").$Enums.BloodGroup | null;
            photo: string | null;
            nid: string | null;
        } | null;
        address: {
            mobile: string;
            address: string | null;
            id: string;
            division: string | null;
            district: string | null;
            upazila: string | null;
        } | null;
        workInfo: {
            mobile: string;
            id: string;
            isBlocked: boolean;
            passwordChanged: boolean;
            passwordChangeTime: Date | null;
            idDeleted: boolean;
            verified: boolean;
            categories: string[];
            experience: string | null;
            workType: string | null;
            availableTime: string | null;
        } | null;
        email: string;
        mobile: string;
        role: import("@prisma/client").$Enums.Role;
        createdAt: Date;
        id: string;
        isBlocked: boolean;
        isDeleted: boolean;
        isVerified: boolean;
        isActive: boolean;
        passwordChanged: boolean;
        passwordChangeTime: Date | null;
        lastLogin: Date | null;
        updatedAt: Date;
    }>;
    changePassword: (payload: {
        oldPassword: string;
        newPassword: string;
    }, id: string) => Promise<{
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
    varifyOtp: (email: string, otp: string) => Promise<{
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
    deleteUser: (id: string) => Promise<never[]>;
};
//# sourceMappingURL=user.services.d.ts.map