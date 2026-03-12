import mongoose from 'mongoose';

const HseEnquirySchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  organisation: { type: String },
  service: { type: String, required: true },
  participants: { type: Number },
  timeline: { type: String },
  details: { type: String },
  status: { type: String, enum: ['Pending', 'Contacted', 'Closed'], default: 'Pending' },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.HseEnquiry || mongoose.model('HseEnquiry', HseEnquirySchema);