import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongodInstance = null;

export const connectDB = async () => {
  try {
    let uri = process.env.MONGODB_URI;

    if (!uri) {
      console.log('No MONGODB_URI found. Initializing local in-memory MongoDB instance...');
      mongodInstance = await MongoMemoryServer.create({
        instance: {
          dbName: 'nova_team_db'
        }
      });
      uri = mongodInstance.getUri();
      console.log(`InMemory MongoDB Server running at ${uri}`);
    }

    await mongoose.connect(uri, {
      autoIndex: true,
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
