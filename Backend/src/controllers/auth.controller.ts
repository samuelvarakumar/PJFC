import { Request, Response } from 'express';
import User, { UserRole } from '../models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const register = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const {
            username,
            email,
            phone,
            password,
            address,
        } = req.body;

        if (!username || !email || !phone || !password) {
            res.status(400).json({
                message:
                    'Username, email, phone and password are required',
            });
            return;
        }

        const normalizedUsername = username.trim();
        const normalizedEmail = email.trim().toLowerCase();
        const normalizedPhone = phone.trim();
        const normalizedAddress = address?.trim();

        const existingUser = await User.findOne({
            $or: [
                { email: normalizedEmail },
                { phone: normalizedPhone },
            ],
        });

        if (existingUser) {
            res.status(400).json({
                message: 'Email or phone already exists',
            });
            return;
        }

        const hashedPassword = await bcrypt.hash(
            password,
            10
        );

        const newUser = await User.create({
            username: normalizedUsername,
            email: normalizedEmail,
            phone: normalizedPhone,
            password: hashedPassword,
            address: normalizedAddress,
            role: UserRole.USER,
        });

        const token = jwt.sign(
            {
                id: newUser._id,
                role: newUser.role,
            },
            process.env.JWT_SECRET!,
            {
                expiresIn: '7d',
            }
        );

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            token,
            user: {
                id: newUser._id,
                username: newUser.username,
                email: newUser.email,
                phone: newUser.phone,
                address: newUser.address,
                role: newUser.role,
            },
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: 'Internal Server Error',
        });
    }
};

// Login Controller
export const login = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const { emailOrPhone, password } = req.body;

        if (!emailOrPhone || !password) {
            res.status(400).json({
                message:
                    'Email/Phone and password are required',
            });
            return;
        }

        const loginValue = emailOrPhone.trim();

        const user = await User.findOne({
            $or: [
                { email: loginValue.toLowerCase() },
                { phone: loginValue },
            ],
        }).select('+password');

        if (!user) {
            res.status(401).json({
                message: 'Invalid credentials',
            });
            return;
        }

        // Compare password
        const isMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!isMatch) {
            res.status(401).json({
                message: 'Invalid credentials',
            });
            return;
        }

        // Generate token
        const token = jwt.sign(
            {
                id: user._id,
                role: user.role,
            },
            process.env.JWT_SECRET!,
            {
                expiresIn: '7d',
            }
        );

        res.status(200).json({
            success: true,
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                phone: user.phone,
                address: user.address,
                role: user.role,
            },
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: 'Internal Server Error',
        });
    }
};

// super admin can create admin
export const createAdmin = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const {
            username,
            email,
            phone,
            password,
            address,
        } = req.body;

        if (!username || !email || !phone || !password) {
            res.status(400).json({
                message:
                    'Username, email, phone and password are required',
            });
            return;
        }

        const normalizedUsername = username.trim();
        const normalizedEmail = email.trim().toLowerCase();
        const normalizedPhone = phone.trim();
        const normalizedAddress = address?.trim();

        const existingAdmin = await User.findOne({
            $or: [
                { email: normalizedEmail },
                { phone: normalizedPhone },
            ],
        });

        if (existingAdmin) {
            res.status(400).json({
                message: 'Email or phone already exists',
            });
            return;
        }

        const hashedPassword = await bcrypt.hash(
            password,
            10
        );

        const newAdmin = await User.create({
            username: normalizedUsername,
            email: normalizedEmail,
            phone: normalizedPhone,
            password: hashedPassword,
            address: normalizedAddress,
            role: UserRole.ADMIN,
        });

        res.status(201).json({
            success: true,
            message: 'Admin created successfully',
            user: {
                id: newAdmin._id,
                username: newAdmin.username,
                email: newAdmin.email,
                phone: newAdmin.phone,
                address: newAdmin.address,
                role: newAdmin.role,
            },
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: 'Internal Server Error',
        });
    }
};