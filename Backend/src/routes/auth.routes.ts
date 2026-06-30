import { Router } from 'express';
import {
    login,
    register,
    createAdmin,
} from '../controllers/auth.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { authorizeRoles } from '../middleware/role.middleware';
import { UserRole } from '../models/User';

const router = Router();

router.post('/register', register);
router.post('/login', login);

router.post(
    '/create-admin',
    authMiddleware,
    authorizeRoles(UserRole.SUPER_ADMIN),
    createAdmin
);

export default router;