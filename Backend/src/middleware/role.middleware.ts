import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth.middleware';
import { UserRole } from '../models/User';

export const authorizeRoles =
    (...roles: UserRole[]) =>
        (
            req: AuthRequest,
            res: Response,
            next: NextFunction
        ): void => {
            if (!req.user) {
                res.status(401).json({
                    message: 'Unauthorized',
                });
                return;
            }

            if (!roles.includes(req.user.role)) {
                res.status(403).json({
                    message: 'Access denied',
                });
                return;
            }

            next();
        };