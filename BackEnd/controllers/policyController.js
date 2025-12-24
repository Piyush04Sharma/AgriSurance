// // F:\Mehnat\BackEnd\controllers\policyController.js

// import asyncHandler from 'express-async-handler';
// import Policy from '../models/PolicyModel.js'; 

// // @desc    Create a new insurance policy
// // @route   POST /api/policies/create
// // @access  Private (Proposer or Admin role)
// const createPolicy = asyncHandler(async (req, res) => {
//     // 1. Role Check
//     if (req.user.role !== 'Proposer' && req.user.role !== 'Admin') {
//         res.status(403);
//         throw new Error('Only Proposers and Admins can create policies.');
//     }

//     const { name, description, coverageType, premiumPrice, coverageAmount } = req.body;

//     // 2. Simple Validation
//     if (!name || !premiumPrice || !coverageAmount) {
//         res.status(400);
//         throw new Error('Please provide name, premium, and coverage amount.');
//     }

//     // 3. Create Policy in Database
//     const policy = await Policy.create({
//         name,
//         description,
//         coverageType,
//         premiumPrice,
//         coverageAmount,
//         proposer: req.user._id, // Assign the policy to the currently logged-in Proposer
//     });

//     res.status(201).json({
//         message: 'Policy created successfully.',
//         policy,
//     });
// });

// // --- NEW FUNCTION: Get all active policies for the Farmer's view ---
// // @desc    Get all active policy plans
// // @route   GET /api/policies/active
// // @access  Private (or logged-in user)
// const getAllPolicies = asyncHandler(async (req, res) => {
//     // Fetch all policies that are marked as active
//     const policies = await Policy.find({ isActive: true })
//         .select('-__v -updatedAt') // Exclude unnecessary fields
//         .populate('proposer', 'name email'); // Show which Proposer created it

//     res.json(policies);
// });

// // --- EXPORT BOTH FUNCTIONS ---
// export { createPolicy, getAllPolicies };


// F:\Mehnat\BackEnd\controllers\policyController.js

import asyncHandler from 'express-async-handler';
import Policy from '../models/PolicyModel.js'; 

// @desc    Create a new insurance policy
// @route   POST /api/policies/create
// @access  Private (Proposer or Admin role)
const createPolicy = asyncHandler(async (req, res) => {
    // 1. Role Check
    if (req.user.role !== 'Proposer' && req.user.role !== 'Admin') {
        res.status(403);
        throw new Error('Only Proposers and Admins can create policies.');
    }

    const { name, description, coverageType, premiumPrice, coverageAmount, companyName } = req.body; // <-- ADD companyName

    // 2. Simple Validation
    if (!name || !premiumPrice || !coverageAmount || !companyName) { // <-- ADD companyName validation
        res.status(400);
        throw new Error('Please provide name, premium, coverage amount, and company name.');
    }

    // 3. Create Policy in Database
    const policy = await Policy.create({
        name,
        description,
        coverageType,
        premiumPrice,
        coverageAmount,
        companyName, // <-- ADDED HERE
        proposer: req.user._id, // Assign the policy to the currently logged-in Proposer
    });

    res.status(201).json({
        message: 'Policy created successfully.',
        policy,
    });
});

// --- NEW FUNCTION: Get all active policies for the Farmer's view ---
// @desc    Get all active policy plans
// @route   GET /api/policies/active
// @access  Private (or logged-in user)
const getAllPolicies = asyncHandler(async (req, res) => {
    // Fetch all policies that are marked as active
    const policies = await Policy.find({ isActive: true })
        .select('-__v -updatedAt') // Exclude unnecessary fields
        // CRITICAL: We need companyName here, which is already in the Policy model
        .populate('proposer', 'name email'); // Show which Proposer created it

    res.json(policies);
});

// --- EXPORT BOTH FUNCTIONS ---
export { createPolicy, getAllPolicies };