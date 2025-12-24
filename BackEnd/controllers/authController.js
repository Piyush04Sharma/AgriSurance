// backend/controllers/authController.js

import User from '../models/UserModel.js';
import generateToken from '../utils/generateToken.js';
import asyncHandler from 'express-async-handler';

const getAuthResponse = (user, token) => ({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    isVerified: user.isVerified,
    token: token,
});

// @desc 	Register a new user
// @route 	POST /api/auth/register
const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password, role, farmDetails, companyName, licenseNumber } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
        res.status(400);
        throw new Error('User already exists');
    }

    const initialVerification = (role === 'Admin'); // Admins are self-verified 

    const user = await User.create({
        name,
        email,
        password,
        role,
        isVerified: initialVerification,
        farmDetails: role === 'Farmer' ? farmDetails : undefined,
        companyName: role === 'Proposer' ? companyName : undefined,
        licenseNumber: role === 'Proposer' ? licenseNumber : undefined,
    });

    if (user) {
        res.status(201).json(getAuthResponse(user, generateToken(user._id)));
    } else {
        res.status(400);
        throw new Error('Invalid user data received');
    }
});

// @desc 	Authenticate user & get token
// @route 	POST /api/auth/login
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    // matchPassword uses bcrypt to compare hash
    if (user && (await user.matchPassword(password))) { 
        res.json(getAuthResponse(user, generateToken(user._id)));
    } else {
        res.status(401);
        throw new Error('Invalid email or password');
    }
});

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private (Requires JWT)
const getProfile = asyncHandler(async (req, res) => {
    // The 'protect' middleware adds the verified user object (req.user) to the request
    // We only send the necessary data back to the frontend
    res.json({
        user: {
            _id: req.user._id,
            name: req.user.name,
            email: req.user.email,
            role: req.user.role,
            isVerified: req.user.isVerified,
        },
        message: 'Protected user profile data retrieved successfully.'
    });
});


// --- FINAL EXPORT: CRITICAL FIX ---
export { 
    registerUser, 
    loginUser, 
    getProfile // <-- ADDED getProfile TO EXPORTS 
};