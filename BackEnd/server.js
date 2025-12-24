// backend/server.js

import express from 'express';
import 'dotenv/config'; 
import cors from 'cors';
import connectDB from './config/db.js';

// --- ROUTE IMPORTS ---
import claimRoutes from './routes/claimRoutes.js'; 
import authRoutes from './routes/authRoutes.js'; 
import policyRoutes from './routes/policyRoutes.js'; 
import { notFound, errorHandler } from './middleware/errorHandler.js'; 

connectDB();

const app = express();

// --- Middleware ---
app.use(cors()); 
app.use(express.json()); // Allows server to read JSON body data

// --- Root Route for Testing ---
app.get('/', (req, res) => {
    res.send('API is running...');
});

// --- API Routes ---
app.use('/api/auth', authRoutes); 
app.use('/api/claims', claimRoutes); 
app.use('/api/policies', policyRoutes); // <-- Policy router linked

// --- Error Handlers (Place LAST) ---
app.use(notFound);
app.use(errorHandler);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));