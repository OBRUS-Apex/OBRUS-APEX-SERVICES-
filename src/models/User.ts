import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, default: "" },
  userType: { 
    type: String, 
    enum: ['candidate', 'employer', 'service'], 
    required: [true, 'Please specify your account purpose'] 
  },
  role: { type: String, enum: ['admin', 'staff', 'client'], default: 'client' },
  status: { 
    type: String, 
    enum: ['active', 'pending', 'deactivated', 'rejected'],
    default: 'active' 
  },
  employerProfile: {
    companyName: { type: String },
    rcNumber: { type: String },
    officeAddress: { type: String },
    industry: { type: String },
  },
  resetPasswordToken: { type: String, default: null },
  resetPasswordExpires: { type: Date, default: null },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.User || mongoose.model('User', UserSchema);