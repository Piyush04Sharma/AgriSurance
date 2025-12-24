// F:\Mehnat\BackEnd\controllers\claimController.js

import asyncHandler from 'express-async-handler';
import Claim from '../models/ClaimModel.js'; 
import fs from 'fs'; 

// CRITICAL: Ensure this ID is the real MongoDB ID of the Proposer/Admin you are using to test
const TEST_PROPOSER_ID = '6925cdfc78c5f698409bf747'; 

// @desc    Submit a new claim
// @route   POST /api/claims/submit
// @access  Private (Farmer only)
const submitClaim = asyncHandler(async (req, res) => {
    // 1. Basic Role Check
    if (req.user.role !== 'Farmer') {
        res.status(403);
        throw new Error('Only Farmers are authorized to submit claims.');
    }
    
    // 2. Validate File and Body Data
    if (!req.file) {
        res.status(400);
        throw new Error('Image proof (claimImage) is required.');
    }

    const { farmAreaAffected, cropType, lossDescription, estimatedLossValue, policy } = req.body;

    // Check for missing fields
    if (!farmAreaAffected || !cropType || !lossDescription || !estimatedLossValue || !policy) {
        fs.unlinkSync(req.file.path); 
        res.status(400);
        throw new Error('Please fill all required text fields.');
    }

    // 3. File Handling (Move and Rename)
    const fileExtension = req.file.originalname.split('.').pop();
    const newFileName = `${req.file.filename}.${fileExtension}`;
    const newFilePath = `uploads/${newFileName}`;
    
    fs.renameSync(req.file.path, newFilePath);
    
    // 4. Create Claim in Database
    const claim = await Claim.create({
        user: req.user._id, 
        policy: policy, 
        farmAreaAffected: farmAreaAffected,
        cropType: cropType,
        lossDescription: lossDescription,
        estimatedLossValue: estimatedLossValue,
        proofImageUrl: newFilePath, 
        status: 'Pending',
        
        // CRITICAL FIX: Assign the claim for review
        proposerReviewer: TEST_PROPOSER_ID, 
    });

    res.status(201).json({
        message: 'Claim submitted successfully and is pending review.',
        claimId: claim._id,
        imageUrl: claim.proofImageUrl
    });
});


// @desc    Get all pending claims for review
// @route   GET /api/claims/pending
// @access  Private (Proposer or Admin role)
const getPendingClaims = asyncHandler(async (req, res) => {
    // 1. Role Check
    if (req.user.role !== 'Proposer' && req.user.role !== 'Admin') {
        res.status(403);
        throw new Error('Not authorized to view pending claims.');
    }
    
    // Determine the query filter
    let filter = { status: 'Pending' };

    // 2. Fetch Claims: Remove the complex populate operation to prevent data crash
    const pendingClaims = await Claim.find(filter) 
        .select('-__v -policy -proposerReviewer'); // Select necessary fields, exclude complex IDs for simplicity
        // Note: We remove .populate() entirely here.
    console.log("pendingClaims: ",pendingClaims);
    res.json(pendingClaims);
});

// @desc    Update claim status (Approve/Reject)
const updateClaimStatus = asyncHandler(async (req, res) => {
    const { status } = req.body;
    const claimId = req.params.id;

    // 1. Role Check
    if (req.user.role !== 'Proposer' && req.user.role !== 'Admin') {
        res.status(403);
        throw new Error('Not authorized to update claim status.');
    }

    // 2. Validate Input Status
    const validStatuses = ['Approved', 'Rejected'];
    if (!validStatuses.includes(status)) {
        res.status(400);
        throw new Error('Invalid status provided. Must be Approved or Rejected.');
    }
    
    // 3. Find Claim and Authorization Check (Simplified for testing)
    const claim = await Claim.findById(claimId);

    if (!claim) {
        res.status(404);
        throw new Error('Claim not found.');
    }

    // 4. Update Status
    claim.status = status;
    await claim.save();

    res.json({
        message: `Claim ID ${claimId} successfully set to ${status}.`,
        newStatus: claim.status,
    });
});


export { submitClaim, getPendingClaims, updateClaimStatus };