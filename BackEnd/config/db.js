// backend/config/db.js

import mongoose from 'mongoose';
import 'dotenv/config'; // Loads environment variables for ES Modules

const connectDB = async () => {
    try {
        // Attempt connection using the URI from the .env file
        const conn = await mongoose.connect(process.env.MONGO_URI);
        
        console.log(`MongoDB Connected: ${conn.connection.host}`);
        
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1); // Exit process with failure if connection fails
    }
};

export default connectDB;