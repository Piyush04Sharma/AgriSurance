// // F:\Mehnat\BackEnd\models\PolicyModel.js

// import mongoose from 'mongoose';

// const policySchema = mongoose.Schema({
//     name: {
//         type: String,
//         required: true,
//         unique: true,
//     },
//     description: {
//         type: String,
//         required: true,
//     },
//     coverageType: {
//         type: String,
//         required: true,
//         enum: ['Drought', 'Flood', 'Pest'],
//     },
//     premiumPrice: {
//         type: Number,
//         required: true,
//     },
//     coverageAmount: {
//         type: Number,
//         required: true,
//     },
//     isActive: {
//         type: Boolean,
//         default: true,
//     },
//     // The Proposer who created this policy template
//     proposer: {
//         type: mongoose.Schema.Types.ObjectId,
//         required: true,
//         ref: 'User', 
//     },
// }, {
//     timestamps: true,
// });

// const Policy = mongoose.model('Policy', policySchema);

// export default Policy;


// F:\Mehnat\BackEnd\models\PolicyModel.js

import mongoose from 'mongoose';

const policySchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    description: {
        type: String,
        required: true,
    },
    coverageType: {
        type: String,
        required: true,
        enum: ['Drought', 'Flood', 'Pest'],
    },
    premiumPrice: {
        type: Number,
        required: true,
    },
    coverageAmount: {
        type: Number,
        required: true,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    // The Proposer who created this policy template
    proposer: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User', 
    },
    // --- NEW FIELD: Company Name ---
    companyName: {
        type: String,
        required: true,
    },
}, {
    timestamps: true,
});

const Policy = mongoose.model('Policy', policySchema);

export default Policy;