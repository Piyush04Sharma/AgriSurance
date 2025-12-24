// F:\Mehnat\BackEnd\middleware\authMiddleware.js

import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from '../models/UserModel.js'; 

// CRITICAL FIX: Use the SAME hardcoded key as in generateToken.js
// Change EXPLICIT_SECRET to your .env value
const EXPLICIT_SECRET = '6bf6a2dddb2fb2da45b4c0373b1ca931d14ea0a7b5594b1c7f51e8013bf46f6b';
const protect = asyncHandler(async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];

            // Verify token using the hardcoded key
            const decoded = jwt.verify(token, EXPLICIT_SECRET); 

            req.user = await User.findById(decoded.userId).select('-password');

            if (req.user) {
                next();
            } else {
                res.status(401);
                throw new Error('Not authorized, user not found');
            }
        } catch (error) {
            console.error(error);
            res.status(401);
            throw new Error('Not authorized, token failed');
        }
    }

    if (!token) {
        res.status(401);
        throw new Error('Not authorized, no token');
    }
});

export { protect };