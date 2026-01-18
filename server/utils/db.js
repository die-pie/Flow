import mongoose from 'mongoose';

let cachedConnection = null;

export const connectToDatabase = async () => {
  if (cachedConnection) {
    console.log('Using cached database connection');
    return cachedConnection;
  }

  console.log('Creating new database connection');
  const opts = {
    bufferCommands: false,
  };

  try {
    const connection = await mongoose.connect(process.env.MONGODB_URI, opts);
    cachedConnection = connection;
    return connection;
  } catch (error) {
    console.error('Database connection error:', error);
    throw error;
  }
};
