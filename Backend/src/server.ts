// src/server.ts

import dotenv from 'dotenv';
import app from './app';
import connectDB from './config/db';
import seedSuperAdmin from './seed/superAdmin.seed';

dotenv.config();

const PORT: number = Number(process.env.PORT) || 5000;

const startServer = async (): Promise<void> => {
  try {
    // Connect Database
    await connectDB();

    // Seed Super Admin
    await seedSuperAdmin();

    // Start Server
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Server startup failed:', error);
    process.exit(1);
  }
};

startServer();