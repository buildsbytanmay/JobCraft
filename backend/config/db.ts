import mongoose from 'mongoose';

let isConnected = false;
let connectionMessage = 'In-Memory Storage (Default)';

export const connectDB = async (): Promise<boolean> => {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri || mongoUri.includes('<username>') || mongoUri.includes('<password>')) {
    connectionMessage = 'In-Memory Storage Active (Configure MONGODB_URI to persist to Atlas)';
    console.log(`ℹ️ ${connectionMessage}`);
    return false;
  }

  try {
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 3000,
    });
    isConnected = true;
    connectionMessage = `Connected to MongoDB Atlas: ${conn.connection.host}`;
    console.log(`✅ ${connectionMessage}`);
    return true;
  } catch (error: any) {
    isConnected = false;
    connectionMessage = 'In-Memory Storage Active (Atlas IP whitelist / offline fallback)';
    console.log(`ℹ️ MongoDB Atlas connection skipped (${error.message || 'offline'}). Operating with in-memory persistence fallback.`);
    return false;
  }
};

export const getDBStatus = () => ({
  connected: mongoose.connection.readyState === 1 || isConnected,
  readyState: mongoose.connection.readyState,
  host: isConnected ? (mongoose.connection.host || 'MongoDB Atlas') : 'In-Memory Storage',
  message: connectionMessage,
});
