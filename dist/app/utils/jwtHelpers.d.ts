import { type Secret } from "jsonwebtoken";
export declare const JwtHelpers: {
    generateToken: (payload: any, secret: Secret, expiresIn: number) => string;
    verifyToken: (token: string, secret: Secret) => object | string;
};
//# sourceMappingURL=jwtHelpers.d.ts.map