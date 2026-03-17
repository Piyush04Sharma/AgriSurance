// BackEnd/controllers/claimController.js

import asyncHandler from 'express-async-handler';
import Claim from '../models/ClaimModel.js';
import Policy from '../models/PolicyModel.js';
import User from '../models/UserModel.js';
import fs from 'fs';
import nodemailer from 'nodemailer';

// ── EMAIL TRANSPORTER ──────────────────────────────────────────
// Uses Gmail. Set GMAIL_USER and GMAIL_PASS in your .env file.
// For Gmail: enable "App Passwords" under Google Account > Security.
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS, // Use App Password, NOT your real Gmail password
    },
});

const sendStatusEmail = async ({ toEmail, farmerName, cropType, status, policyName, estimatedLoss }) => {
    const isApproved = status === 'Approved';

    const subject = isApproved
        ? `✅ Your Claim Has Been Approved — AgriSurance`
        : `❌ Your Claim Has Been Rejected — AgriSurance`;

    const html = `
    <div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; background: #f9f6f0; border-radius: 12px; overflow: hidden;">
        
        <!-- Header -->
        <div style="background: ${isApproved ? '#1a6b3c' : '#7f1d1d'}; padding: 30px 40px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 26px;">
                ${isApproved ? '✅ Claim Approved' : '❌ Claim Rejected'}
            </h1>
            <p style="color: rgba(255,255,255,0.8); margin: 8px 0 0; font-size: 14px;">AgriSurance · Crop Insurance Platform</p>
        </div>

        <!-- Body -->
        <div style="padding: 36px 40px; background: #ffffff;">
            <p style="font-size: 16px; color: #333; margin-bottom: 20px;">
                Dear <strong>${farmerName}</strong>,
            </p>
            <p style="font-size: 15px; color: #555; line-height: 1.7; margin-bottom: 24px;">
                ${isApproved
                    ? `We are pleased to inform you that your insurance claim has been <strong style="color: #1a6b3c;">approved</strong>. The payout process has been initiated and funds will be disbursed to your registered account within <strong>2–3 business days</strong>.`
                    : `We regret to inform you that your insurance claim has been <strong style="color: #7f1d1d;">rejected</strong> after review. If you believe this is incorrect, please contact your insurance provider or re-submit with additional documentation.`
                }
            </p>

            <!-- Claim Details Table -->
            <div style="background: #f5f0e8; border-radius: 10px; padding: 20px 24px; margin-bottom: 28px;">
                <h3 style="margin: 0 0 16px; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; color: #888;">Claim Details</h3>
                <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
                    <tr style="border-bottom: 1px solid #e0d8cc;">
                        <td style="padding: 9px 0; color: #888;">Policy</td>
                        <td style="padding: 9px 0; font-weight: 600; color: #333; text-align: right;">${policyName}</td>
                    </tr>
                    <tr style="border-bottom: 1px solid #e0d8cc;">
                        <td style="padding: 9px 0; color: #888;">Crop Type</td>
                        <td style="padding: 9px 0; font-weight: 600; color: #333; text-align: right;">${cropType}</td>
                    </tr>
                    <tr style="border-bottom: 1px solid #e0d8cc;">
                        <td style="padding: 9px 0; color: #888;">Estimated Loss</td>
                        <td style="padding: 9px 0; font-weight: 600; color: #c9993a; text-align: right;">₹${Number(estimatedLoss).toLocaleString('en-IN')}</td>
                    </tr>
                    <tr>
                        <td style="padding: 9px 0; color: #888;">Status</td>
                        <td style="padding: 9px 0; text-align: right;">
                            <span style="background: ${isApproved ? '#e8f5ee' : '#fde8e8'}; color: ${isApproved ? '#1a6b3c' : '#7f1d1d'}; padding: 3px 12px; border-radius: 20px; font-weight: 700; font-size: 13px;">
                                ${status}
                            </span>
                        </td>
                    </tr>
                </table>
            </div>

            ${isApproved ? `
            <div style="background: #e8f5ee; border-left: 4px solid #1a6b3c; padding: 14px 18px; border-radius: 6px; margin-bottom: 24px;">
                <p style="margin: 0; font-size: 14px; color: #1a6b3c;">
                    <strong>Next Steps:</strong> Your payout of ₹${Number(estimatedLoss).toLocaleString('en-IN')} will be transferred within 2–3 business days. You'll receive a separate transaction confirmation.
                </p>
            </div>` : `
            <div style="background: #fde8e8; border-left: 4px solid #7f1d1d; padding: 14px 18px; border-radius: 6px; margin-bottom: 24px;">
                <p style="margin: 0; font-size: 14px; color: #7f1d1d;">
                    <strong>What to do next:</strong> Visit your dashboard to view the rejection reason, or contact your insurance provider for more details. You may re-submit with better documentation.
                </p>
            </div>`}

            <p style="font-size: 13px; color: #aaa; text-align: center; margin-top: 30px;">
                AgriSurance · Protecting Every Harvest · <a href="http://localhost:5173" style="color: #c9993a;">Visit Dashboard</a>
            </p>
        </div>

        <!-- Footer -->
        <div style="padding: 18px 40px; background: #1c1710; text-align: center;">
            <p style="color: #666; font-size: 12px; margin: 0;">
                © 2025 AgriSurance. This is an automated notification — please do not reply to this email.
            </p>
        </div>
    </div>`;

    try {
        await transporter.sendMail({
            from: `"AgriSurance 🌾" <${process.env.GMAIL_USER}>`,
            to: toEmail,
            subject,
            html,
        });
        console.log(`📧 Email sent to ${toEmail} — Claim ${status}`);
    } catch (err) {
        // Don't crash the API if email fails — just log it
        console.error(`⚠️ Email failed to send: ${err.message}`);
    }
};

