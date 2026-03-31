// BackEnd/server.js
import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import connectDB from './config/db.js';

import claimRoutes      from './routes/claimRoutes.js';
import authRoutes       from './routes/authRoutes.js';
import policyRoutes     from './routes/policyRoutes.js';
import enrollmentRoutes from './routes/enrollmentRoutes.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';

connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => res.send('API is running...'));

app.use('/api/auth',        authRoutes);
app.use('/api/claims',      claimRoutes);
app.use('/api/policies',    policyRoutes);
app.use('/api/enrollments', enrollmentRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));