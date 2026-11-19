import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import path from 'path';
import { fileURLToPath } from 'url';
import dns from 'dns';

// Fix Render and cloud container DNS SRV resolution issues for MongoDB Atlas
try {
  dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
} catch {
  // Ignore in environments where setting DNS servers is not permitted
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const mongoDownloadDir = path.resolve(__dirname, '../.mongo-bin');

let mongodInstance = null;

export const connectDB = async () => {
  try {
    let uri = process.env.MONGODB_URI || process.env.MONGO_URI;

    if (!uri) {
      console.log('No MONGODB_URI found. Initializing local in-memory MongoDB instance...');
      mongodInstance = await MongoMemoryServer.create({
        instance: {
          dbName: 'nova_team_db'
        },
        binary: {
          downloadDir: mongoDownloadDir
        }
      });
      uri = mongodInstance.getUri();
      console.log(`InMemory MongoDB Server running at ${uri}`);
    }

    await mongoose.connect(uri, {
      autoIndex: true,
      serverSelectionTimeoutMS: 5000,
    });

    console.log(`MongoDB Connected successfully: ${mongoose.connection.host || 'MemoryServer'}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    // If external URI failed, try fallback to MongoMemoryServer
    if (!mongodInstance) {
      try {
        console.log('Falling back to local in-memory MongoDB instance...');
        mongodInstance = await MongoMemoryServer.create({
          instance: {
            dbName: 'nova_team_db'
          },
          binary: {
            downloadDir: mongoDownloadDir
          }
        });
        const uri = mongodInstance.getUri();
        await mongoose.connect(uri);
        console.log(`Fallback InMemory MongoDB Connected at ${uri}`);
        return;
      } catch (fallbackError) {
        console.error('Failed to start memory server fallback:', fallbackError.message);
      }
    }
    process.exit(1);
  }
};
