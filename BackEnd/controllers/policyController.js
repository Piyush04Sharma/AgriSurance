// BackEnd/controllers/policyController.js

import asyncHandler from 'express-async-handler';
import Policy from '../models/PolicyModel.js';

// @desc    Create a new insurance policy
// @route   POST /api/policies/create
// @access  Private (Proposer or Admin)
const createPolicy = asyncHandler(async (req, res) => {
    if (req.user.role !== 'Proposer' && req.user.role !== 'Admin') {
        res.status(403);
        throw new Error('Only Proposers and Admins can create policies.');
    }

    const { name, description, coverageType, premiumPrice, coverageAmount, companyName } = req.body;

    if (!name || !premiumPrice || !coverageAmount || !companyName) {
        res.status(400);
        throw new Error('Please provide name, premium, coverage amount, and company name.');
    }

    const policy = await Policy.create({
        name,
        description,
        coverageType,
        premiumPrice,
        coverageAmount,
        companyName,
        proposer: req.user._id, // ← always tied to the logged-in proposer
    });

    res.status(201).json({
        message: 'Policy created successfully.',
        policy,
    });
});


// @desc    Get ALL active policies — for FARMERS to browse
// @route   GET /api/policies/active
// @access  Private (any logged-in user)
const getAllPolicies = asyncHandler(async (req, res) => {
    // Farmers see ALL active policies from ALL providers
    const policies = await Policy.find({ isActive: true })
        .select('-__v -updatedAt')
        .populate('proposer', 'name email companyName')
        .sort({ createdAt: -1 });

    res.json(policies);
});


// @desc    Get only THIS proposer's own policies — for the Proposer dashboard
// @route   GET /api/policies/mine
// @access  Private (Proposer or Admin only)
const getMyPolicies = asyncHandler(async (req, res) => {
    if (req.user.role !== 'Proposer' && req.user.role !== 'Admin') {
        res.status(403);
        throw new Error('Not authorized.');
    }

    // Only fetch policies where proposer = currently logged-in user
    const policies = await Policy.find({
        proposer: req.user._id,
        isActive: true,
    })
        .select('-__v -updatedAt')
        .sort({ createdAt: -1 });

    res.json(policies);
});


export { createPolicy, getAllPolicies, getMyPolicies };