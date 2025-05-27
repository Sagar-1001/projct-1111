import mongoose from 'mongoose';
import dotenv from 'dotenv';


dotenv.config();

const connectDB = async () => {
  try {
    
    const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/videocall';
    
    
    const conn = await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, 
      retryWrites: true
    });
    
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    
    console.error('Server will continue running without database functionality');
    return null;
  }
};

export default connectDB;
