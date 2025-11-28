// src/auth/types/auth-user-payload.type.ts
export interface AuthUserPayload {
    sub: number;
    email: string;
    iat?: number;
    exp?: number;
}
