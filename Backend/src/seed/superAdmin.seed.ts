import bcrypt from 'bcryptjs';
import User, { UserRole } from '../models/User';

const seedSuperAdmin = async () => {
    try {
        const superAdmin = await User.findOne({
            role: UserRole.SUPER_ADMIN,
        });

        if (superAdmin) {
            console.log('Super Admin already exists');
            return;
        }

        const hashedPassword = await bcrypt.hash(
            process.env.SUPER_ADMIN_PASSWORD!,
            10
        );

        const newSuperAdmin = await User.create({
            username: 'Super Admin',
            email: process.env.SUPER_ADMIN_EMAIL || 'superadmin@gmail.com',
            phone: process.env.SUPER_ADMIN_PHONE || 'Admin@123',
            password: hashedPassword,
            role: UserRole.SUPER_ADMIN,
        });
        console.log('Super Admin Credentials:');
        console.log('Email:', newSuperAdmin.email);
        console.log('Password:', process.env.SUPER_ADMIN_PASSWORD);

    } catch (error) {
        console.log(error);
    }
};

export default seedSuperAdmin;