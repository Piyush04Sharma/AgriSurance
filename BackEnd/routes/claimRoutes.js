// // F:\Mehnat\BackEnd\routes\claimRoutes.js

// import express from 'express';
// import { protect } from '../middleware/authMiddleware.js'; 
// import { getPendingClaims, submitClaim } from '../controllers/claimController.js'; 
// import multer from 'multer';

// const router = express.Router();

// // Configure Multer for file storage
// // We'll store files temporarily in a folder named 'uploads'
// const upload = multer({ dest: 'uploads/' }); 

// // @desc    Submit a new insurance claim (Protected route)
// // @route   POST /api/claims/submit
// // @access  Private (Requires Farmer role)
// router.post(
//     '/submit', 
//     protect, // 1. Verify JWT token
//     upload.single('claimImage'), // 2. Handle the file upload (field name must be 'claimImage')
//     submitClaim // 3. Process the form and file data
// );

// router.get("/pending",protect,getPendingClaims)

// export default router;



// F:\Mehnat\BackEnd\routes\claimRoutes.js

import express from 'express';
import { protect } from '../middleware/authMiddleware.js'; 
// Import updateClaimStatus
import { getPendingClaims, submitClaim, updateClaimStatus } from '../controllers/claimController.js'; 
import multer from 'multer';

const router = express.Router();

// Configure Multer for file storage
const upload = multer({ dest: 'uploads/' }); 

// POST /submit (Farmer submits claim)
router.post(
    '/submit', 
    protect, 
    upload.single('claimImage'), 
    submitClaim 
);

router.get("/pending",protect,getPendingClaims)

// --- CRITICAL FIX: Add the PUT route for status update ---
router.put('/status/:id', protect, updateClaimStatus);

export default router;