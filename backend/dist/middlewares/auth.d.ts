import { Request, Response, NextFunction } from 'express';
import { Role } from '@prisma/client';
interface TokenPayload {
    id: string;
    role: Role;
}
export declare const authMiddleware: (req: Request, res: Response, next: NextFunction) => void | Response<any, Record<string, any>>;
export declare const roleMiddleware: (roles: Role[]) => (req: Request, res: Response, next: NextFunction) => void | Response<any, Record<string, any>>;
declare global {
    namespace Express {
        interface Request {
            user?: TokenPayload;
        }
    }
}
export {};
