import mongoose, { Connection } from 'mongoose';

let cachedConnection: Connection | null = null;

export async function connectToDatabase(): Promise<Connection> {
  if (cachedConnection) {
    console.log('Using cached database connection');
    return cachedConnection;
  }

  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    throw new Error('MONGODB_URI environment variable is not defined');
  }

  try {
    const connection = await mongoose.connect(mongoUri, {
      maxPoolSize: 10,
    });

    cachedConnection = connection.connection;
    console.log('New database connection established');
    return cachedConnection;
  } catch (error) {
    console.error('Failed to connect to database:', error);
    throw error;
  }
}
