// BackEnd/controllers/enrollmentController.js
import asyncHandler from 'express-async-handler';
import Enrollment from '../models/enrollmentModel.js';
import Policy from '../models/PolicyModel.js';

// @route POST /api/enrollments/apply
// @access Private (Farmer)
const applyEnrollment = asyncHandler(async (req, res) => {
    if (req.user.role !== 'Farmer') {
        res.status(403); throw new Error('Only Farmers can enroll in policies.');
    }
    const { policyId, cropType, farmArea, farmRegion, startDate, nominee, paymentMethod, emiFrequency } = req.body;

    const policy = await Policy.findById(policyId);
    if (!policy) { res.status(404); throw new Error('Policy not found.'); }

    // Check if already enrolled
    const existing = await Enrollment.findOne({ farmer: req.user._id, policy: policyId, status: { $ne: 'Rejected' } });
    if (existing) { res.status(400); throw new Error('You are already enrolled in this policy.'); }

    const enrollment = await Enrollment.create({
        farmer: req.user._id,
        policy: policyId,
        cropType, farmArea, farmRegion, startDate, nominee,
        paymentMethod: paymentMethod || 'upi',
        emiFrequency: emiFrequency || 'monthly',
        status: 'Pending',
    });

    res.status(201).json({ message: 'Enrollment request submitted. Awaiting provider approval.', enrollmentId: enrollment._id });
});

// @route GET /api/enrollments/mine
// @access Private (Farmer) — get my enrollments
const getMyEnrollments = asyncHandler(async (req, res) => {
    const enrollments = await Enrollment.find({ farmer: req.user._id })
        .populate('policy', 'name companyName coverageType premiumPrice coverageAmount')
        .sort({ createdAt: -1 });
    res.json(enrollments);
});

// @route GET /api/enrollments/pending
// @access Private (Proposer) — get pending enrollments for their policies
const getPendingEnrollments = asyncHandler(async (req, res) => {
    if (req.user.role !== 'Proposer' && req.user.role !== 'Admin') {
        res.status(403); throw new Error('Not authorized.');
    }
    // Find policies owned by this proposer
    const myPolicies = await Policy.find({ proposer: req.user._id }).select('_id');
    const policyIds = myPolicies.map(p => p._id);

    const enrollments = await Enrollment.find({ policy: { $in: policyIds }, status: 'Pending' })
        .populate('farmer', 'name email')
        .populate('policy', 'name companyName')
        .sort({ createdAt: -1 });
    res.json(enrollments);
});

// @route PUT /api/enrollments/:id/status
// @access Private (Proposer)
const updateEnrollmentStatus = asyncHandler(async (req, res) => {
    if (req.user.role !== 'Proposer' && req.user.role !== 'Admin') {
        res.status(403); throw new Error('Not authorized.');
    }
    const { status } = req.body;
    if (!['Approved', 'Rejected'].includes(status)) {
        res.status(400); throw new Error('Invalid status.');
    }
    const enrollment = await Enrollment.findById(req.params.id).populate('policy', 'proposer');
    if (!enrollment) { res.status(404); throw new Error('Enrollment not found.'); }

    // Ownership check
    if (req.user.role === 'Proposer' && enrollment.policy.proposer.toString() !== req.user._id.toString()) {
        res.status(403); throw new Error('Not authorized to update this enrollment.');
    }

    enrollment.status = status;
    await enrollment.save();
    res.json({ message: `Enrollment ${status.toLowerCase()} successfully.`, status });
});

export { applyEnrollment, getMyEnrollments, getPendingEnrollments, updateEnrollmentStatus };