import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true 
  },
  password: { 
    type: String, 
    required: true 
  },
  phone: {
    type: String,
    default: ""
  },

  userType: {
    type: String,
    enum: ['candidate', 'employer'],
    required: true
  },

  
  role: { 
    type: String, 
    enum: ['admin', 'staff', 'client'], 
    default: 'client' 
  },

  
  status: { 
    type: String, 
    enum: ['active', 'pending', 'deactivated', 'rejected'],
    default: 'active' 
  },

 
  employerProfile: {
    companyName: { type: String, default: null },
    rcNumber: { type: String, default: null }, 
    officeAddress: { type: String, default: null },
    industry: { type: String, default: null },
    website: { type: String, default: null },
    isApproved: { type: Boolean, default: false }
  },

 
  resetPasswordToken: {
    type: String,
    default: null
  },
  resetPasswordExpires: {
    type: Date,
    default: null
  },
  
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

export default mongoose.models.User || mongoose.model('User', UserSchema);