// BackEnd/routes/enrollmentRoutes.js
import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { applyEnrollment, getMyEnrollments, getPendingEnrollments, updateEnrollmentStatus } from '../controllers/enrollmentController.js';

const router = express.Router();

router.post('/apply',          protect, applyEnrollment);
router.get('/mine',            protect, getMyEnrollments);
router.get('/pending',         protect, getPendingEnrollments);
router.put('/:id/status',      protect, updateEnrollmentStatus);

export default router;