// F:\Mehnat\BackEnd\models\ClaimModel.js

import mongoose from 'mongoose';

const claimSchema = mongoose.Schema({
    // Links the claim to the specific Farmer (User) who created it.
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User', // References the User model
    },
    
    // --- NEW: Link to the Policy Claimed Against (Future Policy Model) ---
    policy: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Policy', // Assumes a 'Policy' model will be created later
    },
    
    // Core Claim Details
    claimDate: {
        type: Date,
        default: Date.now,
    },
    farmAreaAffected: {
        type: Number, // Area in acres or square meters
        required: true,
    },
    cropType: {
        type: String,
        required: true,
    },
    lossDescription: {
        type: String,
        required: true,
    },
    estimatedLossValue: {
        type: Number, // Monetary value of the loss
        required: true,
    },
    
    // --- NEW: Image Proof Field ---
    proofImageUrl: {
        type: String, // Stores the URL/path to the uploaded image file
        required: true,
    },

    // Processing and Status
    status: {
        type: String,
        required: true,
        enum: ['Pending', 'Review', 'Approved', 'Rejected'],
        default: 'Pending',
    },
    proposerReviewer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // References the Proposer (User) who handles the claim
    },

}, {
    timestamps: true,
});

const Claim = mongoose.model('Claim', claimSchema);

export default Claim;