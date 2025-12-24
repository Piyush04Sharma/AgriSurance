// F:\Mehnat\BackEnd\routes\policyRoutes.js

import express from 'express';
import { protect } from '../middleware/authMiddleware.js'; 
import { createPolicy, getAllPolicies } from '../controllers/policyController.js'; // <-- CRITICAL: IMPORT NEW FUNCTION

const router = express.Router();

// POST /create (Proposer creates a policy)
router.post('/create', protect, createPolicy);

// --- NEW ROUTE: Get Active Policies ---
// GET /active (Farmer will call this)
// This route is protected, requiring a valid JWT from any logged-in user.
router.get('/active', protect, getAllPolicies);


export default router;