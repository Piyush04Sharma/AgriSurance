// BackEnd/models/EnrollmentModel.js
import mongoose from 'mongoose';

const enrollmentSchema = mongoose.Schema({
    farmer: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    policy: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Policy' },
    cropType: { type: String, required: true },
    farmArea: { type: Number, required: true },
    farmRegion: { type: String, required: true },
    startDate: { type: Date, required: true },
    nominee: { type: String, default: '' },
    paymentMethod: { type: String, enum: ['upi', 'card', 'netbank'], default: 'upi' },
    emiFrequency: { type: String, enum: ['monthly', 'quarterly', 'annual'], default: 'monthly' },
    status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
}, { timestamps: true });

const Enrollment = mongoose.model('Enrollment', enrollmentSchema);
export default Enrollment;