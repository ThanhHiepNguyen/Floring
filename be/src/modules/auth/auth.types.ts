import type { Request } from 'express';
import type { Admin } from '@prisma/client';

export type UserRole = Admin['role'];

export type JwtPayload = {
    id: string;
    email: string;
    role: UserRole;
};

export type JwtUser = JwtPayload;

export type AuthenticatedRequest = Request & {
    user: JwtUser;
};

export type MaybeAuthenticatedRequest = Request & {
    user?: JwtUser;
};
