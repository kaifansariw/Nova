import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
dotenv.config({ path: path.join(__dirname, '.env') });

import app from './app.js';
import { connectDB } from './config/db.js';
import { seedDatabase } from './services/seedService.js';
import { startKeepAlive } from './services/keepAliveService.js';

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    await seedDatabase();

    app.listen(PORT, () => {
      console.log(`🚀 Nova-Team Server running on port ${PORT}`);
      console.log(`API documentation available at http://localhost:${PORT}/api/health`);
      
      // Start automated self-ping keep-alive service for Render free instances
      startKeepAlive();
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