// ── SUBMIT CLAIM ───────────────────────────────────────────────
// @route  POST /api/claims/submit
// @access Private (Farmer only)
const submitClaim = asyncHandler(async (req, res) => {
    if (req.user.role !== 'Farmer') {
        res.status(403);
        throw new Error('Only Farmers are authorized to submit claims.');
    }

    if (!req.file) {
        res.status(400);
        throw new Error('Image proof (claimImage) is required.');
    }

    const { farmAreaAffected, cropType, lossDescription, estimatedLossValue, policy: policyId } = req.body;

    if (!farmAreaAffected || !cropType || !lossDescription || !estimatedLossValue || !policyId) {
        fs.unlinkSync(req.file.path);
        res.status(400);
        throw new Error('Please fill all required text fields.');
    }

    // Look up the policy to find who the proposer is
    const policy = await Policy.findById(policyId);
    if (!policy) {
        fs.unlinkSync(req.file.path);
        res.status(404);
        throw new Error('Policy not found.');
    }

    // File Handling
    const fileExtension = req.file.originalname.split('.').pop();
    const newFileName = `${req.file.filename}.${fileExtension}`;
    const newFilePath = `uploads/${newFileName}`;
    fs.renameSync(req.file.path, newFilePath);

    // Create Claim — link to the policy's actual proposer
    const claim = await Claim.create({
        user: req.user._id,
        policy: policyId,
        farmAreaAffected,
        cropType,
        lossDescription,
        estimatedLossValue,
        proofImageUrl: newFilePath,
        status: 'Pending',
        proposerReviewer: policy.proposer, // ← automatically assign to the policy's owner
    });

    res.status(201).json({
        message: 'Claim submitted successfully and is pending review.',
        claimId: claim._id,
        imageUrl: claim.proofImageUrl,
    });
});

// ── GET PENDING CLAIMS ─────────────────────────────────────────
// @route  GET /api/claims/pending
// @access Private (Proposer or Admin)
const getPendingClaims = asyncHandler(async (req, res) => {
    if (req.user.role !== 'Proposer' && req.user.role !== 'Admin') {
        res.status(403);
        throw new Error('Not authorized to view pending claims.');
    }

    let filter = { status: 'Pending' };

    // Proposers only see claims assigned to THEM (via their own policies)
    // Admins see all pending claims
    if (req.user.role === 'Proposer') {
        filter.proposerReviewer = req.user._id;
    }

    const pendingClaims = await Claim.find(filter)
        .select('-__v')
        .populate('policy', 'name companyName coverageType')
        .populate('user', 'name email')
        .sort({ createdAt: -1 });

    res.json(pendingClaims);
});

// ── GET MY CLAIMS (Farmer) ─────────────────────────────────────
// @route  GET /api/claims/myclaims
// @access Private (Farmer only)
const getMyClaims = asyncHandler(async (req, res) => {
    if (req.user.role !== 'Farmer') {
        res.status(403);
        throw new Error('Only Farmers can view their own claims.');
    }

    const claims = await Claim.find({ user: req.user._id })
        .populate('policy', 'name companyName coverageType')
        .sort({ createdAt: -1 });

    res.json(claims);
});

// ── UPDATE CLAIM STATUS ────────────────────────────────────────
// @route  PUT /api/claims/:id/status
// @access Private (Proposer or Admin)
const updateClaimStatus = asyncHandler(async (req, res) => {
    const { status } = req.body;
    const claimId = req.params.id;

    if (req.user.role !== 'Proposer' && req.user.role !== 'Admin') {
        res.status(403);
        throw new Error('Not authorized to update claim status.');
    }

    const validStatuses = ['Approved', 'Rejected'];
    if (!validStatuses.includes(status)) {
        res.status(400);
        throw new Error('Invalid status. Must be Approved or Rejected.');
    }

    // Populate policy and user so we can verify ownership and send email
    const claim = await Claim.findById(claimId)
        .populate('policy', 'name companyName proposer')
        .populate('user', 'name email');

    if (!claim) {
        res.status(404);
        throw new Error('Claim not found.');
    }

    // ── OWNERSHIP CHECK ──
    // Proposers can only update claims that belong to their own policies
    if (req.user.role === 'Proposer') {
        const policyOwnerId = claim.policy?.proposer?.toString();
        const requesterId = req.user._id.toString();

        if (policyOwnerId !== requesterId) {
            res.status(403);
            throw new Error('You are not authorized to update this claim. It belongs to a different provider\'s policy.');
        }
    }

    // Update status
    claim.status = status;
    await claim.save();

    // ── SEND EMAIL TO FARMER ──
    if (claim.user?.email) {
        await sendStatusEmail({
            toEmail: claim.user.email,
            farmerName: claim.user.name || 'Farmer',
            cropType: claim.cropType,
            status,
            policyName: claim.policy?.name || 'Your Policy',
            estimatedLoss: claim.estimatedLossValue,
        });
    }

    res.json({
        message: `Claim ${claimId} successfully set to ${status}. Farmer notified by email.`,
        newStatus: claim.status,
    });
});

export { submitClaim, getPendingClaims, getMyClaims, updateClaimStatus };
