// backend/models/UserModel.js

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = mongoose.Schema({
    // Shared Fields
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { 
        type: String, 
        required: true, 
        enum: ['Farmer', 'Proposer', 'Admin'] // Enforces allowed roles
    },
    isVerified: { 
        type: Boolean, 
        default: false // Requires Admin approval for Farmer/Proposer
    },

    // Farmer Specific Fields
    farmDetails: {
        region: { type: String },
        totalAcreage: { type: Number },
    },
    
    // Proposer Specific Fields
    companyName: { type: String },
    licenseNumber: { type: String }

}, {
    timestamps: true // Adds createdAt and updatedAt fields
});

// --- Security Middleware: Hashing Password Before Saving ---
userSchema.pre('save', async function (next) {
    // Only hash if the password field is modified
    if (!this.isModified('password')) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// --- Custom Method: Comparing Passwords ---
userSchema.methods.matchPassword = async function (enteredPassword) {
    // Compares the entered password with the stored hash
    return await bcrypt.compare(enteredPassword, this.password);
};


const User = mongoose.model('User', userSchema);

export default User;