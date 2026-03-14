import mongoose from 'mongoose';

const ServiceRequestSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  serviceType: { type: String, required: true },
  location: { type: String, required: true },
  targetDate: { type: Date, required: true },
  priority: { type: String, enum: ['Normal Ops', 'High Priority', 'Urgent Dispatch'], default: 'Normal Ops' },
  details: { type: String, required: true },
  status: { type: String, enum: ['pending', 'vetted', 'completed'], default: 'pending' },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.ServiceRequest || mongoose.model('ServiceRequest', ServiceRequestSchema);