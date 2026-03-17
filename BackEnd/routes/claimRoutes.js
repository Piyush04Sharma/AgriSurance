// BackEnd/routes/claimRoutes.js

import express from 'express';
import multer from 'multer';
import path from 'path';
import { protect } from '../middleware/authMiddleware.js';
import {
    submitClaim,
    getPendingClaims,
    getMyClaims,
    updateClaimStatus,
} from '../controllers/claimController.js';

const router = express.Router();

// ── MULTER FILE UPLOAD SETUP ───────────────────────────────────
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueName = `claim_${Date.now()}_${Math.round(Math.random() * 1e9)}`;
        cb(null, uniqueName);
    },
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp|heic/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed (jpg, png, gif, webp)'));
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max
});

// ── ROUTES ─────────────────────────────────────────────────────

// POST /api/claims/submit  — Farmer submits a claim with image
router.post('/submit', protect, upload.single('claimImage'), submitClaim);

// GET /api/claims/pending  — Proposer/Admin sees only their own policy claims
router.get('/pending', protect, getPendingClaims);

// GET /api/claims/myclaims — Farmer sees their own claims
router.get('/myclaims', protect, getMyClaims);

// PUT /api/claims/:id/status — Proposer/Admin approves or rejects
router.put('/:id/status', protect, updateClaimStatus);

export default router;
