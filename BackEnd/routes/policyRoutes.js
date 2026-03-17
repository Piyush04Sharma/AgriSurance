// BackEnd/routes/policyRoutes.js

import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { createPolicy, getAllPolicies, getMyPolicies } from '../controllers/policyController.js';

const router = express.Router();

// GET /api/policies/active  — ALL active policies (for Farmer marketplace)
router.get('/active', protect, getAllPolicies);

// GET /api/policies/mine    — Only THIS proposer's policies (for Proposer dashboard)
router.get('/mine', protect, getMyPolicies);

// POST /api/policies/create — Create a new policy
router.post('/create', protect, createPolicy);

export default router;